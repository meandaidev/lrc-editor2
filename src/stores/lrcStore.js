import { create } from 'zustand'

const useLRCStore = create((set, get) => ({
  // Modal skip state for alternate lyric entry flow
  skipLyricsInputModalOnce: false,
  // File management
  audioFiles: {
    main: null,
    instrumental: null,
    vocal: null
  },
  prefix: '',
  
  // Audio player state
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  activeAudioType: 'mixed', // 'mixed', 'instrumental', 'vocal'
  audioRef: null,
  
  // Lyrics data
  lyrics: [],
  currentLyricIndex: -1,
  
  // Metadata
  metadata: {
    title: '',
    artist: '',
    album: '',
    author: '',
    length: '',
    by: 'LRC Editor v1.0',
    offset: 0,
    re: 'LRC Editor',
    ve: '1.0'
  },
  
  // UI state
  showLyricsInput: false,
  showMetadataModal: false,
  showAddLyricModal: false,
  addLyricIndex: -1,
  
  // Actions
  setSkipLyricsInputModalOnce: (val) => set({ skipLyricsInputModalOnce: val }),
  setAudioFiles: (files) => set({ audioFiles: files }),
  setPrefix: (prefix) => set({ prefix }),
  
  setCurrentTime: (time) => {
    set({ currentTime: time })
    get().updateCurrentLyricIndex(time)
  },
  
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setActiveAudioType: (type) => set({ activeAudioType: type }),
  setAudioRef: (ref) => set({ audioRef: ref }),
  
  updateCurrentLyricIndex: (currentTime) => {
    const { lyrics } = get()
    let activeIndex = -1
    
    // Find the active lyric based on current time
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i]
      if (lyric.startTime !== null) {
        // If this lyric has started
        if (currentTime >= lyric.startTime) {
          // If it has an end time and we haven't passed it, or if it doesn't have an end time
          if (lyric.endTime === null || currentTime < lyric.endTime) {
            activeIndex = i
          }
          // If it has an end time and we've passed it, check if the next lyric hasn't started yet
          else if (lyric.endTime !== null && currentTime >= lyric.endTime) {
            // Check if next lyric exists and hasn't started yet
            const nextLyric = lyrics[i + 1]
            if (!nextLyric || nextLyric.startTime === null || currentTime < nextLyric.startTime) {
              // We're in the gap between lyrics, no active lyric
              activeIndex = -1
            }
          }
        }
      }
    }
    
    set({ currentLyricIndex: activeIndex })
  },
  
  setLyrics: (lyrics) => set({ lyrics }),
  
  addLyric: (text, index = -1) => {
    const { lyrics } = get()
    const newLyric = {
      id: Date.now(),
      text: text.trim(),
      startTime: null,
      endTime: null
    }
    
    if (index === -1) {
      set({ lyrics: [...lyrics, newLyric] })
    } else {
      const newLyrics = [...lyrics]
      newLyrics.splice(index, 0, newLyric)
      set({ lyrics: newLyrics })
    }
  },
  
  updateLyric: (id, updates) => {
    const { lyrics } = get()
    const newLyrics = lyrics.map(lyric =>
      lyric.id === id ? { ...lyric, ...updates } : lyric
    )
    set({ lyrics: newLyrics })
  },
  
  deleteLyric: (id) => {
    const { lyrics } = get()
    set({ lyrics: lyrics.filter(lyric => lyric.id !== id) })
  },
  
  setLyricTime: (id, timeType, time) => {
    const { lyrics } = get()
    const newLyrics = lyrics.map(lyric =>
      lyric.id === id ? { ...lyric, [timeType]: time } : lyric
    )
    set({ lyrics: newLyrics })
  },
  
  adjustLyricTime: (id, timeType, adjustment) => {
    const { lyrics } = get()
    const newLyrics = lyrics.map(lyric => {
      if (lyric.id === id && lyric[timeType] !== null) {
        const newTime = Math.max(0, lyric[timeType] + adjustment)
        return { ...lyric, [timeType]: newTime }
      }
      return lyric
    })
    set({ lyrics: newLyrics })
  },
  
  setMetadata: (metadata) => set({ metadata }),
  updateMetadata: (key, value) => {
    const { metadata } = get()
    set({ metadata: { ...metadata, [key]: value } })
  },
  
  // UI actions
  setShowLyricsInput: (show) => set({ showLyricsInput: show }),
  setShowMetadataModal: (show) => set({ showMetadataModal: show }),
  setShowAddLyricModal: (show) => set({ showAddLyricModal: show }),
  setAddLyricIndex: (index) => set({ addLyricIndex: index }),
  
  // Utility actions
  seekTo: (time) => {
    const { audioRef, isDemoMode, demoSeekCallback } = get()
    if (isDemoMode && demoSeekCallback) {
      demoSeekCallback(time)
    } else if (audioRef) {
      audioRef.currentTime = time
      set({ currentTime: time })
    }
  },
    playFromLyric: async (lyricId) => {
    const { lyrics, audioRef } = get()
    const lyric = lyrics.find(l => l.id === lyricId)
    
    if (lyric && lyric.startTime !== null && audioRef) {
      try {
        audioRef.currentTime = lyric.startTime
        await audioRef.play()
        set({ currentTime: lyric.startTime, isPlaying: true })
      } catch (error) {
        console.error('Failed to play from lyric:', error)
        set({ isPlaying: false })
      }
    }
  },

  jumpToLine: async (index) => {
    const { lyrics, audioRef } = get()
    const lyric = lyrics[index]
    
    if (lyric && lyric.startTime !== null && audioRef) {
      try {
        audioRef.currentTime = lyric.startTime
        await audioRef.play()
        set({ currentTime: lyric.startTime, isPlaying: true })
      } catch (error) {
        console.error('Failed to jump to line:', error)
        set({ isPlaying: false })
      }
    }
  },
  
  // Clear all data
  reset: () => set({
    audioFiles: { main: null, instrumental: null, vocal: null },
    prefix: '',
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    activeAudioType: 'mixed',
    lyrics: [],
    currentLyricIndex: -1,
    isDemoMode: false,
    demoSeekCallback: null,
    demoPlayCallback: null,
    metadata: {
      title: '',
      artist: '',
      album: '',
      author: '',
      length: '',
      by: 'LRC Editor v1.0',
      offset: 0,
      re: 'LRC Editor',
      ve: '1.0'
    },
    showLyricsInput: false,
    showMetadataModal: false,
    showAddLyricModal: false,
    addLyricIndex: -1
  })
}))

export default useLRCStore
