<template>
  <div ref="editorContainer" class="w-full h-[400px] border border-gray-300 rounded"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['update:code'])
const editorContainer = ref(null)
let editor = null

onMounted(async () => {
  if (process.client) {
    try {
      // Use the monaco instance from the plugin
      const { $monaco } = useNuxtApp()
      
      // Wait for Monaco Environment to be configured
      await new Promise(resolve => setTimeout(resolve, 100))
      
      editor = $monaco.editor.create(editorContainer.value, {
        value: '// Paste your code here\n// or write something new\n\nfunction helloWorld() {\n  console.log("Hello, musical world!");\n}',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        // Disable some features that might cause issues
        quickSuggestions: false,
        parameterHints: false,
        suggestOnTriggerCharacters: false,
        snippetSuggestions: 'none',
        folding: false,
        lineNumbersMinChars: 3,
        wordBasedSuggestions: false
      })
      
      editor.onDidChangeModelContent(() => {
        emit('update:code', editor.getValue())
      })
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error)
    }
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>