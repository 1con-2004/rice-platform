<template>
  <section class="py-20 bg-gray-800 text-white">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-4xl font-bold mb-4">联系我们</h2>
      <p class="text-xl text-gray-300 mb-12">有任何问题，随时联系我们的技术团队</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ContactCard
          v-for="contact in contacts"
          :key="contact.title"
          :icon="contact.icon"
          :icon-color="contact.iconColor"
          :title="contact.title"
          :main-text="contact.mainText"
          :sub-text="contact.subText"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContactCard from './ContactCard.vue'

const contacts = ref([
  {
    icon: 'fas fa-phone',
    iconColor: 'bg-green-600',
    title: '技术支持热线',
    mainText: '400-888-9999',
    subText: '7×24小时服务'
  },
  {
    icon: 'fas fa-envelope',
    iconColor: 'bg-blue-600',
    title: '邮箱支持',
    mainText: 'support@agritrack.com',
    subText: '24小时内回复'
  },
  {
    icon: 'fas fa-comments',
    iconColor: 'bg-purple-600',
    title: '在线客服',
    mainText: '智能AI助手',
    subText: '即时响应'
  }
])
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>