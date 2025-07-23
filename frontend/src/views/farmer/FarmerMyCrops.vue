<template>
  <div class="farmer-my-crops">

    <!-- 顶部导航栏 -->
    <TopNav 
      title="我的作物生长记录"
      :show-back="false"
    >
      
    </TopNav>

    <!-- 作物概览卡片 -->
    <div class="p-6">
      <div class="card bg-gradient-to-r from-green-400 to-green-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-white text-2xl font-bold mb-2">我的水稻田</h2>
            <p class="text-green-100 text-lg">种植第 89 天</p>
            <p class="text-green-100">已发布 12 条生长记录</p>
          </div>
          <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-leaf text-3xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间线内容区域 -->
    <div class="px-6 pb-24">
      <div class="timeline-header">
        <BaseButton 
          @click="toggleSort"
          :label="sortText"
          variant="primary"
          size="xl"
          :icon="sortIcon"
          class="sort-btn-mobile"
        />
      </div>

      <!-- 时间线项目 -->
      <div class="timeline">
        <TimelineItem
          :date="new Date('2024-07-22')"
          title="生长记录"
          description="水稻长势很好，叶子绿油油的。今天浇了水，施了肥。"
          image="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop"
          :tags="['浇水', '施肥', '生长记录']"
          @image-click="handleImageClick"
        />

        <TimelineItem
          :date="new Date('2024-07-21')"
          title="除草"
          description="今天把田里的杂草都清理干净了，水稻可以更好地吸收养分了。"
          image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop"
          :tags="['除草']"
          @image-click="handleImageClick"
        />

        <TimelineItem
          :date="new Date('2024-07-19')"
          title="生长记录"
          description="水稻抽穗了！今年的收成应该不错。"
          image="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=200&fit=crop"
          :tags="['生长记录']"
          @image-click="handleImageClick"
        />

        <TimelineItem
          :date="new Date('2024-04-24')"
          title="播种开始"
          description="今天开始播种水稻，希望今年有个好收成！"
          image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop"
          :tags="['播种']"
          @image-click="handleImageClick"
        />
      </div>

      <!-- 加载更多 -->
      <div class="load-more-container">
        <BaseButton
          @click="loadMore"
          label="查看更早的记录"
          variant="secondary"
          icon="fas fa-chevron-down"
          :loading="loadingMore"
          class="load-more-btn"
        />
      </div>
    </div>

    <!-- 底部导航栏 -->
    <BottomNav :items="navItems" />

    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/common/BottomNav.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TimelineItem from '@/components/common/TimelineItem.vue'

const router = useRouter()

// 响应式数据
const showMenuModal = ref(false)
const loadingMore = ref(false)
const isAscending = ref(true)

