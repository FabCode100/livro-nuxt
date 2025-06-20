<template>
  <div v-if="isMounted">
    <audio ref="audio" :src="src" loop />
    
    <!-- Botão no canto superior direito -->
    <button @click="toggleAudio" class="audio-button" aria-label="Alternar música">
      <span v-if="isPlaying">🔊</span>
      <span v-else>🔇</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMounted = ref(false)
const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const src = '/audio/ambient.mp3'

onMounted(() => {
  isMounted.value = true

  const playAudio = () => {
    if (audio.value) {
      audio.value.volume = 0.4
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch(err => {
        console.warn('Erro ao tocar som:', err)
      })
    }
    document.removeEventListener('click', playAudio)
  }

  document.addEventListener('click', playAudio)
})

const toggleAudio = () => {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play()
    isPlaying.value = true
  }
}
</script>

<style scoped>
.audio-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  z-index: 1000;
}

.audio-button:hover {
  opacity: 0.8;
}
</style>
