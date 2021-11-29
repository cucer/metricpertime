import React, { useEffect } from 'react'
import ReactGa from 'react-ga'
import './css/App.css'
import Main from './components/Main'

function App() {
  useEffect(() => {
    ReactGa.initialize('UA-62711254-5')
    ReactGa.pageview('/metrics')
  }, [])

  return (
    <div className='app'>
      <Main />
    </div>
  )
}

export default App
