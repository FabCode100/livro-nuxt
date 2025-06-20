<template>
  <div class="space-y-6">
    <div
      v-for="cap in capitulos"
      :key="cap._id"
      class="p-6 bg-[#1e1e2f] rounded-xl shadow text-sky-100"
    >
      <h3 class="text-lg font-semibold mb-4">Capítulo {{ cap.ordem }}</h3>
      <p class="whitespace-pre-wrap text-sm leading-relaxed">
        {{ cap.capitulo }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  capitulos: { _id: string; capitulo: string; ordem: number }[]
}>()
</script>
