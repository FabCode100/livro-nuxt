<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] px-6 py-12 relative overflow-hidden">
    <!-- Fundo animado com partículas -->
    <Fireflies />
    <AmbientSound />

    <div
      class="relative z-10 min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] flex flex-col items-center px-6 py-12">
      <!-- Cabeçalho -->
      <header class="w-full max-w-5xl flex items-center justify-between mb-10">
        <h1
          class="text-5xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-400 to-purple-500 drop-shadow-lg"
          aria-label="Escritor Mágico">
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
        <section class="flex-1 bg-[#1e1f38]/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-sky-500/10">
          <PromptInput @capituloGerado="capitulo => capituloGerado = capitulo" />

          <!-- Seletor de capas -->
          <div class="mt-6">
            <p class="text-sky-400 mb-2 font-semibold">Escolha uma capa:</p>
            <div class="grid grid-cols-3 gap-2">
              <img v-for="(capa, idx) in capasDisponiveis" :key="idx" :src="`/covers/${capa}`" :alt="`Capa ${idx + 1}`"
                class="cursor-pointer rounded-md border-4 w-full max-w-[120px] h-[120px] object-cover transition-colors duration-300"
                :class="capaSelecionada === capa
                  ? 'border-purple-500 shadow-lg'
                  : 'border-transparent hover:border-sky-500 hover:shadow-sm'" @click="capaSelecionada = capa" />
            </div>
          </div>
        </section>

        <!-- Exibição do capítulo e capa selecionada -->
        <section
          class="flex-1 bg-[#282a4e]/90 backdrop-blur-sm rounded-lg p-6 shadow-lg overflow-y-auto max-h-[600px] flex flex-col items-center border border-indigo-500/10 custom-scroll">
          <div v-if="capaSelecionada" class="mb-4 max-w-xs w-full">
            <img :src="`/covers/${capaSelecionada}`" alt="Capa Selecionada"
              class="rounded-lg shadow-lg w-full object-cover" />
          </div>

          <ChapterDisplay v-if="capituloGerado" :capitulo="capituloGerado" />
          <p v-else class="text-sky-300/60 italic text-center mt-4">
            Seu capítulo aparecerá aqui.
          </p>
        </section>
      </main>

      <!-- Biblioteca do usuário -->
      <LibraryShelf class="mt-16" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#app'

import Fireflies from '@/components/Fireflies.vue'
import AmbientSound from '@/components/AmbientSound.vue'
import PromptInput from '@/components/PromptInput.vue'
import ChapterDisplay from '@/components/ChapterDisplay.vue'
import LibraryShelf from '@/components/LibraryShelf.vue'

const capituloGerado = ref(null)

// Capas disponíveis
const capasDisponiveis = [
  'capa1.jpg',
  'capa2.jpg',
  'capa3.jpg',
  'capa4.jpg',
  'capa5.jpg',
  'capa6.jpg'
]

// Estado para capa selecionada (inicial vazio ou a primeira capa)
const capaSelecionada = ref(capasDisponiveis[0])

// Pré-carregar capas
useHead({
  link: capasDisponiveis.map(capa => ({
    rel: 'preload',
    as: 'image',
    href: `/covers/${capa}`
  }))
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #4f46e5;
  border-radius: 4px;
}
</style>
