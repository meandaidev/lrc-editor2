import { useState } from 'react'
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
    setLyrics,
    setSkipLyricsInputModalOnce
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
    setSkipLyricsInputModalOnce(true)
  }

  if (!showLyricsInput) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Type className="text-blue-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{t('enterLyrics')}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="mb-3 sm:mb-4">
            <p className="text-gray-600 text-xs sm:text-sm mb-2">
              {t('lyricsInstructions')}
            </p>
            <p className="text-gray-500 text-xs">
              {t('lyricsNote')}
            </p>
          </div>

          <div className="mb-4 sm:mb-6">
            <textarea
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder={t('lyricsPlaceholder')}
              className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm font-mono"
              disabled={isProcessing}
              autoFocus
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
            <p className="text-yellow-800 text-xs sm:text-sm">
              <strong>Tip:</strong> {t('lyricsTip')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2"
            disabled={isProcessing}
          >
            {t('closeWindow')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2"
            disabled={!lyricsText.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                <span>{t('processing')}</span>
              </>
            ) : (
              <>
                <CheckCircle size={14} />
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
