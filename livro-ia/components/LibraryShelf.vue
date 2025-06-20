<template>
  <section class="mt-12 max-w-5xl w-full px-4 relative z-10">
    <h2 class="text-3xl font-bold text-sky-300 mb-6 drop-shadow-md">Meus Livros</h2>

    <div v-if="loading" class="text-sky-400 italic py-12 text-center">Carregando livros...</div>

    <div v-else>
      <div v-if="books.length === 0"
        class="text-sky-400 italic flex flex-col items-center gap-6 py-12 border-2 border-dashed border-sky-500 rounded-lg bg-[#1e1f38]/70 backdrop-blur-sm">
        <p class="text-lg">Sua estante está vazia.</p>
        <button @click="abrirCriarLivro"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition shadow-md">
          Criar Novo Livro
        </button>
      </div>

      <transition-group name="fade-book" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div v-for="book in books" :key="book._id"
          class="bg-[#1e1f38]/90 rounded-lg p-4 shadow-lg hover:bg-[#282a4e]/90 transition duration-300 relative">
          <div @click="selecionarLivro(book)" class="cursor-pointer">
            <img v-if="book.capa" :src="`/covers/${book.capa}`" class="h-40 w-full object-cover rounded"
              loading="lazy" />
            <div v-else
              class="h-40 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-md flex items-center justify-center text-white font-semibold text-xl select-none">
              📚
            </div>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <input v-if="editandoId === book._id" v-model="novoTituloEdicao" @blur="salvarEdicao(book)"
              @keyup.enter="salvarEdicao(book)"
              class="bg-[#282a4e] text-sky-300 font-semibold px-2 py-1 rounded w-full focus:outline-none"
              :placeholder="book.titulo" autofocus />
            <p v-else class="text-sky-300 font-semibold truncate drop-shadow-sm w-full cursor-text"
              @dblclick.stop="iniciarEdicao(book)">
              {{ book.titulo }}
            </p>

            <button @click.stop="abrirConfirmacao(book)" class="text-red-400 hover:text-red-500 transition"
              title="Excluir livro">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-3H10a1 1 0 00-1 1v1h8V5a1 1 0 00-1-1z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Criar novo livro -->
        <div @click="abrirCriarLivro"
          class="flex items-center justify-center bg-[#1e1f38]/90 rounded-lg p-4 cursor-pointer border-2 border-sky-500 hover:border-purple-500 transition shadow-lg">
          <span class="text-sky-300 text-4xl select-none">＋</span>
        </div>
      </transition-group>

    </div>

    <!-- Modal de criação (já estava implementado) -->
    <transition name="fade">
      <div v-show="showModal"
        class="fixed inset-0 bg-[#0a1128]/30 backdrop-blur-sm flex items-center justify-center z-50">
        <transition name="zoom">
          <div class="bg-[#1e1f38]/95 rounded-xl p-8 w-96 shadow-xl border border-sky-500/20" @click.stop>
            <h3 class="text-xl font-semibold text-sky-300 mb-4 drop-shadow-md">Criar Novo Livro</h3>
            <input v-model="novoTitulo" type="text" placeholder="Título do livro"
              class="w-full px-4 py-2 rounded bg-[#282a4e] text-white focus:outline-none mb-4 placeholder:text-sky-400" />

            <!-- Capa selecionada -->
            <div class="mb-4">
              <p class="text-sky-400 mb-2 font-semibold">Capa selecionada:</p>
              <div v-if="capaSelecionada"
                class="w-full h-40 rounded overflow-hidden border-2 border-sky-500 shadow-inner">
                <img :src="`/covers/${capaSelecionada}`" alt="Capa selecionada" class="w-full h-full object-cover"
                  loading="lazy" />
              </div>
              <div v-else
                class="w-full h-40 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-md flex items-center justify-center text-white text-xl select-none">
                Nenhuma capa selecionada
              </div>
              <button @click="mostrarSeletor = !mostrarSeletor" :aria-expanded="mostrarSeletor"
                class="mt-2 px-4 py-2 border border-sky-500 text-sky-300 rounded hover:bg-[#2b3055] transition text-sm shadow-sm">
                {{ mostrarSeletor ? 'Fechar seletor de capas' : 'Escolher capa' }}
              </button>
            </div>

            <div v-if="mostrarSeletor" class="grid grid-cols-3 gap-2 mb-4">
              <div v-for="(capa, index) in capasDisponiveis" :key="index" @click="capaSelecionada = capa"
                class="cursor-pointer border-2 rounded overflow-hidden transition-all duration-150" :class="{
                  'border-indigo-500 ring-2 ring-indigo-400': capaSelecionada === capa,
                  'border-transparent hover:border-sky-500': capaSelecionada !== capa
                }">
                <img :src="`/covers/${capa}`" alt="Miniatura da capa" class="w-full h-16 object-cover" loading="lazy" />
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <button @click="fecharModal"
                class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white shadow-sm">Cancelar</button>
              <button @click="criarLivro" :disabled="!novoTitulo.trim() || !capaSelecionada"
                class="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm">
                Criar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Modal de confirmação de exclusão -->
    <transition name="fade">
      <div v-if="livroParaExcluir"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="bg-[#1e1f38] rounded-xl p-6 w-full max-w-sm border border-sky-500/20 shadow-xl text-white">
          <h3 class="text-xl font-semibold text-sky-300 mb-4">Confirmar exclusão</h3>
          <p class="mb-6 text-sky-400">Deseja excluir o livro <strong>{{ livroParaExcluir.titulo }}</strong>?</p>
          <div class="flex justify-end gap-4">
            <button @click="livroParaExcluir = null"
              class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">Cancelar</button>
            <button @click="deletarLivroConfirmado"
              class="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white">Excluir</button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Book {
  _id: string
  titulo: string
  capa?: string
}

