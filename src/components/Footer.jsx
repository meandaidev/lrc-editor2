import React from 'react'
import { Heart, Github, Music } from 'lucide-react'
import { useTranslation } from '../i18n/translations'

const Footer = () => {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">LRC Editor</span>
          </div>
          
          {/* Description */}
          <p className="text-xs text-gray-500 text-center max-w-md">
            {t('footerDescription')}
          </p>
          
          {/* Links */}
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <span>{t('madeWith')}</span>
              <Heart className="w-3 h-3 text-red-400" />
              <span>{t('by')} {t('developer')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>React + Vite</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Zustand</span>
            </div>
          </div>
          
          {/* Version */}
          <div className="text-xs text-gray-400">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
