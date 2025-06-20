<template>
  <section
    class="mt-10 max-w-xl bg-[#1e1e2f]/90 p-8 rounded-2xl shadow-2xl text-sky-100 whitespace-pre-wrap drop-shadow-md"
    role="region"
    aria-live="polite"
  >
    <h2 class="text-3xl font-bold mb-6 text-indigo-300">Capítulo Gerado:</h2>
    <p>{{ capitulo }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{ capitulo: string }>()
</script>
