import React, { useState } from 'react'
import { X, Type, CheckCircle } from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { parseLyricsText } from '../utils/lrcUtils'
import { useTranslation } from '../i18n/translations'

const LyricsInput = () => {
  const [lyricsText, setLyricsText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { t } = useTranslation()
  
  const { 
    showLyricsInput, 
    setShowLyricsInput, 
    setLyrics 
  } = useLRCStore()

  const handleSubmit = async () => {
    if (!lyricsText.trim()) {
      return
    }

    setIsProcessing(true)
    
    try {
      const parsedLyrics = parseLyricsText(lyricsText)
      setLyrics(parsedLyrics)
      setShowLyricsInput(false)
      setLyricsText('')
    } catch (error) {
      console.error('Error processing lyrics:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setShowLyricsInput(false)
    setLyricsText('')
  }

  if (!showLyricsInput) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Type className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">{t('enterLyrics')}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2">
            {t('lyricsInstructions')}
          </p>
          <p className="text-gray-500 text-xs">
            {t('lyricsNote')}
          </p>
        </div>

        <div className="mb-6">
          <textarea
            value={lyricsText}
            onChange={(e) => setLyricsText(e.target.value)}
            placeholder={t('lyricsPlaceholder')}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            disabled={isProcessing}
            autoFocus
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Tip:</strong> {t('lyricsTip')}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isProcessing}
          >
            {t('closeWindow')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex items-center space-x-2"
            disabled={!lyricsText.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('processing')}</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>{t('continueToTiming')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LyricsInput
