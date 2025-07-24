<template>
  <div class="homepage">

    <!-- Hero区域 -->
    <section class="hero-gradient min-h-screen relative overflow-hidden" style="padding-top: 20px;">
      <!-- 浮动装饰元素 -->
      <div v-for="i in 3" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <!-- 主标题区域 -->
        <div class="text-center pt-8 pb-16">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6">
              <i class="fas fa-seedling text-4xl text-white"></i>
            </div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6 hero-text animated-title">
            智慧农业溯源系统
          </h1>
          <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animated-subtitle">
            从田间到餐桌，全程透明可追溯<br>
            让每一粒稻米都有自己的身份证
          </p>
        </div>

        <!-- 系统数据统计 -->
        <div class="flex flex-wrap justify-center gap-4 mb-20">
          <div 
            v-for="(stat, index) in stats" 
            :key="stat.label"
            :class="['stats-card', `stats-card-${index + 1}`]"
          >
            <div class="text-2xl font-bold mb-1">{{ stat.number }}</div>
            <div class="text-sm opacity-80">{{ stat.label }}</div>
          </div>
        </div>

        <!-- 用户角色选择 -->
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">选择您的身份</h2>
          <p class="text-green-100 mb-12 text-lg">不同角色，专属体验</p>
          
          <div class="flex flex-col items-center justify-center gap-4 px-4">
            <button
              v-for="role in roles"
              :key="role.name"
              :class="['role-btn', `role-btn-${role.variant}`]"
              @click="navigateToRole(role.route)"
            >
              <i :class="[role.icon, 'text-2xl mr-3']"></i>
              {{ role.label }}
            </button>
          </div>
        </div>
      </div>
    </section>


    <!-- 页脚 -->
    <footer class="footer-gradient text-white py-8">
      <div class="container mx-auto px-6 text-center">
        <div class="flex items-center justify-center mb-4">
          <i class="fas fa-seedling text-2xl text-green-200 mr-3"></i>
          <span class="text-xl font-bold text-white">智慧农业溯源系统</span>
        </div>
        <p class="text-green-100 mb-4">科技赋能农业，让每一粒稻米都有身份证</p>
        <div class="text-sm text-green-200">
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

const router = useRouter()


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
    label: '我是农户', 
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

.footer-gradient {
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

/* 标题动画效果 */
.animated-title {
  background: linear-gradient(45deg, #ffffff, #fef3c7, #fbbf24, #ffffff);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: breathing-title 4s ease-in-out infinite;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.animated-subtitle {
  background: linear-gradient(45deg, #ecfccb, #d9f99d, #bef264, #ecfccb);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: breathing-subtitle 5s ease-in-out infinite;
}

@keyframes breathing-title {
  0%, 100% { 
    background-position: 0% 50%;
    transform: scale(1);
  }
  50% { 
    background-position: 100% 50%;
    transform: scale(1.02);
  }
}

@keyframes breathing-subtitle {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}

/* 特色标签样式 */
.feature-badge {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  transition: all 0.3s ease;
}

.feature-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 统计卡片样式 - Apple风格 */
.stats-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 20px 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 140px;
  width: auto;
  white-space: nowrap;
  margin-bottom:10px;
  margin-left: 10%;
  margin-right:10%;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

.stats-card-1 {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
  color: #1e40af;
}

.stats-card-2 {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(110, 231, 183, 0.1));
  color: #065f46;
}

.stats-card-3 {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(252, 211, 77, 0.1));
  color: #92400e;
}

.stats-card-4 {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(196, 181, 253, 0.1));
  color: #5b21b6;
}

/* 角色按钮样式 */
.role-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 24px 48px;
  border-radius: 28px;
  border: none;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 300px;
  max-width: 90vw;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
}

.role-btn-buyer {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 197, 253, 0.6));
}

.role-btn-farmer {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(110, 231, 183, 0.6));
}

.role-btn-admin {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(196, 181, 253, 0.6));
}

.role-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
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
  
  .pt-8 {
    padding-top: 2rem;
  }
  
  .stats-card {
    padding: 16px 20px;
    min-width: 120px;
  }
  
  .role-btn {
    padding: 20px 36px;
    font-size: 18px;
    width: 280px;
    max-width: 85vw;
    border-radius: 24px;
  }
}
</style>