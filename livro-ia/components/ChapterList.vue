<template>
  <div class="space-y-6">
    <div
      v-for="cap in capitulos"
      :key="cap._id"
      class="p-5 bg-[#1e1e2f] rounded-xl shadow text-sky-100"
    >
      <h3 class="text-lg font-semibold mb-2">Capítulo {{ cap.ordem }}</h3>
      <p class="whitespace-pre-line text-sm">{{ cap.capitulo.slice(0, 200) }}...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  capitulos: { _id: string; capitulo: string; ordem: number }[]
}>()
</script>
