import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { TranscationProvider } from './context/TranscationContext'

ReactDOM.render(
  <TranscationProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TranscationProvider>,
  document.getElementById('root')
)