// 计算属性
const sortText = computed(() => isAscending.value ? '升序查看' : '倒序查看')
const sortIcon = computed(() => isAscending.value ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up')

// 底部导航配置 - FarmerMyCrops页面应该高亮"我的作物"
const navItems = [
  { 
    name: 'FarmerMyCrops', 
    label: '我的作物', 
    icon: 'fas fa-leaf', 
    route: 'FarmerMyCrops',
    active: true  // FarmerMyCrops页面高亮"我的作物"
  },
  { 
    name: 'FarmerPublish', 
    label: '发布', 
    icon: 'fas fa-plus', 
    route: 'FarmerPublish' 
  },
  { 
    name: 'FarmerMessages', 
    label: '消息', 
    icon: 'fas fa-comments', 
    route: 'FarmerMessages'
  }
]


// 关闭菜单
const closeMenu = () => {
  showMenuModal.value = false
}

// 加载更多
const loadMore = () => {
  loadingMore.value = true
  
  // 模拟加载
  setTimeout(() => {
    loadingMore.value = false
  }, 2000)
}

// 切换排序
const toggleSort = () => {
  isAscending.value = !isAscending.value
  const text = isAscending.value ? '已切换为升序排列' : '已切换为倒序排列'
  
  // 显示提示信息
  showToast(text)
}

// 显示提示信息
const showToast = (message: string) => {
  // 这里可以集成全局提示组件，暂时使用简单的提示
  const toast = document.createElement('div')
  toast.textContent = message
  toast.className = 'toast-message'
  document.body.appendChild(toast)
  
  // 3秒后移除
  setTimeout(() => {
    document.body.removeChild(toast)
  }, 3000)
}

// 图片点击处理
const handleImageClick = () => {
}

// 页面初始化
onMounted(() => {
})
</script>

<style scoped>
.farmer-my-crops {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f9f0, #e8f5e8);
  padding-bottom: 5rem;
}

/* 卡片样式 */
.card {
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* 时间线样式 */
.timeline {
  position: relative;
}

/* 顶部导航栏样式 */
:deep(.top-nav) {
  background: linear-gradient(135deg, #16a34a, #059669);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 底部导航栏样式 */
:deep(.bottom-nav) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 0;
  z-index: 40;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.bottom-nav .nav-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  min-width: 60px;
}

:deep(.bottom-nav .nav-item.active) {
  color: #16a34a;
}

:deep(.bottom-nav .nav-item:hover) {
  color: #16a34a;
}

:deep(.bottom-nav .nav-icon) {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

:deep(.bottom-nav .nav-item span) {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 标题样式 */
.title-elderly {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
}

/* 加载更多按钮容器强制居中 */
.load-more-container {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  margin: 2rem 0 !important;
}

/* 加载更多按钮样式 - 灵动感和呼吸感 */
:deep(.load-more-btn) {
  background: linear-gradient(135deg, #10b981, #059669, #047857);
  background-size: 200% 200%;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  box-shadow: 
    0 8px 25px rgba(16, 185, 129, 0.3),
    0 4px 15px rgba(16, 185, 129, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: breathe 3s ease-in-out infinite, gradientShift 6s ease infinite;
  position: relative;
  overflow: hidden;
  margin: 0 auto !important;
  display: flex !important;
  width: auto !important;
  min-width: auto !important;
}

:deep(.load-more-btn:hover) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 12px 35px rgba(16, 185, 129, 0.4),
    0 6px 20px rgba(16, 185, 129, 0.3);
  background-position: 100% 0;
}

:deep(.load-more-btn:active) {
  transform: translateY(-1px) scale(1.02);
}

:deep(.load-more-btn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

:deep(.load-more-btn:hover::before) {
  left: 100%;
}

/* 呼吸动画 */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* 渐变背景动画 */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 时间线标题行样式 - 强制同行显示 */
.timeline-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 1.5rem !important;
  width: 100% !important;
  gap: 1rem !important;
  flex-wrap: nowrap !important;
}

.timeline-header h3 {
  margin: 0 !important;
  flex: 1 !important;
}

/* 移动端优化的排序按钮样式 */
.timeline-header :deep(.sort-btn-mobile) {
  margin: 0 !important;
  padding: 1rem 1.5rem !important;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  min-width: 120px !important;
  min-height: 60px !important;
  width: auto !important;
  height: auto !important;
  flex-shrink: 0 !important;
  align-self: center !important;
  display: inline-flex !important;
  border-radius: 1rem !important;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25) !important;
  transition: all 0.2s ease !important;
}

.timeline-header :deep(.sort-btn-mobile:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(22, 163, 74, 0.35) !important;
}

.timeline-header :deep(.sort-btn-mobile:active) {
  transform: translateY(0) !important;
}

/* 强制覆盖BaseButton的所有可能样式 */
.timeline-header :deep(.sort-btn-mobile.btn-large),
.timeline-header :deep(.sort-btn-mobile.btn-xl),
.timeline-header :deep(.sort-btn-mobile.btn-primary) {
  margin: 0 !important;
  padding: 1rem 1.5rem !important;
  font-size: 1.125rem !important;
  min-width: 120px !important;
  min-height: 60px !important;
}

/* 彻底重置按钮的所有可能影响布局的样式 */
.timeline-header :deep(button) {
  margin: 0 !important;
  float: none !important;
  position: static !important;
  transform: none !important;
  vertical-align: middle !important;
}

/* 确保容器没有被其他样式影响 */
.timeline-header {
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

/* 彻底覆盖CSS变量对按钮的影响 */
.timeline-header :deep(.sort-btn-mobile) {
  --button-spacing: 0px !important;
  --button-min-size: 60px !important;
}

/* 强制内联样式级别的覆盖 */
.timeline-header :deep(.sort-btn-mobile) {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

/* 弹窗提示样式 */
.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  z-index: 9999;
  animation: toastFadeIn 0.3s ease-out;
}

@keyframes toastFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 移动端响应式设计 */
@media (max-width: 768px) {
  .title-elderly {
    font-size: 1.25rem;
  }
  
  .timeline-header {
    justify-content: center !important;
    margin-bottom: 2rem !important;
  }
  
  .timeline-header :deep(.sort-btn-mobile) {
    min-width: 140px !important;
    min-height: 65px !important;
    padding: 1.25rem 2rem !important;
    font-size: 1.25rem !important;
    border-radius: 1.25rem !important;
    box-shadow: 0 6px 20px rgba(22, 163, 74, 0.3) !important;
  }
  
  .timeline-header :deep(.sort-btn-mobile:hover) {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4) !important;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .timeline-header :deep(.sort-btn-mobile) {
    min-width: 160px !important;
    min-height: 70px !important;
    padding: 1.5rem 2.5rem !important;
    font-size: 1.375rem !important;
    font-weight: 700 !important;
  }
}
</style>