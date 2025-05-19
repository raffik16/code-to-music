export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/styles/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        'tone',
        'monaco-editor',
        'monaco-editor/esm/vs/editor/editor.worker',
        'monaco-editor/esm/vs/language/json/json.worker',
        'monaco-editor/esm/vs/language/css/css.worker',
        'monaco-editor/esm/vs/language/html/html.worker',
        'monaco-editor/esm/vs/language/typescript/ts.worker'
      ]
    },
    esbuild: {
      include: /\.(ts|js|json)$/,
      exclude: []
    }
  },
  app: {
    head: {
      title: 'Code Composer',
      meta: [
        { name: 'description', content: 'Turn your code into music' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },
  ssr: false // Disable SSR for Monaco Editor
})