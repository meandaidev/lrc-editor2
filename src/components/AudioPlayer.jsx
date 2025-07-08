import { useEffect, useRef, useState } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  Info,
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
  }, [audioFiles.instrumental, audioFiles.vocal]) // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [audioFiles, activeAudioType, mixedAudioUrl]) // eslint-disable-line react-hooks/exhaustive-deps

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
      // เก็บตำแหน่งล่าสุดไว้ก่อนเปลี่ยน src
      const lastTime = currentAudioRef.currentTime || 0

      currentAudioRef.pause()
      currentAudioRef.src = currentAudioUrl

      // รอให้ audio โหลดเสร็จแล้ว set currentTime กลับไปที่เดิม แล้วเล่นต่อถ้า isPlaying
      const handleLoadedMetadata = () => {
        if (currentAudioRef) {
          // ป้องกัน currentTime เกิน duration ใหม่
          const safeTime = Math.min(lastTime, currentAudioRef.duration || lastTime)
          console.log('[AudioPlayer] loadedmetadata:', { lastTime, duration: currentAudioRef.duration, before: currentAudioRef.currentTime });
          currentAudioRef.currentTime = safeTime
          setTimeout(() => {
            console.log('[AudioPlayer] after set currentTime:', currentAudioRef.currentTime)
            if (isPlaying) {
              currentAudioRef.play().catch(console.error)
            }
          }, 0)
          currentAudioRef.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
      }

      currentAudioRef.addEventListener('loadedmetadata', handleLoadedMetadata)
      currentAudioRef.load()
    }
  }, [currentAudioUrl, isPlaying])

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
    console.log('togglePlay called, current state:', { isPlaying, hasCurrentAudioUrl: !!currentAudioUrl })
    if (audioRef.current && currentAudioUrl) {
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
      console.error('audioRef.current is null or no audio URL available')
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
    <div className="bg-white border-b border-gray-200 p-2">
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        preload="metadata"
      />      <div className="max-w-4xl mx-auto">
        {/* Row 1: Progress Bar + Time Display */}
        <div className="mb-1.5">
          <div className="flex items-center gap-3">
            {/* Time display */}
            <span className="text-xs text-gray-500 font-mono w-12 text-center flex-shrink-0 bg-gray-50 rounded px-1 py-0.5">
              {formatTime(currentTime)}
            </span>
            
            {/* Progress bar */}
            <div
              className="progress-bar cursor-pointer flex-1 mx-1"
              onClick={handleSeek}
            >
              <div
                className="progress-fill"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
            
            {/* Duration */}
            <span className="text-xs text-gray-500 font-mono w-12 text-center flex-shrink-0 bg-gray-50 rounded px-1 py-0.5">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Row 2: Audio Type Selector + Controls + Audio Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Audio Type Selector (if available) */}
            {canSwitchAudio && (
              <div className="bg-gray-100 rounded-md p-0.5 flex gap-0.5 flex-shrink-0">
                <button
                  onClick={() => setActiveAudioType('mixed')}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded-sm transition-all text-xs font-medium ${
                    activeAudioType === 'mixed'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                >
                  <Headphones size={11} />
                  <span>Mix</span>
                </button>
                <button
                  onClick={() => setActiveAudioType('vocal')}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded-sm transition-all text-xs font-medium ${
                    activeAudioType === 'vocal'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic size={11} />
                  <span>Vocal</span>
                </button>
                <button
                  onClick={() => setActiveAudioType('instrumental')}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded-sm transition-all text-xs font-medium ${
                    activeAudioType === 'instrumental'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                >
                  <Music size={11} />
                  <span>Inst</span>
                </button>
              </div>
            )}

            <button
              onClick={resetToStart}
              className="p-1.5 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
              title={t('resetToStart')}
            >
              <RotateCcw size={15} />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
              title={t('playPause')}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="flex items-center gap-1.5 bg-gray-50 rounded px-2 py-1">
              <Volume2 size={13} className="text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-14 h-1.5"
              />
            </div>

            <button
              onClick={() => setShowMetadataModal(true)}
              className="p-3 text-blue-600 hover:text-white hover:bg-blue-500 bg-blue-100 rounded-full transition-all shadow-md hover:shadow-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              title={t('songMetadataTooltip')}
            >
              <Info size={26} />
            </button>
          </div>

          {/* Current Audio Info - compact on the right */}
          <div className="text-right">
            <span className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
              {t('playingLabel')} <span className="font-medium text-gray-700">{
                activeAudioType === 'mixed' ? t('mixedAudio') :
                activeAudioType === 'instrumental' ? t('instrumentalTrack') :
                activeAudioType === 'vocal' ? t('vocalTrack') :
                t('mainAudio')
              }</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
