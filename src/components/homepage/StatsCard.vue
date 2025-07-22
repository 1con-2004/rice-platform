<template>
  <div class="feature-card p-6 text-center">
    <div class="stats-number">{{ displayNumber }}</div>
    <p class="text-gray-600 font-medium">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  number: string
  label: string
}

const props = defineProps<Props>()
const displayNumber = ref('0')

// 数字动画
const animateNumber = () => {
  const target = parseInt(props.number.replace(/[^\d]/g, ''))
  const suffix = props.number.replace(/[\d]/g, '')
  let current = 0
  const increment = target / 50
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    displayNumber.value = Math.floor(current) + suffix
  }, 50)
}

onMounted(() => {
  // 延迟开始动画
  setTimeout(animateNumber, 500)
})
</script>

<style scoped>
.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stats-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #059669;
}
</style>