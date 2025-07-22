<template>
  <div 
    :class="['role-button', variantClass]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <i :class="[icon, 'text-2xl']"></i>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  icon: string
  variant: 'buyer' | 'farmer' | 'admin'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'click': []
}>()

const variantClass = computed(() => {
  return `${props.variant}-button`
})

const handleClick = () => {
  emit('click')
}

const handleMouseEnter = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  target.style.transform = 'translateY(-5px) scale(1.05)'
}

const handleMouseLeave = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  target.style.transform = 'translateY(0) scale(1)'
}
</script>

<style scoped>
.role-button {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 50px;
  padding: 20px 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  min-width: 200px;
}

.role-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.buyer-button {
  border-color: #3b82f6;
  color: #3b82f6;
}

.buyer-button:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.farmer-button {
  border-color: #059669;
  color: #059669;
}

.farmer-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.admin-button {
  border-color: #7c3aed;
  color: #7c3aed;
}

.admin-button:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
}
</style>