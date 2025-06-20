<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] px-6 py-12 relative overflow-hidden">
    <!-- Fundo animado com partículas -->
    <Fireflies />
    <AudioPlayer />

    <!-- Conteúdo central -->
    <div class="w-full max-w-2xl mx-auto flex flex-col gap-10 relative z-10">
      <!-- Botão Voltar -->
      <router-link to="/"
        class="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0a1128]/60 hover:bg-[#1f1f38]/80 text-sky-300 hover:text-white font-medium transition group backdrop-blur-md shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:-translate-x-1 transition"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </router-link>

      <!-- Capa com título sobreposto -->
      <section class="relative rounded-2xl overflow-hidden shadow-2xl">
        <img :src="`/covers/${livro.capa}`" :alt="`Capa do livro ${livro.titulo}`" class="w-full h-64 object-cover" />

        <!-- Overlay escuro com blur e glow -->
        <div
          class="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center px-6">
          <h1
            class="text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center"
            :title="livro.titulo">
            {{ livro.titulo }}
          </h1>
        </div>
      </section>

      <!-- Nova Ideia para Capítulo -->
      <section
        class="bg-[#292b3c]/90 p-8 rounded-2xl shadow-lg w-full text-center backdrop-blur-sm border border-sky-500/10">
        <h2 class="text-2xl font-bold mb-6 text-sky-300">Nova Ideia para Capítulo</h2>
        <PromptInput :livro-id="livroId" @capituloGerado="() => fetchCapitulos(livroId)" />
      </section>

      <!-- Lista de Capítulos -->
      <section
        class="bg-[#1e1e2f]/90 p-8 rounded-2xl shadow-lg w-full backdrop-blur-sm border border-indigo-500/10 max-h-[600px] overflow-y-auto custom-scroll space-y-10">
        <h2 class="text-2xl font-bold mb-6 text-sky-300">Capítulos Criados</h2>
        <div v-if="loading" class="text-sky-400 italic">Carregando capítulos...</div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <ChapterList v-else :capitulos="capitulos" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import PromptInput from '~/components/PromptInput.vue'
import ChapterList from '~/components/ChapterList.vue'
import AudioPlayer from '~/components/AmbientSound.vue'
import Fireflies from '~/components/Fireflies.vue'

interface Chapter {
  _id: string
  ordem: number
  capitulo: string
  livroId: string
}

interface Livro {
  _id: string
  titulo: string
  capa: string
}

const route = useRoute()
const livroId = ref(route.params.id as string)
const capitulos = ref<Chapter[]>([])
const loading = ref(false)
const error = ref('')
const livro = ref<Livro>({
  _id: '',
  titulo: '',
  capa: ''
})

const config = useRuntimeConfig()

async function fetchLivro(id: string) {
  try {
    const res = await axios.get<Livro>(`${config.public.apiBase}/books/${id}`)
    livro.value = res.data
  } catch {
    livro.value = {
      _id: '',
      titulo: 'Livro desconhecido',
      capa: 'default-cover.jpg'
    }
  }
}

async function fetchCapitulos(id: string) {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get<Chapter[]>(`${config.public.apiBase}/capitulos/por-livro/${id}`)
    capitulos.value = res.data
  } catch {
    error.value = 'Erro ao carregar capítulos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (livroId.value) {
    fetchLivro(livroId.value)
    fetchCapitulos(livroId.value)
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    livroId.value = newId as string
    fetchLivro(livroId.value)
    fetchCapitulos(livroId.value)
  }
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
