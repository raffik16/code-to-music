<template>
  <div class="playback-mode">
    <div class="mode-selector mb-4">
      <label class="block text-sm font-medium mb-2 text-dark-purple">Playback Mode</label>
      <select 
        v-model="selectedMode" 
        @change="updateMode"
        class="w-full px-3 py-2 border-2 border-dark-purple bg-white text-dark-purple focus:outline-none focus:border-bright-purple"
      >
        <option value="character">Character-by-character</option>
        <option value="live">Live Type (Musical Keyboard)</option>
      </select>
    </div>
    
    <div v-if="selectedMode === 'character' || selectedMode === 'live'" class="character-options">
      <label class="block text-sm font-medium mb-2 text-dark-purple">Line Break Sound</label>
      <select 
        v-model="selectedLineBreakSound" 
        @change="updateLineBreakSound"
        class="w-full px-3 py-2 border-2 border-dark-purple bg-white text-dark-purple focus:outline-none focus:border-bright-purple"
      >
        <option 
          v-for="sound in lineBreakSounds" 
          :key="sound.value" 
          :value="sound.value"
        >
          {{ sound.label }}
        </option>
      </select>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCharacterMusic } from '@/composables/useCharacterMusic'

const emit = defineEmits(['update:mode', 'update:lineBreakSound'])

const { lineBreakSounds } = useCharacterMusic()

const selectedMode = ref('character')
const selectedLineBreakSound = ref('gong')

const updateMode = () => {
  emit('update:mode', selectedMode.value)
}

const updateLineBreakSound = () => {
  emit('update:lineBreakSound', selectedLineBreakSound.value)
}
</script>