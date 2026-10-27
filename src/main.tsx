import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PinGate } from './components/PinGate.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PinGate>
      <App />
    </PinGate>
  </StrictMode>,
)

// Register service worker for offline study support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}
