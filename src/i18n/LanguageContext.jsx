import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const getStoredLanguage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lrc-editor-language') || 'th'
    }
    return 'th'
  }

  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage())

  const setLanguage = (lang) => {
    setCurrentLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lrc-editor-language', lang)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const value = {
    currentLanguage,
    setLanguage,
    t,
    isthai: currentLanguage === 'th',
    isEnglish: currentLanguage === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
