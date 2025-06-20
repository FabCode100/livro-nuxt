<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1f1f38] to-[#362f53] px-6 py-12">
    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-400 to-purple-500 mb-10 text-center">
      Meus Livros 📚
    </h1>

    <p v-if="loading" class="text-center text-indigo-300 mt-6">Carregando livros...</p>
    <p v-if="error" class="text-center text-red-500 mt-6">{{ error }}</p>
    
    <BookList v-if="!loading && books.length" :books="books" />
    <p v-else-if="!loading && !books.length" class="text-center text-indigo-300">Nenhum livro encontrado.</p>
  </div>
</template>

<script setup lang="ts">
import BookList from '~/components/BookList.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Book {
  _id: string
  titulo: string
  criadoEm: string
}

const books = ref<Book[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const res = await axios.get<Book[]>(`${config.public.apiBase}/books`)
    books.value = res.data
  } catch (err: any) {
    error.value = 'Erro ao buscar livros: ' + (err.message || err)
  } finally {
    loading.value = false
  }
})
</script>
