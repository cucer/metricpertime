import * as moment from 'moment'
import _ from 'lodash'
import { CLIENT_ID, EMAIL, NAME } from '../utils/client'

export const getHeaders = () => {
  var headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      email: EMAIL,
      name: NAME,
    }),
  }
  return headers
}

export const formatDate = (time, dateFormat) => moment(time).format(dateFormat)

export const groupByFormat = (data, dateFormat) =>
  _.groupBy(data, (item) => formatDate(item.created_time, dateFormat))

export const avgPostLenPerMonth = (data) => {
  const months = groupByFormat(data, 'MM/YYYY')
  const newArray = []
  Object.keys(months).map((group) => {
    const result =
      months[group].reduce((sum, item) => sum + item.message.length, 0) /
      months[group].length
    newArray.push({ key: group, result })
    return result
  })
  return newArray
}

export const totalPostsByWeek = (data) => {
  const weeks = groupByFormat(data, 'W/YYYY')
  const newArray = []
  Object.keys(weeks).map((group) => {
    const result = weeks[group].length
    newArray.push({ key: group, result })
    return result
  })
  return newArray
}

export const longestPostPerMonth = (data) => {
  const months = groupByFormat(data, 'MM/YYYY')
  const newArray = []
  Object.keys(months).map((group) => {
    // Method 1
    const result = Math.max.apply(
      null,
      months[group].map((a) => a.message.length)
    )
    // Method 2
    newArray.push({ key: group, result })
    return result
  })
  return newArray
}

export const avgPostsPerUserPerMonth = (data) => {
  const months = groupByFormat(data, 'MM/YYYY')
  const newArray = []
  Object.keys(months).map((group) => {
    const monthUsers = _.groupBy(months[group], 'from_id')
    const users = Object.keys(monthUsers).map((id) => monthUsers[id].length)
    const result = users.reduce((sum, item) => sum + item, 0) / users.length
    newArray.push({ key: group, result })
    return result
  })
  return newArray
}
