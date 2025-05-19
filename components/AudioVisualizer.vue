<template>
  <div class="w-full h-64 bg-gray-900 rounded-lg p-4">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as Tone from 'tone'

const props = defineProps({
  audioData: {
    type: Array,
    default: () => []
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  liveAudioData: {
    type: Array,
    default: () => []
  },
  isLiveMode: {
    type: Boolean,
    default: false
  }
})

const canvas = ref(null)
let animationId = null
let canvasCtx = null
let analyzer = null
let waveform = new Float32Array(256)

onMounted(() => {
  if (canvas.value) {
    canvasCtx = canvas.value.getContext('2d')
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
    
    // Create Tone.js analyzer
    analyzer = new Tone.Analyser({
      type: 'waveform',
      size: 256
    })
    
    // Connect to the global audio output
    Tone.getDestination().connect(analyzer)
    
    draw()
  }
})

const draw = () => {
  if (!canvas.value || !canvasCtx) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  
  // Clear canvas with dark background
  canvasCtx.fillStyle = 'rgb(17, 24, 39)' // Dark gray background
  canvasCtx.fillRect(0, 0, width, height)
  
  let shouldDrawWaveform = false
  
  if (props.isLiveMode && props.liveAudioData && props.liveAudioData.length > 0) {
    // Use live mode data - ensure it's a Float32Array
    waveform = new Float32Array(props.liveAudioData)
    shouldDrawWaveform = true
  } else if (analyzer && props.isPlaying) {
    // Get waveform data from analyzer
    waveform = analyzer.getValue()
    shouldDrawWaveform = true
  }
  
  if (shouldDrawWaveform) {
    // Draw waveform
    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = 'rgb(147, 51, 234)' // Purple color
    canvasCtx.beginPath()
    
    const sliceWidth = width / waveform.length
    let x = 0
    
    for (let i = 0; i < waveform.length; i++) {
      const v = waveform[i]
      // Validate the waveform value
      if (!isFinite(v)) continue
      
      const y = Math.max(0, Math.min((v + 1) / 2 * height, height))
      
      if (i === 0) {
        canvasCtx.moveTo(x, y)
      } else {
        canvasCtx.lineTo(x, y)
      }
      
      x += sliceWidth
    }
    
    canvasCtx.stroke()
  } else {
    // Draw idle state (just a centered horizontal line)
    canvasCtx.strokeStyle = 'rgba(147, 51, 234, 0.3)' // Faded purple
    canvasCtx.lineWidth = 2
    canvasCtx.beginPath()
    canvasCtx.moveTo(0, height / 2)
    canvasCtx.lineTo(width, height / 2)
    canvasCtx.stroke()
  }
  
  animationId = requestAnimationFrame(draw)
}

// Update animation when playing state changes
watch(() => props.isPlaying, (newVal) => {
  if (newVal && !animationId) {
    draw()
  }
})

// Update animation when live mode changes
watch(() => props.isLiveMode, (newVal) => {
  if (newVal && !animationId) {
    draw()
  }
})

// Update when live audio data changes
watch(() => props.liveAudioData, () => {
  if (props.isLiveMode && !animationId) {
    draw()
  }
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (analyzer) {
    analyzer.dispose()
  }
})
</script>