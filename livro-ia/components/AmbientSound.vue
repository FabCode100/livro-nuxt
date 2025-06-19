<template>
    <button
      v-if="isClient"
      class="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition"
      @click="toggleAudio"
      :aria-label="isPlaying ? 'Parar som ambiente' : 'Tocar som ambiente'"
    >
      <span v-if="isPlaying">🔇</span>
      <span v-else>🔈</span>
    </button>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const isPlaying = ref(false)
  const isClient = ref(false)
  let audio: HTMLAudioElement | null = null
  
  onMounted(() => {
    isClient.value = true
    audio = new Audio('/audio/ambiente.mp3')
    audio.loop = true
    audio.volume = 0.3
  })
  
  function toggleAudio() {
    if (!audio) return
  
    if (isPlaying.value) {
      audio.pause()
    } else {
      audio.play()
    }
    isPlaying.value = !isPlaying.value
  }
  
  onBeforeUnmount(() => {
    if (audio) {
      audio.pause()
      audio = null
    }
    isPlaying.value = false
  })
  </script>
  