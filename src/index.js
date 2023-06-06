import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App.jsx'

import PressedProvider from './pressedContext/pressedContext'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <PressedProvider>
      <App />
    </PressedProvider>
  </React.StrictMode>
)
