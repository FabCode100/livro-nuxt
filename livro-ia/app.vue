<!-- app.vue -->
<template>
  <div>
    <Transition name="page" mode="out-in">
      <NuxtPage />
    </Transition>
  </div>
</template>

<style>
/* Transição suave entre páginas */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
