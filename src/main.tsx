import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import { PreferencesProvider } from './features/preferences/PreferencesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </PreferencesProvider>
  </StrictMode>,
)

