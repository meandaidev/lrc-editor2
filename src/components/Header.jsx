import React from 'react'
import { Music2, RefreshCw } from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { useTranslation } from '../i18n/translations'
import LanguageSwitcher from './LanguageSwitcher'

const Header = () => {
  const { t } = useTranslation()
  const { lyrics, reset } = useLRCStore()
  
  const hasData = lyrics.length > 0
  
  const handleLogoClick = () => {
    // Check if there's any data that would be lost
    if (hasData) {
      const confirmMessage = t('resetConfirmMessage')
      const confirmReset = window.confirm(confirmMessage)
      
      if (confirmReset) {
        reset()
        // Optionally reload the page to ensure clean state
        window.location.reload()
      }
    } else {
      reset()
      window.location.reload()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
            title={t('backToHomeTooltip')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('appTitle')}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">{t('appSubtitle')}</p>
            </div>
          </div>

          {/* Right side - Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
