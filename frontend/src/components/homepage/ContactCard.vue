<template>
  <div class="contact-card">
    <div :class="['w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', iconColor]">
      <i :class="[icon, 'text-2xl text-white']"></i>
    </div>
    <h3 class="text-xl font-bold mb-2">{{ title }}</h3>
    <p class="text-gray-300">{{ mainText }}</p>
    <p class="text-sm text-gray-400">{{ subText }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  iconColor: string
  title: string
  mainText: string
  subText: string
}

defineProps<Props>()
</script>

<style scoped>
.contact-card {
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
}
</style>