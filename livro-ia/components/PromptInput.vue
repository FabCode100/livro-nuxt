<template>
  <div class="w-full max-w-xl">
    <textarea
      v-model="prompt"
      placeholder="Descreva a ideia do seu livro encantado..."
      class="w-full h-36 p-4 rounded-xl bg-[#1e1e2f] placeholder:text-sky-300 text-sky-100 resize-none shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition mb-6"
    />
    <button
      @click="emitPrompt"
      :disabled="!prompt.trim()"
      class="w-full bg-gradient-to-r from-indigo-400 via-purple-500 to-sky-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-indigo-500 transition disabled:opacity-50"
    >
      Gerar Capítulo
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['gerar'])
const prompt = ref('')

function emitPrompt() {
  emit('gerar', prompt.value)
}
</script>
