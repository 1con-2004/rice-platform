<template>
  <div v-if="visible" :class="['loading-overlay', { show: visible }]">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...'
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.show {
  opacity: 1;
  visibility: visible;
}

.loading-content {
  background: white;
  border-radius: var(--border-radius);
  padding: 32px;
  text-align: center;
  box-shadow: var(--shadow-realistic);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-text {
  color: var(--text-gray);
  font-weight: 500;
  margin: 0;
  font-size: var(--text-large);
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}
</style>