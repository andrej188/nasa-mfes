import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'
import Home from './Home'

const App = () => (
  <div className="mt-10 text-3xl text-red-500 mx-auto max-w-6xl">
    <Home />
  </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)