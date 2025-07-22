<template>
  <div class="top-nav">
    <button 
      v-if="showBack" 
      @click="goBack"
      class="nav-back-btn"
    >
      <i class="fas fa-arrow-left"></i>
    </button>
    
    <h1 class="nav-title">{{ title }}</h1>
    
    <div class="nav-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  showBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.nav-back-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.nav-back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: var(--text-large);
  font-weight: 600;
}

.nav-actions {
  min-width: 40px;
  display: flex;
  justify-content: flex-end;
}
</style>