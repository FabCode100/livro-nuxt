<template>
  <div class="w-full max-w-xl mx-auto">
    <label for="prompt" class="block mb-2 text-lg font-medium text-sky-300">Descreva a ideia do seu livro encantado:</label>
    <textarea
      id="prompt"
      v-model="prompt"
      placeholder="Ex: Um jovem descobre que pode controlar o tempo..."
      class="w-full h-36 p-4 rounded-xl bg-[#1e1e2f] placeholder:text-sky-300 text-sky-100 resize-none shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition mb-6"
    />

    <button
      @click="gerarCapitulo"
      :disabled="loading || !prompt.trim()"
      class="w-full bg-gradient-to-r from-indigo-400 via-purple-500 to-sky-600 hover:from-indigo-500 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-3"
    >
      <LoadingSpinner v-if="loading" />
      <span v-else>Gerar Capítulo</span>
    </button>

    <p v-if="errorMessage" class="mt-4 text-center text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import LoadingSpinner from './LoadingSpinner.vue'

const emit = defineEmits(['capituloGerado'])
const props = defineProps<{ livroId?: string }>()

const prompt = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function gerarCapitulo() {
  if (!prompt.value.trim()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const config = useRuntimeConfig()
    const { data } = await axios.post(`${config.public.apiBase}/capitulos`, { 
        prompt: prompt.value, bookId: props.livroId, 
    })
    emit('capituloGerado', data.capitulo || data.content || JSON.stringify(data))
    prompt.value = ''
    
  } catch (error: any) {
    errorMessage.value = 'Erro ao gerar capítulo: ' + (error.message || 'Erro desconhecido')
  } finally {
    loading.value = false
  }
}
</script>
