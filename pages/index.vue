<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Code Composer</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Code Input Section -->
      <div class="rounded-lg shadow-lg p-4">
        <h2 class="text-xl mb-2">Your Code</h2>
        <SimpleCodeEditor 
          @update:code="updateCode" 
          @char:typed="handleCharTyped"
          :highlightCharIndex="playbackMode === 'character' && isPlaying ? currentCharIndex : -1"
          :isLiveMode="playbackMode === 'live'"
        />
        
        <!-- Playback Mode Selector -->
        <div class="mt-4">
          <PlaybackMode 
            @update:mode="updatePlaybackMode"
            @update:lineBreakSound="updateLineBreakSound"
          />
        </div>
        
        <div class="mt-4 space-y-2">
          <button 
            @click="generateMusic" 
            :disabled="isGenerating || playbackMode === 'live'"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isGenerating" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isGenerating ? 'Generating...' : playbackMode === 'live' ? 'Live Mode Active' : 'Generate Music' }}
          </button>
          
          <button 
            @click="resetCode" 
            class="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
      
      <!-- Music Output Section -->
      <div class="rounded-lg shadow-lg p-4">
        <h2 class="text-xl mb-2">Your Music</h2>
        <AudioVisualizer 
          :audioData="audioData" 
          :isPlaying="isPlaying || playbackMode === 'live'" 
          :liveAudioData="liveAudioData"
          :isLiveMode="playbackMode === 'live'"
        />
        <MusicControls 
          :isPlaying="isPlaying" 
          @stop="stopMusic" 
        />
        
        <!-- Download options -->
        <DownloadMusic 
          :canDownload="hasGenerated"
          :isLiveMode="playbackMode === 'live'"
          :isRecording="isRecording"
          @download:mp3="handleDownloadMP3"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useCodeStore } from '@/stores/code'
import { useAudioEngine } from '@/composables/useAudioEngine'
import { useCharacterMusic } from '@/composables/useCharacterMusic'
import { useLiveTypeAudio } from '@/composables/useLiveTypeAudio'
import PlaybackMode from '@/components/PlaybackMode.vue'
import DownloadMusic from '@/components/DownloadMusic.vue'

const codeStore = useCodeStore()
const { 
  generateAudio, 
  playAudio, 
  pauseAudio, 
  stopAudio, 
  downloadMP3,
  resetAudio,
  isPlaying, 
  audioData,
  currentCharIndex,
  hasGenerated
} = useAudioEngine()

const playbackMode = ref('character')
const lineBreakSound = ref('gong')
const isGenerating = ref(false)
const liveAudioData = ref([])
const isRecording = ref(false)

const { createCharacterSequence } = useCharacterMusic()
const { 
  initLiveType, 
  playCharacter, 
  stopLiveType, 
  getAudioData: getLiveAudioData,
  startRecording: startLiveRecording,
  stopRecording: stopLiveRecording,
  isActive: isLiveTypeActive 
} = useLiveTypeAudio()

const updateCode = (newCode) => {
  codeStore.setCode(newCode)
}

const updatePlaybackMode = async (mode) => {
  // Stop any currently playing audio
  if (isPlaying.value) {
    stopAudio()
  }
  
  // Stop recording if in live mode
  if (isRecording.value) {
    stopLiveRecording()
    isRecording.value = false
  }
  
  playbackMode.value = mode
  
  // Handle live mode
  if (mode === 'live') {
    await initLiveType()
    // Start polling for audio data
    startLiveAudioPolling()
  } else if (isLiveTypeActive.value) {
    stopLiveType()
    stopLiveAudioPolling()
  }
}

let audioPollingInterval = null

const startLiveAudioPolling = () => {
  audioPollingInterval = setInterval(() => {
    if (isLiveTypeActive.value) {
      liveAudioData.value = getLiveAudioData()
    }
  }, 50) // Update every 50ms
}

const stopLiveAudioPolling = () => {
  if (audioPollingInterval) {
    clearInterval(audioPollingInterval)
    audioPollingInterval = null
  }
  liveAudioData.value = []
}

const updateLineBreakSound = (sound) => {
  console.log('Updating line break sound to:', sound)
  lineBreakSound.value = sound
}

const generateMusic = async () => {
  console.log('Generate music clicked')
  
  // Skip check in live mode since it's not used
  if (playbackMode.value === 'live') {
    return
  }
  
  // Check if there's any code to generate music from
  if (!codeStore.code || codeStore.code.trim() === '') {
    console.log('No code to generate music from')
    return
  }
  
  // Stop any currently playing music first
  if (isPlaying.value) {
    console.log('Stopping existing playback')
    stopAudio()
  }
  
  isGenerating.value = true
  
  try {
    console.log('Current code:', codeStore.code)
    console.log('Playback mode:', playbackMode.value)
    
    // Character-by-character mode
    const characterSequence = createCharacterSequence(codeStore.code, lineBreakSound.value)
    const musicMapping = {
      sequence: characterSequence
    }
    
    const result = await generateAudio(musicMapping)
    console.log('Generate audio result:', result)
    
    if (result) {
      // Auto-play after successful generation
      await playAudio()
    }
  } catch (error) {
    console.error('Error generating music:', error)
  } finally {
    isGenerating.value = false
  }
}

const stopMusic = () => {
  console.log('Stop button clicked')
  stopAudio()
}

const handleDownloadMP3 = async () => {
  console.log('Download MP3 clicked')
  
  if (playbackMode.value === 'live') {
    // Handle live mode recording
    if (!isRecording.value) {
      // Start recording
      isRecording.value = true
      const success = await startLiveRecording()
      if (!success) {
        isRecording.value = false
        console.error('Failed to start recording')
      }
    } else {
      // Stop recording and download
      const recording = await stopLiveRecording()
      isRecording.value = false
      
      if (recording) {
        // Create a download link
        const url = URL.createObjectURL(recording)
        const a = document.createElement('a')
        a.download = `live-music-${Date.now()}.mp3`
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }
  } else {
    await downloadMP3()
  }
}

const resetCode = async () => {
  console.log('Reset button clicked')
  const wasInLiveMode = playbackMode.value === 'live'
  
  try {
    // Stop everything first
    if (isPlaying.value) {
      stopAudio()
    }
    
    // Stop live type if active
    if (isLiveTypeActive.value) {
      stopLiveType()
      stopLiveAudioPolling()
    }
    
    // Stop recording if active
    if (isRecording.value) {
      await stopLiveRecording()
      isRecording.value = false
    }
    
    // Clear the code
    codeStore.setCode('')
    
    // Reset states
    isGenerating.value = false
    liveAudioData.value = []
    
    // Reset the audio engine for non-live modes
    if (!wasInLiveMode) {
      resetAudio()
    }
    
    // Reinitialize live mode if it was active
    if (wasInLiveMode) {
      console.log('Reinitializing live mode after reset')
      await initLiveType()
      startLiveAudioPolling()
    }
  } catch (error) {
    console.error('Error during reset:', error)
  }
}

const handleCharTyped = async (char) => {
  if (playbackMode.value === 'live' && isLiveTypeActive.value) {
    await playCharacter(char, lineBreakSound.value)
  }
}

// Initialize live mode if it's the default
onMounted(async () => {
  if (playbackMode.value === 'live') {
    await initLiveType()
    startLiveAudioPolling()
  }
})

// Clean up on unmount
onBeforeUnmount(() => {
  stopLiveAudioPolling()
  if (isLiveTypeActive.value) {
    stopLiveType()
  }
})

</script>