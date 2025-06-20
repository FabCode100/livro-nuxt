<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import PromptInput from '~/components/PromptInput.vue'
import ChapterList from '~/components/ChapterList.vue'

interface Chapter {
  _id: string
  ordem: number
  capitulo: string
  livroId: string
}

const route = useRoute()
const livroId = route.params.id as string

const capitulos = ref<Chapter[]>([])
const loading = ref(false)
const error = ref('')
const config = useRuntimeConfig()

async function fetchCapitulos(livroId: string) {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get<Chapter[]>(`${config.public.apiBase}/capitulos/por-livro/${livroId}`)
    capitulos.value = res.data
  } catch {
    error.value = 'Erro ao carregar capítulos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCapitulos(livroId)
})

watch(() => route.params.id, (newId) => {
  if (newId) fetchCapitulos(newId as string)
})
</script>


<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] px-6 py-12">
    <div class="max-w-4xl mx-auto flex flex-col gap-10">

      <!-- Novo Capítulo -->
      <div class="bg-[#292b3c] p-8 rounded-2xl shadow-lg flex flex-col">
        <h2 class="text-2xl font-bold mb-6 text-sky-300">Nova Ideia para Capítulo</h2>
        <PromptInput :livro-id="livroId" @capituloGerado="() => fetchCapitulos(livroId)" />
      </div>

      <!-- Lista de Capítulos -->
      <div class="bg-[#1e1e2f] p-8 rounded-2xl shadow-lg flex flex-col space-y-10">
        <h2 class="text-2xl font-bold mb-6 text-sky-300">Capítulos Criados</h2>
        <div v-if="loading" class="text-sky-400">Carregando capítulos...</div>
        <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>
        <ChapterList v-else :capitulos="capitulos" />
      </div>

    </div>
  </div>
</template>



