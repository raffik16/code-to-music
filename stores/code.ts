import { defineStore } from 'pinia'

export const useCodeStore = defineStore('code', {
  state: () => ({
    code: '',
    language: 'javascript',
    savedCompositions: []
  }),
  
  actions: {
    setCode(newCode) {
      console.log('Store.setCode called with:', newCode)
      this.code = newCode
      console.log('Store.code after setting:', this.code)
      this.detectLanguage()
    },
    
    detectLanguage() {
      // Simple language detection logic
      if (this.code.includes('def ') && this.code.includes(':')) {
        this.language = 'python'
      } else if (this.code.includes('class ') && this.code.includes('{')) {
        this.language = 'java'
      } else {
        this.language = 'javascript'
      }
    },
    
    async saveComposition(title) {
      try {
        const { data } = await useFetch('/api/save', {
          method: 'POST',
          body: {
            title,
            code: this.code,
            date: new Date().toISOString()
          }
        })
        
        this.savedCompositions.push(data.value)
        return data.value.id
      } catch (error) {
        console.error('Failed to save composition', error)
        return null
      }
    }
  }
})