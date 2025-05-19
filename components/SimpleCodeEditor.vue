<template>
  <div class="w-full">
    <div 
      v-if="highlightCharIndex >= 0"
      class="w-full h-[400px] p-4 font-mono text-sm bg-dark-purple border-2 border-bright-purple overflow-y-auto"
    >
      <pre>
<span v-for="(char, index) in Array.from(modelValue)" :key="index"
      :class="{
        'bg-light-pink text-dark-purple': index === highlightCharIndex,
        'text-bright-purple': index < highlightCharIndex,
        'text-light-pink': index > highlightCharIndex
      }"
>{{ char }}</span>
      </pre>
    </div>
    <textarea
      v-else
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keypress="handleKeypress"
      @paste="handlePaste"
      class="w-full h-[400px] p-4 font-mono text-sm bg-dark-purple text-light-pink border-2 border-dark-purple focus:outline-none focus:border-bright-purple"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  highlightCharIndex: {
    type: Number,
    default: -1
  },
  isLiveMode: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'char:typed'])

const defaultCode = `// Paste your code here
// or write something new

function helloWorld() {
  console.log("Hello, musical world!");
}`

const placeholder = computed(() => {
  return props.isLiveMode ? 'Start typing to hear music...' : defaultCode
})

const handleKeypress = (event) => {
  // Emit the character being typed for live mode
  let char = event.key
  
  // Convert Enter key to newline character
  if (char === 'Enter') {
    char = '\n'
  }
  
  console.log('Key pressed:', event.key, 'Char emitted:', char)
  emit('char:typed', char)
}

const handlePaste = (event) => {
  // Handle paste event to ensure proper update
  event.preventDefault()
  const pastedText = event.clipboardData.getData('text')
  emit('update:modelValue', pastedText)
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: monospace;
}
</style>