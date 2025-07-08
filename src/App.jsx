import React from 'react'
import useLRCStore from './stores/lrcStore'
import { useTranslation } from './i18n/translations'
import Header from './components/Header'
import Footer from './components/Footer'
import FileUpload from './components/FileUpload'
import LyricsInput from './components/LyricsInput'
import AudioPlayer from './components/AudioPlayer'
import LyricsTable from './components/LyricsTable'
import AddLyricModal from './components/AddLyricModal'
import MetadataModal from './components/MetadataModal'
import ExportControls from './components/ExportControls'

function App() {
  const { audioFiles, lyrics } = useLRCStore()
  const { t } = useTranslation()
  
  const hasAudioFiles = audioFiles.main || audioFiles.instrumental || audioFiles.vocal
  const hasLyrics = lyrics.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      {!hasAudioFiles ? (
        /* Step 1: File Upload */
        <FileUpload />
      ) : (
        /* Step 2: Timing Editor */
        <div className="flex flex-col min-h-screen">
          {/* Audio Player - Fixed at top */}
          <AudioPlayer />
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            {hasLyrics ? (
              /* Lyrics Table */
              <LyricsTable />
            ) : (
              /* No lyrics message */
              <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {t('audioLoaded')}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {t('addLyricsPrompt')}
                  </p>
                  <button
                    onClick={() => useLRCStore.getState().setShowLyricsInput(true)}
                    className="btn-primary"
                  >
                    {t('addLyrics')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Export Controls - Fixed at bottom when lyrics exist */}
          {hasLyrics && <ExportControls />}
        </div>
      )}

      {/* Modals */}
      <LyricsInput />
      <AddLyricModal />
      <MetadataModal />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
