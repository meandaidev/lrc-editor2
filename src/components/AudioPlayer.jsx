import React, { useEffect, useRef, useState, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  Settings,
  Music,
  Mic,
  Headphones
} from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { formatTime, createMixedAudio } from '../utils/lrcUtils'
import { useTranslation } from '../i18n/translations'

const AudioPlayer = () => {
  const audioRef = useRef(null)
  const [volume, setVolume] = useState(1)
  const [mixedAudioUrl, setMixedAudioUrl] = useState(null)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const { t } = useTranslation()
  
  const {
    audioFiles,
    currentTime,
    duration,
    isPlaying,
    activeAudioType,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setActiveAudioType,
    setAudioRef,
    setShowMetadataModal
  } = useLRCStore()

  // Create mixed audio when both instrumental and vocal are available
  useEffect(() => {
    if (audioFiles.instrumental && audioFiles.vocal) {
      createMixedAudio(audioFiles.instrumental, audioFiles.vocal)
        .then(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            setMixedAudioUrl(url)
          }
        })
        .catch(console.error)
    }

    return () => {
      if (mixedAudioUrl) {
        URL.revokeObjectURL(mixedAudioUrl)
      }
    }
  }, [audioFiles.instrumental, audioFiles.vocal])

  // Create and manage audio URL
  useEffect(() => {
    // Clean up previous URL
    if (currentAudioUrl && currentAudioUrl !== mixedAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl)
    }

    let newUrl = null
    
    // For single file mode, always use main file
    if (audioFiles.main && !audioFiles.instrumental && !audioFiles.vocal) {
      newUrl = URL.createObjectURL(audioFiles.main)
    }
    // For dual file mode, use active type
    else if (audioFiles.instrumental && audioFiles.vocal) {
      if (activeAudioType === 'instrumental') {
        newUrl = URL.createObjectURL(audioFiles.instrumental)
      } else if (activeAudioType === 'vocal') {
        newUrl = URL.createObjectURL(audioFiles.vocal)
      } else if (activeAudioType === 'mixed' && mixedAudioUrl) {
        newUrl = mixedAudioUrl
      }
    }
    // Fallback: if we have any single file, use it
    else if (audioFiles.main) {
      newUrl = URL.createObjectURL(audioFiles.main)
    } else if (audioFiles.instrumental) {
      newUrl = URL.createObjectURL(audioFiles.instrumental)
    } else if (audioFiles.vocal) {
      newUrl = URL.createObjectURL(audioFiles.vocal)
    }

    setCurrentAudioUrl(newUrl)

    return () => {
      if (newUrl && newUrl !== mixedAudioUrl) {
        URL.revokeObjectURL(newUrl)
      }
    }
  }, [audioFiles, activeAudioType, mixedAudioUrl])

  // Set up audio reference
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current)
    }
  }, [setAudioRef])

  // Update audio source when active type changes
  useEffect(() => {
    if (audioRef.current && currentAudioUrl) {
      const currentAudioRef = audioRef.current
      const wasPlaying = !currentAudioRef.paused
      const currentTimeValue = currentAudioRef.currentTime || 0
      
      currentAudioRef.pause() // This will trigger onPause event
      currentAudioRef.src = currentAudioUrl
      
      // Wait for audio to load before setting time and playing
      const handleCanPlay = () => {
        if (currentAudioRef) {
          currentAudioRef.currentTime = currentTimeValue
          if (wasPlaying) {
            currentAudioRef.play().catch(console.error)
          }
          currentAudioRef.removeEventListener('canplay', handleCanPlay)
        }
      }
      
      currentAudioRef.addEventListener('canplay', handleCanPlay)
      currentAudioRef.load()
    }
  }, [currentAudioUrl])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  const togglePlay = async () => {
    console.log('togglePlay called, current state:', { isPlaying, audioSource: !!audioSource })
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          console.log('Attempting to play audio...')
          await audioRef.current.play()
          console.log('Audio play successful')
          setIsPlaying(true)
        } catch (error) {
          console.error('Failed to play audio:', error)
          setIsPlaying(false)
        }
      }
    } else {
      console.error('audioRef.current is null')
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const resetToStart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  const canSwitchAudio = audioFiles.instrumental && audioFiles.vocal

  // Always render when we have audio files, don't depend on audioSource check
  if (!audioFiles.main && !audioFiles.instrumental && !audioFiles.vocal) {
    return null
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="max-w-4xl mx-auto">
        {/* Audio Type Selector */}
        {canSwitchAudio && (
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setActiveAudioType('mixed')}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-all ${
                  activeAudioType === 'mixed'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Headphones size={16} />
                <span className="text-sm">{t('mixed')}</span>
              </button>
              <button
                onClick={() => setActiveAudioType('instrumental')}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-all ${
                  activeAudioType === 'instrumental'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Music size={16} />
                <span className="text-sm">{t('instrumental')}</span>
              </button>
              <button
                onClick={() => setActiveAudioType('vocal')}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-all ${
                  activeAudioType === 'vocal'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Mic size={16} />
                <span className="text-sm">{t('vocal')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div
            className="progress-bar cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="progress-fill"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span className="time-display">{formatTime(currentTime)}</span>
            <span className="time-display">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resetToStart}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            title={t('resetToStart')}
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            title={t('playPause')}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex items-center space-x-2">
            <Volume2 size={20} className="text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          <button
            onClick={() => setShowMetadataModal(true)}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            title={t('songMetadataTooltip')}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Current Audio Info */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            {t('playingLabel')} {
              activeAudioType === 'mixed' ? t('mixedAudio') :
              activeAudioType === 'instrumental' ? t('instrumentalTrack') :
              activeAudioType === 'vocal' ? t('vocalTrack') :
              t('mainAudio')
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
