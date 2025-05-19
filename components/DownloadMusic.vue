<template>
  <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2 text-bright-purple">Download Music</h3>
    <div class="flex gap-3">
      <button 
        @click="downloadMP3"
        :disabled="(!canDownload && !isLiveMode) || localIsRecording"
        class="px-4 py-2 bg-dark-purple text-light-pink hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-opacity"
      >
        <svg v-if="localIsRecording || props.isRecording" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="props.isRecording" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        {{ getButtonText() }}
      </button>
    </div>
    
    <div v-if="!canDownload && !isLiveMode" class="mt-2 text-sm text-dark-purple italic">
      Generate music first to enable download
    </div>
    <div v-if="isLiveMode" class="mt-2 text-sm text-dark-purple italic">
      {{ props.isRecording ? 'Recording... Click again to download' : 'Click to start recording' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  canDownload: {
    type: Boolean,
    default: false
  },
  isLiveMode: {
    type: Boolean,
    default: false
  },
  isRecording: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['download:mp3'])

const localIsRecording = ref(false)

const downloadMP3 = async () => {
  if (!props.isLiveMode) {
    localIsRecording.value = true
  }
  await emit('download:mp3')
  if (!props.isLiveMode) {
    localIsRecording.value = false
  }
}

const getButtonText = () => {
  if (props.isLiveMode) {
    return props.isRecording ? 'Stop & Download' : 'Start Recording'
  }
  return localIsRecording.value ? 'Converting...' : 'Download MP3'
}
</script>