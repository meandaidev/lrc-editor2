import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from '../i18n/translations'

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, t } = useTranslation()

  return (
    <div className="flex items-center space-x-2">
      <Globe size={16} className="text-gray-600" />
      <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
        <button
          onClick={() => setLanguage('th')}
          className={`px-3 py-1 text-sm rounded transition-all ${
            currentLanguage === 'th'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          ไทย
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-sm rounded transition-all ${
            currentLanguage === 'en'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}

export default LanguageSwitcher
