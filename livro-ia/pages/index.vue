<template>
    <Fireflies />
    <AmbientSound />
    <div
      class="relative z-10 min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] flex flex-col items-center justify-center px-6 py-12"
    >
      <h1
        class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-400 to-purple-500 mb-12 drop-shadow-lg"
        aria-label="Escritor Mágico"
      >
        Escritor Mágico ❄️🌌
      </h1>
  
      <textarea
        v-model="prompt"
        placeholder="Descreva a ideia do seu livro encantado..."
        class="w-full max-w-xl h-36 p-4 rounded-xl bg-[#1e1e2f] placeholder:text-sky-300 text-sky-100 resize-none shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition mb-6"
        aria-label="Prompt para geração de capítulo"
      />
  
      <button
        @click="gerarCapitulo"
        :disabled="loading || !prompt.trim()"
        class="w-full max-w-xl bg-gradient-to-r from-indigo-400 via-purple-500 hover:from-indigo-500 hover:via-purple-600 hover:to-sky-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-3"
        aria-busy="loading"
        aria-disabled="loading || !prompt.trim()"
      >
        <LoadingSpinner v-if="loading" />
        <span v-else>Gerar Capítulo</span>
      </button>
  
      <section
        v-if="capitulo"
        class="mt-10 max-w-xl bg-[#1e1e2f]/90 p-8 rounded-2xl shadow-2xl text-sky-100 whitespace-pre-wrap drop-shadow-md"
        role="region"
        aria-live="polite"
      >
        <h2 class="text-3xl font-bold mb-6 text-indigo-300">Capítulo Gerado:</h2>
        <p>{{ capitulo }}</p>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  import LoadingSpinner from '~/components/LoadingSpinner.vue'
  import Fireflies from '~/components/Fireflies.vue'
  import AmbientSound from '~/components/AmbientSound.vue'
  
  const prompt = ref('')
  const capitulo = ref('')
  const loading = ref(false)
  
  async function gerarCapitulo() {
    if (!prompt.value.trim()) return
  
    loading.value = true
    capitulo.value = ''
  
    try {
      const { data } = await axios.post('http://localhost:3001/gerar', { prompt: prompt.value })
      capitulo.value = data.capitulo
    } catch (error: any) {
      alert('Erro ao gerar capítulo: ' + (error.message || error))
    } finally {
      loading.value = false
    }
  }
  </script>
  