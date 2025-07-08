import { useState } from 'react'
import { Download, Archive, FileText, Package } from 'lucide-react'
import JSZip from 'jszip'
import useLRCStore from '../stores/lrcStore'
import { generateLRCContent, downloadFile } from '../utils/lrcUtils'
import { useTranslation } from '../i18n/translations'

const ExportControls = () => {
  const [isExporting, setIsExporting] = useState(false)
  const { t } = useTranslation()
  
  const {
    lyrics,
    metadata,
    audioFiles,
    prefix,
    // setLyrics,
    // setMetadata
  } = useLRCStore()

  const handleExportLRC = () => {
    if (lyrics.length === 0) {
      alert(t('noLyricsToExport'))
      return
    }

    const lrcContent = generateLRCContent(lyrics, metadata)
    const filename = prefix ? `${prefix}.lrc` : 'lyrics.lrc'
    downloadFile(lrcContent, filename, 'text/plain')
  }

  const handleExportZip = async () => {
    if (lyrics.length === 0) {
      alert(t('noLyricsToExport'))
      return
    }

    setIsExporting(true)
    
    try {
      const zip = new JSZip()
      
      // Add LRC file
      const lrcContent = generateLRCContent(lyrics, metadata)
      const lrcFilename = prefix ? `${prefix}.lrc` : 'lyrics.lrc'
      zip.file(lrcFilename, lrcContent)
      
      // Add audio files
      if (audioFiles.main) {
        const audioFilename = prefix ? `${prefix}.mp3` : 'audio.mp3'
        zip.file(audioFilename, audioFiles.main)
      }
      
      if (audioFiles.instrumental) {
        const insFilename = prefix ? `${prefix}_ins.mp3` : 'instrumental.mp3'
        zip.file(insFilename, audioFiles.instrumental)
      }
      
      if (audioFiles.vocal) {
        const volFilename = prefix ? `${prefix}_vol.mp3` : 'vocal.mp3'
        zip.file(volFilename, audioFiles.vocal)
      }
      
      // Add project info (JSON format with additional data not in LRC)
      const projectInfo = {
        project: {
          name: metadata.title || 'Untitled',
          description: 'LRC Editor Project File',
          created: new Date().toISOString(),
          version: '1.0',
          editor: 'LRC Editor v1.0'
        },
        metadata: {
          title: metadata.title || '',
          artist: metadata.artist || '',
          album: metadata.album || '',
          author: metadata.author || '',
          length: metadata.length || '',
          offset: metadata.offset || 0
        },
        lyrics: lyrics.map((l, index) => ({
          id: l.id,
          index: index + 1,
          text: l.text,
          startTime: l.startTime,
          endTime: l.endTime,
          duration: l.endTime && l.startTime ? l.endTime - l.startTime : null
        })),
        statistics: {
          totalLines: lyrics.length,
          timedLines: lyrics.filter(l => l.startTime !== null).length,
          completedLines: lyrics.filter(l => l.startTime !== null && l.endTime !== null).length,
          totalDuration: lyrics.length > 0 && lyrics[lyrics.length - 1].endTime ? lyrics[lyrics.length - 1].endTime : null
        },
        files: {
          hasMainAudio: !!audioFiles.main,
          hasInstrumental: !!audioFiles.instrumental,
          hasVocal: !!audioFiles.vocal,
          prefix: prefix || 'lyrics'
        }
      }
      zip.file('project.json', JSON.stringify(projectInfo, null, 2))
      
      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' })
      // Use song title as filename, fallback to prefix or default
      const songTitle = metadata.title || prefix || 'lyrics'
      const safeTitle = songTitle.replace(/[<>:"/\\|?*]/g, '_') // Remove invalid filename characters
      const zipFilename = `${safeTitle}.zip`
      downloadFile(blob, zipFilename, 'application/zip')
      
    } catch (error) {
      console.error('Error creating project export:', error)
      alert(t('exportError'))
    } finally {
      setIsExporting(false)
    }
  }



  const hasContent = lyrics.length > 0
  const hasAudio = audioFiles.main || audioFiles.instrumental || audioFiles.vocal

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Export LRC */}
          <button
            onClick={handleExportLRC}
            disabled={!hasContent}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              hasContent
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={t('exportLrcTooltip')}
          >
            <Download size={16} />
            <span>{t('exportLrc')}</span>
          </button>

          {/* Export ZIP */}
          <button
            onClick={handleExportZip}
            disabled={!hasContent || !hasAudio || isExporting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              hasContent && hasAudio && !isExporting
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={t('exportZipTooltip')}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('exporting')}</span>
              </>
            ) : (
              <>
                <Archive size={16} />
                <span>{t('exportZip')}</span>
              </>
            )}
          </button>


        </div>

        {/* Export Info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <FileText size={12} />
              <span>{t('lrcDescription')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package size={12} />
              <span>{t('zipDescription')}</span>
            </div>
          </div>
          
          {!hasContent && (
            <p className="text-orange-600 mt-2">
              {t('addLyricsNote')}
            </p>
          )}
          
          {hasContent && !hasAudio && (
            <p className="text-orange-600 mt-2">
              {t('audioRequiredNote')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportControls
