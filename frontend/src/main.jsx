import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill for Excalidraw
if (typeof process === 'undefined') {
  window.process = { env: {} }
}
if (typeof global === 'undefined') {
  window.global = window
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
