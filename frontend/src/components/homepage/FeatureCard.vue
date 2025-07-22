<template>
  <div class="feature-card p-8 text-center">
    <div :class="['w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6', bgColorClass]">
      <i :class="[icon, 'text-2xl', iconColor]"></i>
    </div>
    <h3 class="text-xl font-bold text-gray-800 mb-4">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  iconColor: string
  title: string
  description: string
}

const props = defineProps<Props>()

const bgColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    'text-blue-600': 'bg-blue-100',
    'text-green-600': 'bg-green-100',
    'text-purple-600': 'bg-purple-100',
    'text-red-600': 'bg-red-100',
    'text-yellow-600': 'bg-yellow-100',
    'text-indigo-600': 'bg-indigo-100'
  }
  return colorMap[props.iconColor] || 'bg-gray-100'
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
</style>