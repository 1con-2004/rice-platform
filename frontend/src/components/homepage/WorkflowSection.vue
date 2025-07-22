<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">系统工作流程</h2>
        <p class="text-xl text-gray-600">简单四步，实现全程溯源</p>
      </div>

      <div class="system-flow">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <WorkflowStep
            v-for="(step, index) in steps"
            :key="step.title"
            :icon="step.icon"
            :icon-color="step.iconColor"
            :title="step.title"
            :description="step.description"
            :step-number="index + 1"
            :show-arrow="index < steps.length - 1"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WorkflowStep from './WorkflowStep.vue'

const steps = ref([
  {
    icon: 'fas fa-seedling',
    iconColor: 'text-green-600',
    title: '种植记录',
    description: '农民记录种植信息，包括品种、时间、地点等'
  },
  {
    icon: 'fas fa-camera',
    iconColor: 'text-blue-600',
    title: '过程跟踪',
    description: '定期上传生长照片和护理记录'
  },
  {
    icon: 'fas fa-qrcode',
    iconColor: 'text-purple-600',
    title: '生成码标',
    description: '系统自动生成溯源二维码'
  },
  {
    icon: 'fas fa-search',
    iconColor: 'text-yellow-600',
    title: '消费者查询',
    description: '扫码查看完整溯源信息'
  }
])
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.system-flow {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
</style>