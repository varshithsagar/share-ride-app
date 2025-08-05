import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
// import App from './App.jsx'
import SimpleApp from './SimpleApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>,
)
