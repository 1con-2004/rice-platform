<template>
  <section class="prototype-section">
    <h2 :class="['section-title', color]">
      <i :class="[icon, 'mr-2']"></i>
      {{ title }}
    </h2>
    
    <div v-for="item in items" :key="item.label" class="prototype-item">
      <div class="prototype-label">{{ item.label }}</div>
      <div class="phone-frame">
        <div class="phone-screen">
          <PrototypeFrame :route="item.route" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PrototypeFrame from './PrototypeFrame.vue'

interface PrototypeItem {
  label: string
  route: string
}

interface Props {
  title: string
  icon: string
  color: string
  items: PrototypeItem[]
}

defineProps<Props>()
</script>

<style scoped>
.prototype-section {
  text-align: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}

.prototype-item {
  margin-bottom: 2rem;
}

.prototype-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.phone-frame {
  width: 393px;
  height: 852px;
  background: #000;
  border-radius: 47px;
  padding: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  margin: 0 auto;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 39px;
  overflow: hidden;
  background: #fff;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .phone-frame {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  
  .phone-screen {
    border-radius: 0;
  }
}
</style>