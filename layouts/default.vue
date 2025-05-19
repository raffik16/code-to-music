<template>
  <div class="min-h-screen bg-light-pink">
    <header class="bg-white">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex justify-between items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-bright-purple">
            Code Composer
          </NuxtLink>
          <div class="space-x-4">
            <NuxtLink to="/" class="text-dark-purple hover:text-bright-purple transition-colors">
              Compose
            </NuxtLink>
            <NuxtLink to="/about" class="text-dark-purple hover:text-bright-purple transition-colors">
              About
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    
    <main class="container mx-auto py-8">
      <slot />
    </main>
    
    <footer class="bg-white mt-8">
      <div class="container mx-auto px-4 py-4 text-center text-dark-purple">
        <p>Turn your code into music.</p>
      </div>
    </footer>
  </div>
</template>