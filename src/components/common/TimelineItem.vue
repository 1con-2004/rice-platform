<template>
  <div class="timeline-item">
    <div class="timeline-date">
      {{ formattedDate }}
    </div>
    <div class="timeline-content">
      <div class="timeline-header">
        <h3 v-if="title" class="timeline-title">{{ title }}</h3>
        <div v-if="tags.length" class="tag-group">
          <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      
      <img 
        v-if="image" 
        :src="image" 
        :alt="title || '作物图片'"
        class="timeline-image"
        @click="showImageModal"
      />
      
      <p v-if="description" class="timeline-description">{{ description }}</p>
      
      <div v-if="metadata" class="timeline-metadata">
        <slot name="metadata" :metadata="metadata"></slot>
      </div>
      
      <div v-if="actions" class="timeline-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  date: Date | string
  title?: string
  description?: string
  image?: string
  tags?: string[]
  metadata?: Record<string, any>
  actions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  actions: false
})

const emit = defineEmits<{
  'image-click': [image: string]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.date)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}/${day}`
})

const showImageModal = () => {
  if (props.image) {
    emit('image-click', props.image)
  }
}
</script>

<style scoped>
.timeline-header {
  margin-bottom: 12px;
}

.timeline-title {
  font-size: var(--text-large);
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 8px 0;
}

.timeline-description {
  color: var(--text-gray);
  line-height: 1.6;
  margin: 12px 0;
}

.timeline-image {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.timeline-image:hover {
  transform: scale(1.02);
}

.timeline-metadata {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.timeline-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 12px;
}
</style>