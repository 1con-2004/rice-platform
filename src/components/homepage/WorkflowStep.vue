<template>
  <div class="flow-step">
    <div :class="['w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', bgColorClass]">
      <i :class="[icon, 'text-xl', iconColor]"></i>
    </div>
    <h3 class="font-bold text-gray-800 mb-2">{{ stepNumber }}. {{ title }}</h3>
    <p class="text-gray-600 text-sm">{{ description }}</p>
    <div v-if="showArrow" class="flow-arrow hidden md:block">
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  iconColor: string
  title: string
  description: string
  stepNumber: number
  showArrow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showArrow: false
})

const bgColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    'text-green-600': 'bg-green-100',
    'text-blue-600': 'bg-blue-100',
    'text-purple-600': 'bg-purple-100',
    'text-yellow-600': 'bg-yellow-100'
  }
  return colorMap[props.iconColor] || 'bg-gray-100'
})
</script>

<style scoped>
.flow-step {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.flow-arrow {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #059669;
  z-index: 10;
}
</style>