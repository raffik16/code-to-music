<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex justify-between items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-indigo-600">
            Code Composer
          </NuxtLink>
          <div class="space-x-4">
            <NuxtLink to="/" class="text-gray-700 hover:text-indigo-600">
              Compose
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-700 hover:text-indigo-600">
              About
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    
    <main class="container mx-auto py-8">
      <slot />
    </main>
    
    <footer class="bg-white border-t mt-8">
      <div class="container mx-auto px-4 py-4 text-center text-gray-600">
        <p>&copy; 2024 Code Composer. Turn your code into music.</p>
      </div>
    </footer>
  </div>
</template>