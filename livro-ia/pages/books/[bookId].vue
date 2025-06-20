<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const livroId = route.params.id as string

interface Chapter {
  _id: string
  ordem: number
  capitulo: string
  livroId: string
}
const capitulos = ref<Chapter[]>([])

const loading = ref(false)
const prompt = ref('')
const gerando = ref(false)

async function fetchCapitulos() {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:3002/capitulos/${livroId}`)
    capitulos.value = res.data
  } finally {
    loading.value = false
  }
}

async function gerarCapitulo() {
  if (!prompt.value.trim()) return
  gerando.value = true
  try {
    await axios.post('http://localhost:3002/capitulos', {
      prompt: prompt.value,
      livroId,
    })
    prompt.value = ''
    await fetchCapitulos()
  } finally {
    gerando.value = false
  }
}

onMounted(() => {
  fetchCapitulos()
})
</script>

<template>
  <div>
    <h1>Capítulos do livro</h1>

    <textarea v-model="prompt" placeholder="Nova ideia para capítulo..." rows="4" />
    <button @click="gerarCapitulo" :disabled="gerando || !prompt.trim()">
      {{ gerando ? 'Gerando...' : 'Gerar capítulo' }}
    </button>

    <div v-if="loading">Carregando capítulos...</div>
    <ul v-else>
      <li v-for="cap in capitulos" :key="cap._id">
        <h3>Capítulo {{ cap.ordem }}</h3>
        <p>{{ cap.capitulo }}</p>
      </li>
    </ul>
  </div>
</template>
