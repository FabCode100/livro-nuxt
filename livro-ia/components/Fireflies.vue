<template>
    <canvas ref="canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-0"></canvas>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const canvas = ref<HTMLCanvasElement | null>(null)
  let ctx: CanvasRenderingContext2D | null = null
  let animationFrameId: number
  
  class Firefly {
    x: number
    y: number
    radius: number
    alpha: number
    deltaAlpha: number
    vx: number
    vy: number
  
    constructor(width: number, height: number) {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.radius = 1 + Math.random() * 2
      this.alpha = Math.random()
      this.deltaAlpha = 0.01 + Math.random() * 0.02
      this.vx = (Math.random() - 0.5) * 0.3
      this.vy = (Math.random() - 0.5) * 0.3
    }
  
    update(width: number, height: number) {
      this.x += this.vx
      this.y += this.vy
  
      if (this.x < 0 || this.x > width) this.vx = -this.vx
      if (this.y < 0 || this.y > height) this.vy = -this.vy
  
      this.alpha += this.deltaAlpha
      if (this.alpha >= 1 || this.alpha <= 0.1) this.deltaAlpha = -this.deltaAlpha
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath()
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 6,
      )
      gradient.addColorStop(0, `rgba(150, 180, 255, ${this.alpha})`) // azul clarinho
        gradient.addColorStop(0.7, `rgba(180, 150, 255, ${this.alpha * 0.5})`) // roxo suave no meio
    gradient.addColorStop(1, 'rgba(180, 150, 255, 0)') // desvanecer no final

      ctx.fillStyle = gradient
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  function setupCanvas() {
    if (!canvas.value) return
  
    ctx = canvas.value.getContext('2d')
    if (!ctx) return
  
    const fireflies: Firefly[] = []
    const firefliesCount = 40
  
    function resize() {
      if (!canvas.value) return
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
  
    for (let i = 0; i < firefliesCount; i++) {
      fireflies.push(new Firefly(canvas.value.width, canvas.value.height))
    }
  
    function animate() {
      if (!ctx || !canvas.value) return
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      fireflies.forEach(f => {
        f.update(canvas.value!.width, canvas.value!.height)
        f.draw(ctx!)
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    })
  }
  
  onMounted(() => {
    setupCanvas()
  })
  </script>
  
  <style scoped>
  canvas {
    z-index: 0;
  }
  </style>
    