import React, { useState, useEffect } from 'react'
import {
  getHeaders,
  avgPostLenPerMonth,
  totalPostsByWeek,
  longestPostPerMonth,
  avgPostsPerUserPerMonth,
} from '../utils/methods'

function Main() {
  const [posts, setPosts] = useState([])
  const [metricData, setMetricData] = useState([])
  const [method, setMethod] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const regUrl = 'https://api.supermetrics.com/assignment/register'
  const postUrl = 'https://api.supermetrics.com/assignment/posts'

  const getData = async (token) => {
    let i = 1
    const allData = []
    const newArr = []

    while (i <= 10) {
      allData.push(
        await fetch(`${postUrl}?sl_token=${token}&page=${i}`)
          .then((response) => response.json())
          .then((fetch) => {
            return fetch.data.posts
          })
          .catch((error) => {
            setIsLoading(false)
            console.error(error)
          })
      )
      i += 1
    }

    for (var index = 0; index < allData.length; index++) {
      allData[index].map((a) => newArr.push(a))
    }
    setIsLoading(false)
    setPosts(newArr)
  }

  useEffect(() => {
    const getToken = async () => {
      setIsLoading(true)
      await fetch(regUrl, getHeaders())
        .then((response) => response.json())
        .then((token) => {
          getData(token.data.sl_token)
        })
        .catch((error) => {
          setIsLoading(false)
          console.error(error)
        })
    }
    getToken()
  }, [])

  const handleAvgPostLenPerMonth = async (e) => {
    e.preventDefault()
    setMetricData(avgPostLenPerMonth(posts))
    setMethod(1)
  }

  const handleLongestPostPerMonth = (e) => {
    e.preventDefault()
    setMetricData(longestPostPerMonth(posts))
    setMethod(2)
  }

  const handleTotalPostsByWeek = (e) => {
    e.preventDefault()
    setMetricData(totalPostsByWeek(posts))
    setMethod(3)
  }

  const handleAvgPostsPerUserPerMonth = (e) => {
    e.preventDefault()
    setMetricData(avgPostsPerUserPerMonth(posts))
    setMethod(4)
  }

  const handleDownload = async (e) => {
    e.preventDefault()
    const blob = new Blob([JSON.stringify(metricData)], {
      type: 'application/json',
    })
    const href = await URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {isLoading ? (
        <div>
          <h1>Loading Data. Please Wait!</h1>
        </div>
      ) : (
        <div>
          <h1>Metrics</h1>
          <button onClick={handleAvgPostLenPerMonth} className='button'>
            avgPostLenPerMonth
          </button>
          <button onClick={handleLongestPostPerMonth} className='button'>
            longestPostPerMonth
          </button>
          <button onClick={handleTotalPostsByWeek} className='button'>
            totalPostsByWeek
          </button>
          <button onClick={handleAvgPostsPerUserPerMonth} className='button'>
            avgPostsPerUserPerMonth
          </button>

          <div className='main'>
            {metricData.map((d, i) => {
              return (
                <div key={i}>
                  <span>
                    {method === 1 || method === 2 || method === 4
                      ? 'Month: '
                      : 'Week: '}
                    {d.key}
                  </span>
                  {' - '}
                  <span>
                    {method === 1
                      ? 'Avg: '
                      : method === 2
                      ? 'Longest: '
                      : method === 3
                      ? 'Total: '
                      : 'Avg: '}
                    {Math.round(d.result * 100) / 100}
                  </span>
                </div>
              )
            })}
          </div>
          <div>
            {metricData && metricData.length > 0 ? (
              <button onClick={handleDownload} className='button'>
                Download Metrics
              </button>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}

export default Main
