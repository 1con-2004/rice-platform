<template>
  <div class="prototype-frame">
    <div class="frame-header">
      <span class="frame-route">{{ route }}</span>
      <button class="frame-button" @click="navigateToRoute">
        <i class="fas fa-external-link-alt"></i>
      </button>
    </div>
    <div class="frame-preview">
      <div class="preview-placeholder">
        <i class="fas fa-mobile-alt text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500">点击按钮查看完整页面</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  route: string
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToRoute = () => {
  router.push(props.route)
}
</script>

<style scoped>
.prototype-frame {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.frame-header {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frame-route {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.frame-button {
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.frame-button:hover {
  background: var(--secondary-green);
}

.frame-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  text-align: center;
  padding: 40px 20px;
}
</style>