<template> 
  <section class="mt-12 max-w-5xl w-full px-4">
    <h2 class="text-3xl font-bold text-sky-300 mb-6">Meus Livros</h2>

    <div v-if="loading" class="text-sky-400 italic py-12 text-center">
      Carregando livros...
    </div>

    <div v-else>
      <div v-if="books.length === 0" class="text-sky-400 italic flex flex-col items-center gap-6 py-12 border-2 border-dashed border-sky-500 rounded-lg">
        <p class="text-lg">Sua estante está vazia.</p>
        <button
          @click="abrirCriarLivro"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition"
        >
          Criar Novo Livro
        </button>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div
          v-for="book in books"
          :key="book._id"
          class="bg-[#1f2140] rounded-lg p-4 cursor-pointer hover:bg-[#2e2f58] transition"
          @click="selecionarLivro(book)"
        >
          <img
            v-if="book.capa"
            :src="`/covers/${book.capa}`"
            alt="Capa do livro"
            class="h-40 w-full object-cover rounded"
          />
          <div v-else class="h-40 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-md flex items-center justify-center text-white font-semibold text-xl">
            📚
          </div>
          <p class="mt-3 text-sky-300 font-semibold truncate">{{ book.titulo }}</p>
        </div>

        <!-- Card de criar novo -->
        <div
          class="flex items-center justify-center bg-[#1f2140] rounded-lg p-4 cursor-pointer border-2 border-sky-500 hover:border-purple-500 transition"
          @click="abrirCriarLivro"
        >
          <span class="text-sky-300 text-4xl select-none">＋</span>
        </div>
      </div>
    </div>

<!-- Modal -->
<transition name="fade">
  <div
    v-show="showModal"
    class="fixed inset-0 bg-[#0a1128]/30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <transition name="zoom">
      <div class="bg-[#1e1f38] rounded-xl p-8 w-96 shadow-xl" @click.stop>
        <h3 class="text-xl font-semibold text-sky-300 mb-4">Criar Novo Livro</h3>

        <!-- Campo título -->
        <input
          v-model="novoTitulo"
          type="text"
          placeholder="Título do livro"
          class="w-full px-4 py-2 rounded bg-[#282a4e] text-white focus:outline-none mb-4"
        />

        <!-- Capa selecionada -->
        <div class="mb-4">
          <p class="text-sky-400 mb-2">Capa selecionada:</p>

          <div
            v-if="capaSelecionada"
            class="w-full h-40 rounded overflow-hidden border-2 border-sky-500"
          >
            <img
              :src="`/covers/${capaSelecionada}`"
              alt="Capa selecionada"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div
            v-else
            class="w-full h-40 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-md flex items-center justify-center text-white text-xl"
          >
            Nenhuma capa selecionada
          </div>

          <button
  @click="mostrarSeletor = !mostrarSeletor"
  :aria-expanded="mostrarSeletor"
  class="mt-2 px-4 py-2 border border-sky-500 text-sky-300 rounded hover:bg-[#2b3055] transition text-sm"
>
  {{ mostrarSeletor ? 'Fechar seletor de capas' : 'Escolher capa' }}
</button>


        </div>

        <!-- Miniaturas do seletor (carregado apenas quando necessário) -->
        <div v-if="mostrarSeletor" class="grid grid-cols-3 gap-2 mb-4">
          <div
            v-for="(capa, index) in capasDisponiveis"
            :key="index"
            @click="capaSelecionada = capa"
            class="cursor-pointer border-2 rounded overflow-hidden transition-all duration-150"
            :class="{
              'border-indigo-500 ring-2 ring-indigo-400': capaSelecionada === capa,
              'border-transparent hover:border-sky-500': capaSelecionada !== capa
            }"
          >
            <img
              :src="`/covers/${capa}`"
              alt="Miniatura da capa"
              class="w-full h-16 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-4">
          <button
            @click="fecharModal"
            class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white"
          >
            Cancelar
          </button>
          <button
            @click="criarLivro"
            :disabled="!novoTitulo.trim() || !capaSelecionada"
            class="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            Criar
          </button>
        </div>
      </div>
    </transition>
  </div>
</transition>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
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
const capasCarregadas = ref(false)
const mostrarSeletor = ref(false) // ✅ ESSA LINHA FALTAVA

const config = useRuntimeConfig()
const router = useRouter()

const capasDisponiveis = [
  'capa1.jpg',
  'capa2.jpg',
  'capa3.jpg',
  'capa4.jpg',
  'capa5.jpg',
  'capa6.jpg'
]

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
  mostrarSeletor.value = false // ✅ Opcional: sempre começa fechado
  capasCarregadas.value = false

  nextTick(() => {
    setTimeout(() => {
      capasCarregadas.value = true
    }, 50)
  })
}

function fecharModal() {
  showModal.value = false
  mostrarSeletor.value = false // ✅ fecha seletor também
}

async function criarLivro() {
  if (!novoTitulo.value.trim() || !capaSelecionada.value) return

  try {
    const payload = {
      titulo: novoTitulo.value.trim(),
      capa: capaSelecionada.value
    }

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

onMounted(() => {
  carregarLivros()

  // Pré-carrega as imagens
  for (const capa of capasDisponiveis) {
    const img = new Image()
    img.src = `/covers/${capa}`
  }
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
