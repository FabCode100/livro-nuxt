<template>
  <Fireflies />
  <AmbientSound />

  <div
    class="relative z-10 min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] flex flex-col items-center px-6 py-12"
  >
    <!-- Cabeçalho -->
    <header class="w-full max-w-5xl flex items-center justify-between mb-10">
      <h1
        class="text-5xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-400 to-purple-500 drop-shadow-lg"
        aria-label="Escritor Mágico"
      >
        Escritor Mágico ❄️🌌
      </h1>
      <nav class="space-x-6 text-sky-300 font-semibold">
        <button class="hover:text-purple-400 transition">Biblioteca</button>
        <button class="hover:text-purple-400 transition">Feed</button>
        <button class="hover:text-purple-400 transition">Perfil</button>
      </nav>
    </header>

    <!-- Área principal -->
    <main class="w-full max-w-5xl flex flex-col md:flex-row gap-10">
      <!-- Input de criação -->
      <section class="flex-1 bg-[#1e1f38] rounded-lg p-6 shadow-lg">
        <PromptInput @capituloGerado="capitulo => capituloGerado = capitulo" />
      </section>

      <!-- Exibição do capítulo -->
      <section class="flex-1 bg-[#282a4e] rounded-lg p-6 shadow-lg overflow-auto max-h-[600px]">
        <ChapterDisplay v-if="capituloGerado" :capitulo="capituloGerado" />
        <p v-else class="text-sky-300/60 italic">Seu capítulo aparecerá aqui.</p>
      </section>
    </main>

    <!-- Biblioteca do usuário -->
    <LibraryShelf class="mt-16" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#app' // ✅ Import para preload

import Fireflies from '@/components/Fireflies.vue'
import AmbientSound from '@/components/AmbientSound.vue'
import PromptInput from '@/components/PromptInput.vue'
import ChapterDisplay from '@/components/ChapterDisplay.vue'
import LibraryShelf from '@/components/LibraryShelf.vue'

const capituloGerado = ref(null)

// ✅ Capas a serem usadas no seletor
const capasDisponiveis = [
  'capa1.jpg',
  'capa2.jpg',
  'capa3.jpg',
  'capa4.jpg',
  'capa5.jpg',
  'capa6.jpg'
]

// ✅ Pré-carregar capas no <head>
useHead({
  link: capasDisponiveis.map(capa => ({
    rel: 'preload',
    as: 'image',
    href: `/covers/${capa}`
  }))
})
</script>

