import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import ReactGA from 'react-ga4'

import 'index.css'

if (!window.location.href.includes('localhost')) {
  const measurementId = process.env.REACT_APP_measurementId as string
  ReactGA.initialize(measurementId)
} else {
  console.log('Under local development environment. Analytics are off.')
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
