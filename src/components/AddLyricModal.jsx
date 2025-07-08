import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { useTranslation } from '../i18n/translations'

const AddLyricModal = () => {
  const [lyricText, setLyricText] = useState('')
  const [wasPlayingBeforeModal, setWasPlayingBeforeModal] = useState(false)
  const { t } = useTranslation()
  
  const {
    showAddLyricModal,
    addLyricIndex,
    isPlaying,
    audioRef,
    setShowAddLyricModal,
    setIsPlaying,
    addLyric
  } = useLRCStore()

  // Effect to handle pause/resume when modal opens/closes
  useEffect(() => {
    if (showAddLyricModal) {
      // Modal is opening - pause if playing
      if (isPlaying) {
        setWasPlayingBeforeModal(true)
        if (audioRef?.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
      } else {
        setWasPlayingBeforeModal(false)
      }
    }
  }, [showAddLyricModal, isPlaying, audioRef, setIsPlaying])

  const handleSubmit = () => {
    if (lyricText.trim()) {
      addLyric(lyricText, addLyricIndex)
      setLyricText('')
      closeModal()
    }
  }

  const handleCancel = () => {
    setLyricText('')
    closeModal()
  }

  const closeModal = () => {
    setShowAddLyricModal(false)
    
    // Resume playing if it was playing before modal opened
    if (wasPlayingBeforeModal && audioRef?.current) {
      setTimeout(() => {
        audioRef.current.play()
        setIsPlaying(true)
      }, 100) // Small delay to ensure modal is closed
    }
    
    // Reset state
    setWasPlayingBeforeModal(false)
  }

  if (!showAddLyricModal) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl w-full mx-2 sm:mx-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <Plus className="text-green-500" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{t('addNewLine')}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-gray-600 text-xs sm:text-sm mb-2">
            {t('enterLyricText')}
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={lyricText}
            onChange={(e) => setLyricText(e.target.value)}
            placeholder={t('enterLyricPlaceholder')}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSubmit()
              if (e.key === 'Escape') handleCancel()
            }}
            autoFocus
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleCancel}
            className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2"
            disabled={!lyricText.trim()}
          >
            {t('addLine')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddLyricModal
