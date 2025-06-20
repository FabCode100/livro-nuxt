<template>
  <div class="grid gap-6 mt-10 w-full max-w-4xl">
    <div
      v-for="book in books"
      :key="book._id"
      class="p-6 bg-[#1e1e2f] rounded-xl shadow-md flex justify-between items-center"
    >
      <div>
        <h2 class="text-xl text-white font-bold">{{ book.titulo }}</h2>
        <p class="text-sm text-gray-400">Criado em: {{ new Date(book.criadoEm).toLocaleDateString() }}</p>
      </div>
      <NuxtLink
        :to="`/books/${book._id}`"
        class="text-sky-300 hover:underline"
      >
        Ver Capítulos →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ books: { _id: string; titulo: string; criadoEm: string }[] }>()
</script>
