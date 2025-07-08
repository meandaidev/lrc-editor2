import React, { useState } from 'react'
import { 
  Play, 
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
    setLyricTime,
    adjustLyricTime,
    deleteLyric,
    updateLyric,
    playFromLyric,
    jumpToLine,
    setShowAddLyricModal,
    setAddLyricIndex
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
    setAddLyricIndex(index)
    setShowAddLyricModal(true)
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
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Add Lyric Button - Top */}
      <div className="mb-4 text-center">
        <button
          onClick={() => handleAddLyric(-1)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
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
                } cursor-pointer`}
                onClick={() => playFromLyric(lyric.id)}
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
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>{t('addLineBottom')}</span>
        </button>
      </div>

      {/* Current Time Display */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-blue-800 font-medium">{t('currentTime')} </span>
          <span className="time-display font-mono">{formatTime(currentTime)}</span>
          
          {/* Current Lyric Display */}
          {currentLyricIndex >= 0 && lyrics[currentLyricIndex] && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <div className="text-xs text-blue-600 mb-1">{t('currentLyric')}:</div>
              <div className="text-sm text-blue-900 font-medium max-w-md mx-auto leading-relaxed">
                "{lyrics[currentLyricIndex].text}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LyricsTable
