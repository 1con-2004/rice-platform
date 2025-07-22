<template>
  <div class="homepage">

    <!-- Hero区域 -->
    <section class="hero-gradient min-h-screen relative overflow-hidden" style="padding-top: 60px;">
      <!-- 浮动装饰元素 -->
      <div v-for="i in 3" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <!-- 主标题区域 -->
        <div class="text-center pt-20 pb-16">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6">
              <i class="fas fa-seedling text-4xl text-white"></i>
            </div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 hero-text">
            智慧农业溯源系统
          </h1>
          <p class="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            从田间到餐桌，全程透明可追溯<br>
            让每一粒稻米都有自己的身份证
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-green-100">
            <span 
              v-for="feature in features" 
              :key="feature.text"
              class="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full"
            >
              <i :class="feature.icon"></i>
              {{ feature.text }}
            </span>
          </div>
        </div>

        <!-- 系统数据统计 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <StatsCard 
            v-for="stat in stats" 
            :key="stat.label"
            :number="stat.number"
            :label="stat.label"
          />
        </div>

        <!-- 用户角色选择 -->
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">选择您的身份</h2>
          <p class="text-green-100 mb-12 text-lg">不同角色，专属体验</p>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <RoleButton
              v-for="role in roles"
              :key="role.name"
              :icon="role.icon"
              :label="role.label"
              :variant="role.variant"
              @click="navigateToRole(role.route)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 系统特色功能 -->
    <FeatureSection />

    <!-- 系统工作流程 -->
    <WorkflowSection />

    <!-- 联系我们 -->
    <ContactSection />

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-6 text-center">
        <div class="flex items-center justify-center mb-4">
          <i class="fas fa-seedling text-2xl text-green-500 mr-3"></i>
          <span class="text-xl font-bold">智慧农业溯源系统</span>
        </div>
        <p class="text-gray-400 mb-4">科技赋能农业，让每一粒稻米都有身份证</p>
        <div class="text-sm text-gray-500">
          <p>© 2024 智慧农业科技有限公司 版权所有</p>
          <p>技术支持：农业大数据平台</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatsCard from '@/components/homepage/StatsCard.vue'
import RoleButton from '@/components/homepage/RoleButton.vue'
import FeatureSection from '@/components/homepage/FeatureSection.vue'
import WorkflowSection from '@/components/homepage/WorkflowSection.vue'
import ContactSection from '@/components/homepage/ContactSection.vue'

const router = useRouter()

// 功能特色
const features = ref([
  { icon: 'fas fa-shield-alt', text: '安全可信' },
  { icon: 'fas fa-eye', text: '全程透明' },
  { icon: 'fas fa-users', text: '多方协作' },
  { icon: 'fas fa-mobile-alt', text: '一键溯源' }
])

// 统计数据
const stats = ref([
  { number: '1000+', label: '注册农户' },
  { number: '5000+', label: '溯源作物' },
  { number: '50000+', label: '用户查询' },
  { number: '99.9%', label: '数据准确率' }
])

// 角色选择
const roles = ref([
  { 
    name: 'buyer', 
    label: '我是买家', 
    icon: 'fas fa-shopping-cart', 
    variant: 'buyer' as const,
    route: '/buyer/home'
  },
  { 
    name: 'farmer', 
    label: '我是农民', 
    icon: 'fas fa-user-friends', 
    variant: 'farmer' as const,
    route: '/farmer/login'
  },
  { 
    name: 'admin', 
    label: '我是管理员', 
    icon: 'fas fa-cog', 
    variant: 'admin' as const,
    route: '/admin/login'
  }
])

// 浮动元素样式
const getFloatingStyle = (index: number) => {
  const configs = [
    { width: '80px', height: '80px', top: '10%', left: '10%', animationDelay: '0s' },
    { width: '120px', height: '120px', top: '20%', right: '15%', animationDelay: '2s' },
    { width: '60px', height: '60px', bottom: '30%', left: '15%', animationDelay: '4s' }
  ]
  return configs[index - 1]
}

// 导航到角色页面
const navigateToRole = (route: string) => {
  router.push(route)
}

// 滚动动画
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        target.style.opacity = '1'
        target.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)

  // 延迟执行，确保DOM已渲染
  setTimeout(() => {
    // 为卡片添加动画
    document.querySelectorAll('.feature-card').forEach(card => {
      const element = card as HTMLElement
      element.style.opacity = '0'
      element.style.transform = 'translateY(30px)'
      element.style.transition = 'all 0.6s ease'
      observer.observe(element)
    })
  }, 100)
})
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #059669 0%, #16a34a 50%, #22c55e 100%);
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .pt-20 {
    padding-top: 3rem;
  }
}
</style>