<template>
  <div class="w-full">
    <div 
      v-if="highlightCharIndex >= 0"
      class="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 border border-gray-700 rounded-lg overflow-y-auto"
    >
      <pre>
<span v-for="(char, index) in Array.from(code)" :key="index"
      :class="{
        'bg-yellow-500 text-black': index === highlightCharIndex,
        'text-gray-500': index < highlightCharIndex,
        'text-gray-100': index > highlightCharIndex
      }"
>{{ char }}</span>
      </pre>
    </div>
    <textarea
      v-else
      v-model="code"
      @input="handleInput"
      @keypress="handleKeypress"
      @paste="handlePaste"
      class="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  highlightCharIndex: {
    type: Number,
    default: -1
  },
  isLiveMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:code', 'char:typed'])

const code = ref('')
const defaultCode = `// Paste your code here
// or write something new

function helloWorld() {
  console.log("Hello, musical world!");
}`

const placeholder = computed(() => {
  return props.isLiveMode ? 'Start typing to hear music...' : defaultCode
})

const handleInput = (event) => {
  emit('update:code', code.value)
}

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
  code.value = pastedText
  emit('update:code', pastedText)
}

// Watch for any changes to ensure sync
watch(code, (newValue) => {
  emit('update:code', newValue)
})

// Watch for live mode changes
watch(() => props.isLiveMode, (newValue) => {
  if (newValue) {
    // Clear the code when entering live mode
    code.value = ''
    emit('update:code', '')
  } else {
    // Set default code when leaving live mode
    code.value = defaultCode
    emit('update:code', defaultCode)
  }
})

// Emit initial value
onMounted(() => {
  if (!props.isLiveMode) {
    code.value = defaultCode
  }
  emit('update:code', code.value)
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: monospace;
}
</style>