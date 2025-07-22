<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">系统特色功能</h2>
        <p class="text-xl text-gray-600">科技赋能农业，让溯源更简单</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :icon-color="feature.iconColor"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FeatureCard from './FeatureCard.vue'

const features = ref([
  {
    icon: 'fas fa-qrcode',
    iconColor: 'text-blue-600',
    title: '一键扫码溯源',
    description: '扫描二维码即可查看农产品完整生长过程，从种植到收获全程记录'
  },
  {
    icon: 'fas fa-timeline',
    iconColor: 'text-green-600',
    title: '时间线可视化',
    description: '直观的时间线展示，清晰呈现农作物每个生长阶段的详细信息'
  },
  {
    icon: 'fas fa-comments',
    iconColor: 'text-purple-600',
    title: '社交互动功能',
    description: '农民与消费者直接沟通，分享种植心得，增进信任关系'
  },
  {
    icon: 'fas fa-shield-alt',
    iconColor: 'text-red-600',
    title: '区块链保障',
    description: '采用区块链技术确保数据不可篡改，保证溯源信息真实可靠'
  },
  {
    icon: 'fas fa-mobile-alt',
    iconColor: 'text-yellow-600',
    title: '适老化设计',
    description: '大字体、简单操作，让年长的农民也能轻松使用系统记录信息'
  },
  {
    icon: 'fas fa-chart-bar',
    iconColor: 'text-indigo-600',
    title: '数据分析',
    description: '智能数据分析，为农业生产提供科学指导，提高产量和品质'
  }
])
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>