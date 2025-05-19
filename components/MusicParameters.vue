<template>
  <div class="mt-6 space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Tempo (BPM)</label>
      <input 
        type="range" 
        min="60" 
        max="200" 
        v-model="tempo"
        @input="updateParams"
        class="w-full"
      />
      <span class="text-sm text-gray-600">{{ tempo }}</span>
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-1">Scale</label>
      <select 
        v-model="scale"
        @change="updateParams"
        class="w-full p-2 border rounded"
      >
        <option value="major">Major</option>
        <option value="minor">Minor</option>
        <option value="dorian">Dorian</option>
        <option value="phrygian">Phrygian</option>
        <option value="lydian">Lydian</option>
        <option value="mixolydian">Mixolydian</option>
      </select>
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-1">Octave</label>
      <input 
        type="range" 
        min="2" 
        max="6" 
        v-model="octave"
        @input="updateParams"
        class="w-full"
      />
      <span class="text-sm text-gray-600">{{ octave }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:parameters'])

const tempo = ref(120)
const scale = ref('major')
const octave = ref(4)

const updateParams = () => {
  emit('update:parameters', {
    tempo: tempo.value,
    scale: scale.value,
    octave: octave.value
  })
}
</script>