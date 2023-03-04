import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'index.css'

import { InitializeGoogleAnalytics } from 'utils/google-analytics'

if (!window.location.href.includes('localhost')) {
  InitializeGoogleAnalytics()
  console.log('GA initialized.')
} else {
  console.log('Under local development environment. Analytics are off.')
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
