<template>
  <div class="flex justify-center space-x-4 mt-4">
    <button 
      v-if="isPlaying"
      @click="emit('stop')"
      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
      </svg>
      Stop
    </button>
    <div v-else class="text-gray-500 italic">
      Press "Generate Music" to start
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isPlaying: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['stop'])
</script>