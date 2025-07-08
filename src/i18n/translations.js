import { useLanguage } from './LanguageContext'

export const translations = {
  en: {
    // App Title
    appTitle: "LRC Editor",
    appSubtitle: "Professional Lyrics Timing Tool",
    
    // File Upload
    uploadTitle: "Drop audio files here or click to browse",
    uploadSubtitle: "Select 1-2 audio files and optionally an LRC file",
    supportedFormats: "Supported File Formats:",
    singleFile: "Single file:",
    twoFiles: "Two files:",
    lrcImport: "LRC import:",
    audioFormats: "Audio formats:",
    howToUse: "How to use:",
    instructions: [
      "Upload your audio file(s) using the formats described above",
      "If no LRC file is detected, you'll be prompted to enter lyrics",
      "Use the timing controls to set start and end times for each lyric line",
      "Export your finished LRC file when complete"
    ],
    
    // Audio Player
    mixed: "Mixed",
    instrumental: "Instrumental", 
    vocal: "Vocal",
    playingLabel: "Playing:",
    mixedAudio: "Mixed Audio",
    instrumentalTrack: "Instrumental Track",
    vocalTrack: "Vocal Track",
    mainAudio: "Main Audio",
    
    // Audio Player Controls
    playPause: "Play/Pause",
    resetToStart: "Reset to Start",
    songMetadataTooltip: "Song Metadata",
    add05: "Add 0.5s",
    subtract05: "Subtract 0.5s",
    setStartTime: "Set Start Time",
    setEndTime: "Set End Time",
    
    // Lyrics Input
    enterLyrics: "Enter Lyrics",
    lyricsPlaceholder: "Paste your lyrics here...",
    lyricsInstructions: "Paste your lyrics below. Each line will become a separate timing entry.",
    lyricsNote: "Empty lines and extra spaces will be automatically cleaned up.",
    lyricsTip: "Organize your lyrics with sections (Verse, Chorus, Bridge) for easier timing. You can add more lines later if needed.",
    continueToTiming: "Continue to Timing",
    processing: "Processing...",
    
    // Lyrics Table
    noLyricsTitle: "No lyrics loaded",
    noLyricsSubtitle: "Upload audio files to get started",
    addLineTop: "Add Line at Top",
    addLineBottom: "Add Line at Bottom",
    lyrics: "Lyrics",
    timing: "Timing",
    controls: "Controls",
    fineTune: "Fine Tune",
    actions: "Actions",
    noTiming: "No timing",
    prev: "Prev",
    start: "Start",
    end: "End",
    jump: "Jump",
    jumpToLine: "Jump to this line",
    noStartTime: "No start time set",
    currentTime: "Current Time:",
    
    // Add Lyric Modal
    addNewLine: "Add New Lyric Line",
    enterLyricText: "Enter the lyric text for the new line:",
    enterLyricPlaceholder: "Enter lyric text...",
    addLine: "Add Line",
    
    // Metadata Modal
    songMetadata: "Song Metadata",
    title: "Title",
    artist: "Artist",
    album: "Album",
    author: "Author",
    length: "Length (MM:SS)",
    lrcCreator: "LRC Creator",
    offset: "Offset (milliseconds)",
    offsetNote: "Positive values delay lyrics, negative values advance them",
    saveMetadata: "Save Metadata",
    
    // Export Controls
    exportLrc: "Export LRC",
    exportZip: "Export ZIP",
    importLrc: "Import LRC",
    exporting: "Exporting...",
    lrcDescription: "LRC: Lyrics with timing",
    zipDescription: "ZIP: Complete package with audio",
    addLyricsNote: "Add lyrics and timing to enable export",
    audioRequiredNote: "Audio files required for ZIP export",
    
    // Common
    cancel: "Cancel",
    close: "Close",
    closeWindow: "Close Window",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    ok: "OK",
    yes: "Yes",
    no: "No",
    
    // Success Messages
    audioLoaded: "Audio files loaded successfully!",
    importSuccess: "LRC file imported successfully!",
    addLyricsPrompt: "Import an LRC file or add lyrics to continue",
    addLyrics: "Add Lyrics",
    
    // Error Messages
    selectAudioFile: "Please select at least one audio file (MP3, WAV, M4A)",
    twoFilePattern: "For two files, please use naming pattern: prefix_ins.mp3 and prefix_vol.mp3",
    maxTwoFiles: "Please select 1 or 2 audio files only",
    lrcFormatError: "Error reading LRC file. Please check the file format.",
    noLyricsToExport: "No lyrics to export. Please add some lyrics first.",
    exportError: "Error creating project export. Please try again.",
    importError: "Error reading LRC file. Please check the file format.",
    replaceConfirm: "This will replace your current lyrics and metadata. Continue?",
    
    // Loader Messages
    loadingAudioFiles: "Loading Audio Files",
    analyzingFiles: "Analyzing files...",
    processingAudio: "Processing audio files...",
    processingLrc: "Processing LRC files...",
    finalizing: "Finalizing...",
    
    // Tooltips
    resetToStart: "Reset to start",
    playPause: "Play/Pause",
    songMetadataTooltip: "Song metadata",
    setStartTime: "Set start time",
    setEndTime: "Set end time",
    playFromPrevious: "Play from previous line",
    jumpToLine: "Jump to this line",
    noStartTime: "No start time set",
    jump: "Jump",
    resetConfirmMessage: "You have unsaved lyrics and timing data. Going back to the home page will lose all your work. Are you sure you want to continue?",
    backToHomeTooltip: "Back to home page",
    editText: "Edit text",
    insertAfter: "Insert line before",
    deleteLine: "Delete line",
    subtract05: "Subtract 0.5s",
    add05: "Add 0.5s",
    exportLrcTooltip: "Export LRC file",
    exportZipTooltip: "Export complete package as ZIP",
    importLrcTooltip: "Import existing LRC file",
    
    // Footer
    footerDescription: "Professional lyrics timing tool for creating LRC files with precision",
    madeWith: "Made with",
    by: "by",
    developer: "meandaidev",
  },
  
  th: {
    // App Title
    appTitle: "LRC Editor",
    appSubtitle: "เครื่องมือจับเวลาเนื้อเพลงแบบมืออาชีพ",
    
    // File Upload
    uploadTitle: "วางไฟล์เสียงที่นี่หรือคลิกเพื่อเลือกไฟล์",
    uploadSubtitle: "เลือก 1-2 ไฟล์เสียงและไฟล์ LRC (ถ้ามี)",
    supportedFormats: "รูปแบบไฟล์ที่รองรับ:",
    singleFile: "ไฟล์เดียว:",
    twoFiles: "สองไฟล์:",
    lrcImport: "นำเข้า LRC:",
    audioFormats: "รูปแบบไฟล์เสียง:",
    howToUse: "วิธีการใช้งาน:",
    instructions: [
      "อัปโหลดไฟล์เสียงตามรูปแบบที่อธิบายข้างต้น",
      "หากไม่พบไฟล์ LRC ระบบจะให้คุณใส่เนื้อเพลง",
      "ใช้ตัวควบคุมเวลาเพื่อกำหนดเวลาเริ่มและสิ้นสุดของแต่ละบรรทัด",
      "ส่งออกไฟล์ LRC ที่เสร็จสมบูรณ์"
    ],
    
    // Audio Player
    mixed: "ผสม",
    instrumental: "เครื่องดนตรี",
    vocal: "เสียงร้อง",
    playingLabel: "กำลังเล่น:",
    mixedAudio: "เสียงผสม",
    instrumentalTrack: "แทร็กเครื่องดนตรี",
    vocalTrack: "แทร็กเสียงร้อง",
    mainAudio: "เสียงหลัก",
    
    // Audio Player Controls  
    playPause: "เล่น/หยุด",
    resetToStart: "กลับไปจุดเริ่มต้น",
    songMetadataTooltip: "ข้อมูลเพลง",
    add05: "เพิ่ม 0.5 วินาที",
    subtract05: "ลด 0.5 วินาที", 
    setStartTime: "กำหนดเวลาเริ่ม",
    setEndTime: "กำหนดเวลาจบ",
    
    // Lyrics Input
    enterLyrics: "ใส่เนื้อเพลง",
    lyricsPlaceholder: "วางเนื้อเพลงที่นี่...",
    lyricsInstructions: "วางเนื้อเพลงด้านล่าง แต่ละบรรทัดจะกลายเป็นรายการจับเวลาแยกกัน",
    lyricsNote: "บรรทัดว่างและช่องว่างเพิ่มเติมจะถูกล้างโดยอัตโนมัติ",
    lyricsTip: "จัดระเบียบเนื้อเพลงของคุณด้วยส่วนต่างๆ (ท่อน, คอรัส, สะพาน) เพื่อให้จับเวลาได้ง่ายขึ้น คุณสามารถเพิ่มบรรทัดเพิ่มเติมได้ภายหลัง",
    continueToTiming: "ไปที่การจับเวลา",
    processing: "กำลังประมวลผล...",
    
    // Lyrics Table
    noLyricsTitle: "ไม่มีเนื้อเพลง",
    noLyricsSubtitle: "อัปโหลดไฟล์เสียงเพื่อเริ่มต้น",
    addLineTop: "เพิ่มบรรทัดด้านบน",
    addLineBottom: "เพิ่มบรรทัดด้านล่าง",
    lyrics: "เนื้อเพลง",
    timing: "เวลา",
    controls: "ควบคุม",
    fineTune: "ปรับละเอียด",
    actions: "การกระทำ",
    noTiming: "ไม่มีเวลา",
    prev: "ก่อนหน้า",
    start: "เริ่ม",
    end: "จบ",
    jump: "กระโดด",
    jumpToLine: "กระโดดไปยังบรรทัดนี้",
    noStartTime: "ยังไม่ได้ตั้งเวลาเริ่ม",
    currentTime: "เวลาปัจจุบัน:",
    
    // Add Lyric Modal
    addNewLine: "เพิ่มบรรทัดเนื้อเพลงใหม่",
    enterLyricText: "ใส่ข้อความเนื้อเพลงสำหรับบรรทัดใหม่:",
    enterLyricPlaceholder: "ใส่ข้อความเนื้อเพลง...",
    addLine: "เพิ่มบรรทัด",
    
    // Metadata Modal
    songMetadata: "ข้อมูลเพลง",
    title: "ชื่อเพลง",
    artist: "ศิลปิน",
    album: "อัลบั้ม",
    author: "ผู้แต่ง",
    length: "ความยาว (นาที:วินาที)",
    lrcCreator: "ผู้สร้าง LRC",
    offset: "ค่าชดเชย (มิลลิวินาที)",
    offsetNote: "ค่าบวกจะทำให้เนื้อเพลงช้าลง ค่าลบจะทำให้เร็วขึ้น",
    saveMetadata: "บันทึกข้อมูล",
    
    // Export Controls
    exportLrc: "ส่งออก LRC",
    exportZip: "ส่งออก ZIP",
    importLrc: "นำเข้า LRC",
    exporting: "กำลังส่งออก...",
    lrcDescription: "LRC: เนื้อเพลงพร้อมเวลา",
    zipDescription: "ZIP: แพ็คเกจสมบูรณ์พร้อมเสียง",
    addLyricsNote: "เพิ่มเนื้อเพลงและเวลาเพื่อเปิดใช้การส่งออก",
    audioRequiredNote: "ต้องการไฟล์เสียงสำหรับการส่งออก ZIP",
    
    // Common
    cancel: "ยกเลิก",
    close: "ปิด",
    closeWindow: "ปิดหน้าต่าง",
    save: "บันทึก",
    edit: "แก้ไข",
    delete: "ลบ",
    close: "ปิด",
    ok: "ตกลง",
    yes: "ใช่",
    no: "ไม่",
    
    // Success Messages
    audioLoaded: "โหลดไฟล์เสียงสำเร็จแล้ว!",
    importSuccess: "นำเข้าไฟล์ LRC สำเร็จแล้ว!",
    addLyricsPrompt: "นำเข้าไฟล์ LRC หรือเพิ่มเนื้อเพลงเพื่อดำเนินการต่อ",
    addLyrics: "เพิ่มเนื้อเพลง",
    
    // Error Messages
    selectAudioFile: "กรุณาเลือกไฟล์เสียงอย่างน้อย 1 ไฟล์ (MP3, WAV, M4A)",
    twoFilePattern: "สำหรับสองไฟล์ กรุณาใช้รูปแบบชื่อ: prefix_ins.mp3 และ prefix_vol.mp3",
    maxTwoFiles: "กรุณาเลือกไฟล์เสียง 1 หรือ 2 ไฟล์เท่านั้น",
    lrcFormatError: "เกิดข้อผิดพลาดในการอ่านไฟล์ LRC กรุณาตรวจสอบรูปแบบไฟล์",
    noLyricsToExport: "ไม่มีเนื้อเพลงให้ส่งออก กรุณาเพิ่มเนื้อเพลงก่อน",
    exportError: "เกิดข้อผิดพลาดในการส่งออกโปรเจ็กต์ กรุณาลองใหม่อีกครั้ง",
    importError: "เกิดข้อผิดพลาดในการอ่านไฟล์ LRC กรุณาตรวจสอบรูปแบบไฟล์",
    replaceConfirm: "การดำเนินการนี้จะแทนที่เนื้อเพลงและข้อมูลปัจจุบันของคุณ ดำเนินการต่อหรือไม่?",
    
    // Loader Messages
    loadingAudioFiles: "กำลังโหลดไฟล์เสียง",
    analyzingFiles: "กำลังวิเคราะห์ไฟล์...",
    processingAudio: "กำลังประมวลผลไฟล์เสียง...",
    processingLrc: "กำลังประมวลผลไฟล์ LRC...",
    finalizing: "กำลังเสร็จสิ้น...",
    
    // Tooltips
    resetToStart: "รีเซ็ตไปจุดเริ่มต้น",
    playPause: "เล่น/หยุด",
    songMetadataTooltip: "ข้อมูลเพลง",
    setStartTime: "กำหนดเวลาเริ่ม",
    setEndTime: "กำหนดเวลาสิ้นสุด",
    playFromPrevious: "เล่นจากบรรทัดก่อนหน้า",
    jumpToLine: "กระโดดไปยังบรรทัดนี้",
    noStartTime: "ยังไม่ได้ตั้งเวลาเริ่ม",
    jump: "กระโดด",
    resetConfirmMessage: "คุณมีข้อมูลเนื้อเพลงและการจับเวลาที่ยังไม่ได้บันทึก การกลับไปหน้าแรกจะทำให้ข้อมูลทั้งหมดหายไป คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ?",
    backToHomeTooltip: "กลับไปหน้าแรก",
    editText: "แก้ไขข้อความ",
    insertAfter: "แทรกบรรทัดก่อนหน้า",
    deleteLine: "ลบบรรทัด",
    subtract05: "ลด 0.5 วินาที",
    add05: "เพิ่ม 0.5 วินาที",
    exportLrcTooltip: "ส่งออกไฟล์ LRC",
    exportZipTooltip: "ส่งออกแพ็คเกจทั้งหมดเป็น ZIP",
    importLrcTooltip: "นำเข้าไฟล์ LRC ที่มีอยู่",
    
    // Footer
    footerDescription: "เครื่องมือจับเวลาเนื้อเพลงระดับมืออาชีพสำหรับสร้างไฟล์ LRC อย่างแม่นยำ",
    madeWith: "สร้างด้วย",
    by: "โดย",
    developer: "มีนไดเดฟ",
  }
}

export const useTranslation = () => {
  return useLanguage()
}
