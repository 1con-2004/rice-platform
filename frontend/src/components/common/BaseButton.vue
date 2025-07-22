<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
    <i v-else-if="icon" :class="[icon, 'mr-2']"></i>
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'warning' | 'admin'
  size?: 'normal' | 'large' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'normal',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn-large']
  
  // 变体样式
  switch (props.variant) {
    case 'primary':
      classes.push('btn-primary')
      break
    case 'secondary':
      classes.push('btn-secondary')
      break
    case 'warning':
      classes.push('btn-warning')
      break
    case 'admin':
      classes.push('admin-btn')
      break
  }
  
  // 尺寸样式
  if (props.size === 'xl') {
    classes.push('btn-xl')
  }
  
  // 状态样式
  if (props.disabled || props.loading) {
    classes.push('disabled')
  }
  
  return classes
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.admin-btn {
  background: linear-gradient(135deg, var(--admin-primary), var(--admin-secondary));
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  min-width: var(--button-min-size);
  min-height: var(--button-min-size);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.admin-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
}

.admin-btn:active:not(.disabled) {
  transform: translateY(0);
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>