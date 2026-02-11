import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeatherDisplay from './components/WeatherDisplay.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <WeatherDisplay></WeatherDisplay>
  </StrictMode>,
)
