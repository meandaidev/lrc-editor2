// Format time to MM:SS.SS format
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return '--:--'
  }
  
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const centiseconds = Math.floor((seconds % 1) * 100)
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
}

// Format time range for display
export const formatTimeRange = (startTime, endTime) => {
  if (startTime === null) return null // Return null so component can handle translation
  if (endTime === null) return formatTime(startTime) + '-'
  return `${formatTime(startTime)}-${formatTime(endTime)}`
}

// Parse time from MM:SS.SS format
export const parseTime = (timeString) => {
  if (!timeString || timeString === '--:--') return null
  
  const parts = timeString.split(':')
  if (parts.length !== 2) return null
  
  const minutes = parseInt(parts[0])
  const secondsParts = parts[1].split('.')
  const seconds = parseInt(secondsParts[0])
  const centiseconds = secondsParts[1] ? parseInt(secondsParts[1]) : 0
  
  return minutes * 60 + seconds + centiseconds / 100
}

// Clean up lyrics text
export const cleanLyricsText = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
}

// Parse lyrics text into array
export const parseLyricsText = (text) => {
  const cleanText = cleanLyricsText(text)
  return cleanText.split('\n').map((line, index) => ({
    id: Date.now() + index,
    text: line,
    startTime: null,
    endTime: null
  }))
}

// Get file prefix from filename
export const getFilePrefix = (filename) => {
  const name = filename.replace(/\.[^/.]+$/, '') // Remove extension
  
  // Check if it's a vocal/instrumental file
  if (name.endsWith('_vol')) {
    return name.slice(0, -4)
  }
  if (name.endsWith('_ins')) {
    return name.slice(0, -4)
  }
  
  return name
}

// Check if files match the same prefix
export const filesMatchPrefix = (files) => {
  const prefixes = files.map(file => getFilePrefix(file.name))
  const firstPrefix = prefixes[0]
  const allMatch = prefixes.every(prefix => prefix === firstPrefix)
  
  return {
    match: allMatch,
    prefix: allMatch ? firstPrefix : ''
  }
}

// Generate LRC content
export const generateLRCContent = (lyrics, metadata) => {
  let content = ''
  
  // Add metadata
  if (metadata.title) content += `[ti:${metadata.title}]\n`
  if (metadata.artist) content += `[ar:${metadata.artist}]\n`
  if (metadata.album) content += `[al:${metadata.album}]\n`
  if (metadata.author) content += `[au:${metadata.author}]\n`
  if (metadata.length) content += `[length:${metadata.length}]\n`
  if (metadata.by) content += `[by:${metadata.by}]\n`
  if (metadata.offset !== 0) content += `[offset:${metadata.offset}]\n`
  if (metadata.re) content += `[re:${metadata.re}]\n`
  if (metadata.ve) content += `[ve:${metadata.ve}]\n`
  
  content += '\n'
  
  // Add lyrics with timing
  lyrics.forEach(lyric => {
    if (lyric.startTime !== null) {
      const startString = formatLRCTime(lyric.startTime)
      if (lyric.endTime !== null && lyric.endTime !== undefined) {
        const endString = formatLRCTime(lyric.endTime)
        content += `[${startString}-${endString}]${lyric.text}\n`
      } else {
        content += `[${startString}]${lyric.text}\n`
      }
    }
  })
  
  return content
}

// Format time for LRC file (MM:SS.SS)
export const formatLRCTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2)
  return `${minutes.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`
}

// Parse LRC content
export const parseLRCContent = (content) => {
  const lines = content.split('\n')
  const metadata = {}
  const lyrics = []
  lines.forEach(line => {
    line = line.trim()
    if (!line) return
    // Check for metadata
    const metadataMatch = line.match(/^\[([a-z]+):(.+)\]$/)
    if (metadataMatch) {
      const [, key, value] = metadataMatch
      metadata[key] = value
      return
    }
    // Check for [start-end] timed lyrics
    const lyricRangeMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})-(\d{2}):(\d{2})\.(\d{2})\](.*)$/)
    if (lyricRangeMatch) {
      const [, sm, ss, sc, em, es, ec, text] = lyricRangeMatch
      const startTime = parseInt(sm) * 60 + parseInt(ss) + parseInt(sc) / 100
      const endTime = parseInt(em) * 60 + parseInt(es) + parseInt(ec) / 100
      lyrics.push({
        id: Date.now() + Math.random(),
        text: text.trim(),
        startTime,
        endTime
      })
      return
    }
    // Check for [start] timed lyrics (legacy)
    const lyricMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/)
    if (lyricMatch) {
      const [, minutes, seconds, centiseconds, text] = lyricMatch
      const time = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(centiseconds) / 100
      lyrics.push({
        id: Date.now() + Math.random(),
        text: text.trim(),
        startTime: time,
        endTime: null
      })
    }
  })
  
  // Calculate end times only if not already set from LRC
  for (let i = 0; i < lyrics.length - 1; i++) {
    if (lyrics[i].endTime == null) {
      lyrics[i].endTime = lyrics[i + 1].startTime
    }
  }
  
  return { metadata, lyrics }
}

// Download file
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Create audio context for mixing
export const createMixedAudio = async (instrumentalFile, vocalFile) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const [insBuffer, volBuffer] = await Promise.all([
      loadAudioBuffer(audioContext, instrumentalFile),
      loadAudioBuffer(audioContext, vocalFile)
    ])
    
    // Create a simple mix by combining the buffers
    const length = Math.max(insBuffer.length, volBuffer.length)
    const mixedBuffer = audioContext.createBuffer(2, length, audioContext.sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const mixedData = mixedBuffer.getChannelData(channel)
      const insData = insBuffer.getChannelData(Math.min(channel, insBuffer.numberOfChannels - 1))
      const volData = volBuffer.getChannelData(Math.min(channel, volBuffer.numberOfChannels - 1))
      
      for (let i = 0; i < length; i++) {
        const insValue = i < insBuffer.length ? insData[i] : 0
        const volValue = i < volBuffer.length ? volData[i] : 0
        mixedData[i] = (insValue + volValue) * 0.5 // Simple mix with volume reduction
      }
    }
    
    return bufferToWav(mixedBuffer)
  } catch (error) {
    console.error('Error creating mixed audio:', error)
    return null
  }
}

// Load audio buffer from file
const loadAudioBuffer = async (audioContext, file) => {
  const arrayBuffer = await file.arrayBuffer()
  return audioContext.decodeAudioData(arrayBuffer)
}

// Convert audio buffer to WAV blob
const bufferToWav = (buffer) => {
  const length = buffer.length
  const numberOfChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const bytesPerSample = 2
  const blockAlign = numberOfChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = length * blockAlign
  const bufferSize = 44 + dataSize
  
  const arrayBuffer = new ArrayBuffer(bufferSize)
  const view = new DataView(arrayBuffer)
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, bufferSize - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)
  
  // Convert audio data
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' })
}
