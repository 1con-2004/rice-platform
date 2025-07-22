<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" :class="sizeClass" @click.stop>
        <div v-if="showHeader" class="modal-header">
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <button v-if="closable" class="modal-close" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div v-if="showFooter" class="modal-footer">
          <slot name="footer">
            <BaseButton 
              v-if="showCancel"
              label="取消" 
              variant="secondary" 
              @click="cancel"
            />
            <BaseButton 
              v-if="showConfirm"
              :label="confirmText" 
              variant="primary" 
              :loading="loading"
              @click="confirm"
            />
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  visible: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  closable?: boolean
  showHeader?: boolean
  showFooter?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  confirmText?: string
  loading?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  closable: true,
  showHeader: true,
  showFooter: false,
  showCancel: true,
  showConfirm: true,
  confirmText: '确定',
  loading: false,
  closeOnOverlay: true
})

const emit = defineEmits<{
  'close': []
  'confirm': []
  'cancel': []
}>()

const sizeClass = computed(() => {
  return `modal-${props.size}`
})

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-container {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-realistic);
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
}

.modal-small {
  max-width: 400px;
}

.modal-medium {
  max-width: 600px;
}

.modal-large {
  max-width: 900px;
}

.modal-full {
  max-width: 95vw;
  max-height: 95vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: var(--text-title);
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-gray);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--background-soft);
  color: var(--text-dark);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid var(--border-light);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .modal-container {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
  }
  
  .modal-overlay {
    padding: 0;
  }
}
</style>