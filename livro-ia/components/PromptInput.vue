<template>
  <div class="w-full max-w-xl mx-auto">
    <label
      for="prompt"
      class="block mb-3 text-lg font-semibold text-sky-300 drop-shadow-sm"
    >
      Descreva a ideia do seu livro encantado:
    </label>

    <textarea
      id="prompt"
      v-model="prompt"
      placeholder="Ex: Um jovem descobre que pode controlar o tempo..."
      class="w-full h-36 p-4 rounded-2xl bg-[#1b1e3a] text-sky-100 placeholder:text-sky-400 resize-none shadow-md border border-[#2e314f] focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition"
    />

    <button
  @click="gerarCapitulo"
  :disabled="loading || !prompt.trim()"
  class="magic-button relative mt-6 w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-br from-[#433b86] via-[#6b52a1] to-[#4a3c72] shadow-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center gap-3 overflow-hidden"
>
  <LoadingSpinner v-if="loading" />
  <span v-else>✨ Gerar Capítulo</span>
</button>



    <p
      v-if="errorMessage"
      class="mt-4 text-center text-red-400 font-medium"
    >
      {{ errorMessage }}
    </p>
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
      prompt: prompt.value,
      bookId: props.livroId,
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
<style scoped>
.magic-button::before,
.magic-button::after {
  content: '';
  position: absolute;
  border-radius: 9999px;
  opacity: 0;
  pointer-events: none;
  animation: sparkle 2s infinite ease-in-out;
  background: radial-gradient(circle, #b794f4, transparent 60%);
  filter: blur(3px);
}

.magic-button::before {
  width: 10px;
  height: 10px;
  top: 25%;
  left: 30%;
  animation-delay: 0s;
}

.magic-button::after {
  width: 8px;
  height: 8px;
  top: 60%;
  left: 65%;
  animation-delay: 0.5s;
}

.magic-button:hover::before,
.magic-button:hover::after {
  opacity: 0.7;
}

@keyframes sparkle {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-6px, -4px) scale(1.6);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
}

</style>