import React, { useState, useCallback } from 'react'
import { Upload, Music, FileAudio, Info, Loader } from 'lucide-react'
import useLRCStore from '../stores/lrcStore'
import { getFilePrefix, filesMatchPrefix, parseLRCContent } from '../utils/lrcUtils'
import { useTranslation } from '../i18n/translations'

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')
  const { t } = useTranslation()
  
  const { setAudioFiles, setPrefix, setLyrics, setMetadata, setShowLyricsInput } = useLRCStore()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const processFiles = useCallback(async (files) => {
    setUploadError('')
    setIsLoading(true)
    setLoadingProgress(0)
    setLoadingMessage(t('analyzingFiles'))
    
    try {
      // Simulate file reading progress
      await new Promise(resolve => setTimeout(resolve, 300))
      setLoadingProgress(20)
      
      const fileList = Array.from(files)
      
      // Filter audio files
      const audioFiles = fileList.filter(file => 
        file.type.startsWith('audio/') || 
        file.name.toLowerCase().endsWith('.mp3') ||
        file.name.toLowerCase().endsWith('.wav') ||
        file.name.toLowerCase().endsWith('.m4a')
      )
      
      // Filter LRC files
      const lrcFiles = fileList.filter(file => 
        file.name.toLowerCase().endsWith('.lrc')
      )

      if (audioFiles.length === 0) {
        setUploadError(t('selectAudioFile'))
        setIsLoading(false)
        return
      }

      setLoadingMessage(t('processingAudio'))
      setLoadingProgress(40)
      await new Promise(resolve => setTimeout(resolve, 400))

      let resultFiles = { main: null, instrumental: null, vocal: null }
      let detectedPrefix = ''

      if (audioFiles.length === 1) {
        // Single file mode
        resultFiles.main = audioFiles[0]
        detectedPrefix = getFilePrefix(audioFiles[0].name)
      } else if (audioFiles.length === 2) {
        // Two file mode - check if they match prefix pattern
        const prefixResult = filesMatchPrefix(audioFiles)
        if (prefixResult.match) {
          detectedPrefix = prefixResult.prefix
          // Assign files based on naming convention
          audioFiles.forEach(file => {
            const name = file.name.toLowerCase()
            if (name.includes('ins') || name.includes('instrumental')) {
              resultFiles.instrumental = file
            } else if (name.includes('vol') || name.includes('vocal')) {
              resultFiles.vocal = file
            }
          })
        } else {
          setUploadError(t('twoFilePattern'))
          setIsLoading(false)
          return
        }
      } else {
        setUploadError(t('maxTwoFiles'))
        setIsLoading(false)
        return
      }

      setLoadingMessage(t('processingLrc'))
      setLoadingProgress(70)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Process LRC file if present
      if (lrcFiles.length > 0) {
        try {
          const lrcContent = await lrcFiles[0].text()
          const { lyrics, metadata } = parseLRCContent(lrcContent)
          
          setMetadata({
            title: metadata.title || '',
            artist: metadata.artist || '',
            album: metadata.album || '',
            author: metadata.author || '',
            length: metadata.length || '',
            by: metadata.by || 'LRC Editor v1.0',
            offset: parseInt(metadata.offset) || 0,
            re: metadata.re || 'LRC Editor',
            ve: metadata.ve || '1.0'
          })
          
          setLyrics(lyrics)
        } catch (error) {
          console.error('Error parsing LRC file:', error)
          setUploadError(t('lrcFormatError'))
          setIsLoading(false)
          return
        }
      }

      setLoadingMessage(t('finalizing'))
      setLoadingProgress(90)
      await new Promise(resolve => setTimeout(resolve, 200))

      setAudioFiles(resultFiles)
      setPrefix(detectedPrefix)
      
      setLoadingProgress(100)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // If no LRC was loaded, show lyrics input modal
      if (lrcFiles.length === 0) {
        setShowLyricsInput(true)
      }
      
    } catch (error) {
      console.error('Error processing files:', error)
      setUploadError(t('importError'))
    } finally {
      setIsLoading(false)
      setLoadingProgress(0)
      setLoadingMessage('')
    }
  }, [setAudioFiles, setPrefix, setLyrics, setMetadata, setShowLyricsInput, t])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  // Loading Modal
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            {/* Animated loader icon */}
            <div className="relative mb-6">
              <Loader className="animate-spin mx-auto text-blue-500" size={48} />
              <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-pulse"></div>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('loadingAudioFiles')}
            </h3>
            
            {/* Status message */}
            <p className="text-gray-600 mb-6">{loadingMessage}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            {/* Percentage */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="text-blue-600 font-semibold">{loadingProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('appTitle')}</h1>
        <p className="text-gray-600">{t('appSubtitle')}</p>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">{t('supportedFormats')}</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li><strong>{t('singleFile')}</strong> <code>songname.mp3</code></li>
              <li><strong>{t('twoFiles')}</strong> <code>songname_ins.mp3</code> (instrumental) + <code>songname_vol.mp3</code> (vocal)</li>
              <li><strong>{t('lrcImport')}</strong> <code>songname.lrc</code> (optional - will be detected automatically)</li>
              <li><strong>{t('audioFormats')}</strong> MP3, WAV, M4A</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`file-upload-area ${dragActive ? 'drag-over' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="audio/*,.lrc"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="text-center">
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t('uploadTitle')}
          </h3>
          <p className="text-gray-500 mb-4">
            {t('uploadSubtitle')}
          </p>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Music size={16} />
              <span>Single Audio</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileAudio size={16} />
              <span>Vocal + Instrumental</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">{t('howToUse')}</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {t('instructions').map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default FileUpload
