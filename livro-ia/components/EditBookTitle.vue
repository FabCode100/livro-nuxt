<template>
  <div class="flex gap-2 items-center mb-4">
    <input
      v-model="titulo"
      class="bg-gray-800 text-white rounded px-4 py-2 w-full max-w-xs"
    />
    <button
      @click="emit('editar', titulo)"
      class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
    >
      Salvar
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['editar'])

const titulo = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  titulo.value = val
})
</script>
