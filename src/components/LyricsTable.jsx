import { useState } from 'react'
import { 
  Clock, 
  Plus, 
  Minus, 
  Edit, 
  Trash2,
  Target
} from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { formatTimeRange, formatTime } from '../utils/lrcUtils'
import { useTranslation } from '../i18n/translations'

const LyricsTable = () => {
  const [editingLyric, setEditingLyric] = useState(null)
  const [editText, setEditText] = useState('')
  const { t } = useTranslation()

  const {
    lyrics,
    currentLyricIndex,
    currentTime,
    isPlaying,
    audioRef,
    setLyricTime,
    adjustLyricTime,
    deleteLyric,
    updateLyric,
    jumpToLine,
    setShowAddLyricModal,
    setAddLyricIndex,
    setIsPlaying,
    skipLyricsInputModalOnce
  } = useLRCStore()

  const handleSetStartTime = (lyricId) => {
    setLyricTime(lyricId, 'startTime', currentTime)
  }

  const handleSetEndTime = (lyricId) => {
    setLyricTime(lyricId, 'endTime', currentTime)
  }

  const handleAdjustTime = (lyricId, timeType, adjustment) => {
    adjustLyricTime(lyricId, timeType, adjustment)
  }

  const handleEditLyric = (lyric) => {
    setEditingLyric(lyric.id)
    setEditText(lyric.text)
  }

  const handleSaveEdit = () => {
    if (editingLyric && editText.trim()) {
      updateLyric(editingLyric, { text: editText.trim() })
    }
    setEditingLyric(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingLyric(null)
    setEditText('')
  }

  const handleAddLyric = (index) => {
    console.log('handleAddLyric called, isPlaying:', isPlaying)
    console.log('audioRef:', audioRef)
    console.log('audioRef available:', !!audioRef)
    
    // Function to wait for audioRef to be ready
    const waitForAudioRef = (callback, maxAttempts = 10) => {
      let attempts = 0
      
      const checkAudioRef = () => {
        attempts++
        console.log(`Attempt ${attempts}: checking audioRef...`, !!audioRef)
        
        if (audioRef) {
          console.log('audioRef is ready, executing callback')
          callback()
        } else if (attempts < maxAttempts) {
          console.log(`audioRef not ready, retrying in 50ms (attempt ${attempts}/${maxAttempts})`)
          setTimeout(checkAudioRef, 50)
        } else {
          console.log('Max attempts reached, proceeding without audioRef')
          callback()
        }
      }
      
      checkAudioRef()
    }
    
    const executeAddLyric = () => {
      const hasAudioRef = !!audioRef
      const audioIsPlaying = hasAudioRef && !audioRef.paused
      const stateIsPlaying = isPlaying
      const wasPlaying = (stateIsPlaying || audioIsPlaying) && hasAudioRef
      
      console.log('Conditions - hasAudioRef:', hasAudioRef, 'audioIsPlaying:', audioIsPlaying, 'stateIsPlaying:', stateIsPlaying, 'wasPlaying:', wasPlaying)
      
      // Pause audio if playing before opening modal
      if (wasPlaying) {
        console.log('Pausing audio before opening add lyric modal')
        audioRef.pause()
        setIsPlaying(false)
        localStorage.setItem('wasPlayingBeforeModal', 'true')
        console.log('Set localStorage wasPlayingBeforeModal to true')
      } else {
        localStorage.removeItem('wasPlayingBeforeModal')
        console.log('Removed localStorage wasPlayingBeforeModal')
      }
      
      setAddLyricIndex(index)
      setShowAddLyricModal(true)
    }
    
    // If we're playing but don't have audioRef yet, wait for it
    if (isPlaying && !audioRef) {
      console.log('Audio is playing but audioRef not ready, waiting...')
      waitForAudioRef(executeAddLyric)
    } else {
      executeAddLyric()
    }
  }

  const handleJumpToLine = (index) => {
    jumpToLine(index)
  }

  if (lyrics.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('noLyricsTitle')}</h3>
          <p className="text-gray-500">{t('noLyricsSubtitle')}</p>
          {skipLyricsInputModalOnce && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <span className="text-blue-800 text-sm font-medium">{t('addLineByLineMode')}</span>
              <div className="text-blue-700 text-xs mt-1">{t('addLineByLineHint')}</div>
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={() => handleAddLyric(-1)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={14} />
              <span>{t('addLineBottom')}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Add Lyric Button - Top & AddLineByLine UX */}
      <div className="mb-4 text-center">
        {skipLyricsInputModalOnce && lyrics.length === 0 && (
          <div className="mb-2 bg-blue-50 border border-blue-200 rounded-lg p-2 inline-block">
            <span className="text-blue-800 text-xs font-medium">{t('addLineByLineMode')}</span>
            <div className="text-blue-700 text-xs">{t('addLineByLineHint')}</div>
          </div>
        )}
        <button
          onClick={() => handleAddLyric(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={14} />
          <span>{t('addLineBottom')}</span>
        </button>
      </div>

      {/* Lyrics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="lyrics-table">
          <thead>
            <tr>
              <th className="w-16">#</th>
              <th>{t('lyrics')}</th>
              <th className="w-32">{t('timing')}</th>
              <th className="w-48">{t('controls')}</th>
              <th className="w-32">{t('fineTune')}</th>
              <th className="w-24">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {lyrics.map((lyric, index) => (
              <tr
                key={lyric.id}
                className={`${
                  currentLyricIndex === index ? 'lyrics-active' : ''
                }`}
              >
                {/* Line Number */}
                <td className="text-center font-mono text-sm text-gray-500">
                  {index + 1}
                </td>

                {/* Lyrics Text */}
                <td className="max-w-xs">
                  {editingLyric === lyric.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit()
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-700"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-700"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span 
                      className="block truncate pr-2"
                      title={lyric.text}
                    >
                      {lyric.text}
                    </span>
                  )}
                </td>

                {/* Timing Display */}
                <td className="text-center">
                  <span className="time-display text-xs">
                    {formatTimeRange(lyric.startTime, lyric.endTime) || t('noTiming')}
                  </span>
                </td>

                {/* Time Controls */}
                <td>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleJumpToLine(index)
                      }}
                      className={`btn-secondary text-xs px-2 py-1 flex items-center space-x-1 ${lyric.startTime === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={lyric.startTime === null ? t('noStartTime') : t('jumpToLine')}
                      disabled={lyric.startTime === null}
                    >
                      <Target size={12} />
                      <span>{t('jump')}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetStartTime(lyric.id)
                      }}
                      className="btn-primary text-xs px-2 py-1"
                      title={t('setStartTime')}
                    >
                      {t('start')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetEndTime(lyric.id)
                      }}
                      className="btn-primary text-xs px-2 py-1"
                      title={t('setEndTime')}
                    >
                      {t('end')}
                    </button>
                  </div>
                </td>

                {/* Fine Tune Controls */}
                <td>
                  <div className="flex flex-col space-y-1">
                    {/* Start Time Fine Tune */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 w-8">Start:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdjustTime(lyric.id, 'startTime', -0.5)
                        }}
                        className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={lyric.startTime === null}
                        title={t('subtract05')}
                      >
                        <Minus size={10} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdjustTime(lyric.id, 'startTime', 0.5)
                        }}
                        className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={lyric.startTime === null}
                        title={t('add05')}
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    {/* End Time Fine Tune */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 w-8">End:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdjustTime(lyric.id, 'endTime', -0.5)
                        }}
                        className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={lyric.endTime === null}
                        title={t('subtract05')}
                      >
                        <Minus size={10} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAdjustTime(lyric.id, 'endTime', 0.5)
                        }}
                        className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={lyric.endTime === null}
                        title={t('add05')}
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditLyric(lyric)
                      }}
                      className="text-blue-600 hover:text-blue-700"
                      title={t('editText')}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddLyric(index)
                      }}
                      className="text-green-600 hover:text-green-700"
                      title={t('insertAfter')}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteLyric(lyric.id)
                      }}
                      className="text-red-600 hover:text-red-700"
                      title={t('deleteLine')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lyric Button - Bottom */}
      <div className="mt-4 text-center">
        <button
          onClick={() => handleAddLyric(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={14} />
          <span>{t('addLineBottom')}</span>
        </button>
      </div>

      {/* Current Time Display */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-blue-800 font-medium">{t('currentTime')} </span>
          <span className="time-display font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  )
}

export default LyricsTable