const books = ref<Book[]>([])
const loading = ref(false)
const showModal = ref(false)
const novoTitulo = ref('')
const capaSelecionada = ref<string | null>(null)
const mostrarSeletor = ref(false)
const livroParaExcluir = ref<Book | null>(null)

const editandoId = ref<string | null>(null)
const novoTituloEdicao = ref('')

const config = useRuntimeConfig()
const router = useRouter()

const capasDisponiveis = ['capa1.jpg', 'capa2.jpg', 'capa3.jpg', 'capa4.jpg', 'capa5.jpg', 'capa6.jpg']

async function carregarLivros() {
  loading.value = true
  try {
    const res = await axios.get<Book[]>(`${config.public.apiBase}/books`)
    books.value = res.data
  } catch {
    console.error('Erro ao carregar livros.')
  } finally {
    loading.value = false
  }
}

function abrirCriarLivro() {
  showModal.value = true
  novoTitulo.value = ''
  capaSelecionada.value = null
  mostrarSeletor.value = false

  nextTick(() => {
    capasDisponiveis.forEach(capa => {
      const img = new Image()
      img.src = `/covers/${capa}`
    })
  })
}

function fecharModal() {
  showModal.value = false
  mostrarSeletor.value = false
}

async function criarLivro() {
  if (!novoTitulo.value.trim() || !capaSelecionada.value) return
  try {
    const payload = { titulo: novoTitulo.value.trim(), capa: capaSelecionada.value }
    const res = await axios.post(`${config.public.apiBase}/books`, payload)
    books.value.push(res.data)
    fecharModal()
  } catch {
    console.error('Erro ao criar livro.')
  }
}

function selecionarLivro(book: Book) {
  router.push(`/books/${book._id}`)
}

function iniciarEdicao(book: Book) {
  editandoId.value = book._id
  novoTituloEdicao.value = book.titulo
}

async function salvarEdicao(book: Book) {
  if (!novoTituloEdicao.value.trim()) return
  try {
    await axios.put(`${config.public.apiBase}/books/${book._id}`, {
      titulo: novoTituloEdicao.value.trim()
    })
    book.titulo = novoTituloEdicao.value.trim()
    editandoId.value = null
  } catch {
    console.error('Erro ao editar título.')
  }
}

function abrirConfirmacao(book: Book) {
  livroParaExcluir.value = book
}

async function deletarLivroConfirmado() {
  const book = livroParaExcluir.value
  if (!book) return

  try {
    await axios.delete(`${config.public.apiBase}/books/${book._id}`)

    // Aguarda a transição antes de remover da lista
    const index = books.value.findIndex(b => b._id === book._id)
    if (index !== -1) {
      const elemento = document.querySelectorAll('[data-v-app] [data-v-' + book._id + ']')[0]
      if (elemento) {
        elemento.classList.add('fade-book-leave-active')
      }

      // Remoção com delay pra transição ocorrer
      setTimeout(() => {
        books.value.splice(index, 1)
      }, 300)
    }

    livroParaExcluir.value = null
  } catch {
    console.error('Erro ao deletar livro.')
  }
}


onMounted(() => {
  carregarLivros()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
