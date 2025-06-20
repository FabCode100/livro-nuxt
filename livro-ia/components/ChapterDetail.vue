<template>
  <div class="bg-[#1e1e2f] text-sky-100 p-6 rounded-xl shadow-xl">
    <h2 class="text-2xl font-bold mb-4">Capítulo {{ capitulo.ordem }}</h2>
    <p class="whitespace-pre-wrap">{{ capitulo.capitulo }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  capitulo: {
    ordem: number
    capitulo: string
  }
}>()
</script>
