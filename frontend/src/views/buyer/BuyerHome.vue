<template>
  <div class="buyer-home">
    <!-- Hero Section with Carousel -->
    <div class="hero-section">
      <div 
        class="carousel-container"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div 
          v-for="(slide, index) in heroSlides" 
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
          :style="{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${slide.image})`,
            transform: `translateX(${(index - currentSlide) * 100}%)` 
          }"
        >
          <div class="slide-content">
            <h1 class="slide-title">
              <i class="fas fa-seedling mr-2"></i>
              智慧农业溯源
            </h1>
            <p class="slide-subtitle">{{ slide.subtitle }}</p>
          </div>
        </div>
        
        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <div 
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="carousel-dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Search Bar -->
      <div class="search-bar">
        <i class="fas fa-search text-gray-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input" 
          placeholder="搜索作物类型、农场名称..." 
          @input="handleSearch"
        >
        <i 
          v-if="searchQuery" 
          class="fas fa-times text-gray-400 cursor-pointer" 
          @click="clearSearch"
        ></i>
        <i v-else class="fas fa-filter text-gray-400"></i>
      </div>

      <!-- Category Tabs -->
      <div class="category-section mb-6">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-tab"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Hot Crops Section -->
      <div class="crops-section mb-6">
        <div class="section-header">
          <h3 class="section-title">热门作物</h3>
          <span class="section-subtitle">实时更新</span>
        </div>

        <!-- Crop Cards -->
        <div class="crop-cards">
          <div 
            v-for="crop in filteredCrops"
            :key="crop.id"
            class="crop-card"
            @click="openCropDetail(crop.id)"
          >
            <div class="crop-image-container">
              <img 
                :src="crop.image" 
                :alt="crop.title" 
                class="crop-image"
                @error="handleImageError"
              >
              <div class="crop-status">
                <span 
                  class="status-badge"
                  :class="getStatusClass(crop.status)"
                >
                  {{ getStatusText(crop.status) }}
                </span>
              </div>
              <div class="crop-views">
                <i class="fas fa-eye mr-1"></i>
                {{ formatViews(crop.views) }} 关注
              </div>
            </div>
            
            <div class="crop-info">
              <h4 class="crop-title">{{ crop.title }}</h4>
              <div class="crop-meta">
                <div class="crop-location">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  <span>{{ crop.location }}</span>
                </div>
                <div class="crop-day">第{{ crop.day }}天</div>
              </div>
              <p class="crop-description">{{ crop.description }}</p>
              <div class="crop-footer">
                <div class="crop-records">
                  <i class="fas fa-camera mr-1"></i>
                  <span>{{ crop.records }}条记录</span>
                </div>
                <div class="crop-update">{{ crop.lastUpdate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="load-more-section">
        <BaseButton
          label="查看更多作物"
          variant="primary"
          size="large"
          icon="fas fa-chevron-down"
          :loading="loadingMore"
          @click="loadMore"
        />
      </div>

      <!-- Registration Prompt -->
      <div class="registration-prompt">
        <div class="prompt-icon">
          <i class="fas fa-star"></i>
        </div>
        <h3 class="prompt-title">喜欢某个作物？</h3>
        <p class="prompt-description">注册后可以关注农田，接收收获提醒</p>
      </div>
    </div>

    <!-- Floating Register Button -->
    <button class="floating-register" @click="showRegister">
      <i class="fas fa-gift mr-2"></i>
      可选注册
    </button>

    <!-- Footer -->
    <div class="footer">
      <h4 class="footer-title">智慧农业溯源平台</h4>
      <p class="footer-subtitle">让农产品的每一天都可追溯</p>
      <div class="footer-info">
        <p>无需注册即可查看 | 真实农田记录 | 24小时更新</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

// Carousel state
const currentSlide = ref(0)
const autoPlayInterval = ref<number | null>(null)

// Touch gesture state
const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

// Search state
const searchQuery = ref('')

// Hero slides data
const heroSlides = ref([
  {
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=300&fit=crop',
    subtitle: '新鲜稻米，从田间到餐桌'
  },
  {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=300&fit=crop',
    subtitle: '优质小麦，传统工艺'
  },
  {
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=300&fit=crop',
    subtitle: '甜美玉米，有机种植'
  }
])

// Categories data
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'rice', name: '水稻' },
  { id: 'wheat', name: '小麦' },
  { id: 'corn', name: '玉米' },
  { id: 'vegetable', name: '蔬菜' },
  { id: 'fruit', name: '果树' }
])

const activeCategory = ref('all')

// Crops data
const crops = ref([
  {
    id: 1,
    title: '张大爷的优质水稻',
    category: 'rice',
    location: '江苏省扬州市',
    day: 89,
    status: 'growing',
    description: '绿色种植，不使用化学农药，记录完整的生长过程',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=180&fit=crop',
    views: 1200,
    records: 12,
    lastUpdate: '2小时前更新'
  },
  {
    id: 2,
    title: '李农户的黄金小麦',
    category: 'wheat',
    location: '山东省济南市',
    day: 156,
    status: 'harvesting',
    description: '传统种植工艺，即将进入收获季，颗粒饱满',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=180&fit=crop',
    views: 856,
    records: 28,
    lastUpdate: '5小时前更新'
  },
  {
    id: 3,
    title: '王大叔的甜玉米',
    category: 'corn',
    location: '河北省保定市',
    day: 67,
    status: 'growing',
    description: '有机种植，预计8月收获，口感甜美',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=180&fit=crop',
    views: 632,
    records: 15,
    lastUpdate: '1天前更新'
  },
  {
    id: 4,
    title: '陈阿姨的有机青菜',
    category: 'vegetable',
    location: '浙江省杭州市',
    day: 45,
    status: 'completed',
    description: '45天生长周期，全程记录，新鲜上市',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=180&fit=crop',
    views: 445,
    records: 18,
    lastUpdate: '3天前收获'
  }
])

const loadingMore = ref(false)

// Computed properties
const filteredCrops = computed(() => {
  let filtered = crops.value
  
  // Filter by category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(crop => crop.category === activeCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(crop => 
      crop.title.toLowerCase().includes(query) ||
      crop.location.toLowerCase().includes(query) ||
      crop.description.toLowerCase().includes(query) ||
      categories.value.find(cat => cat.id === crop.category)?.name.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Methods
const goToSlide = (index: number) => {
  currentSlide.value = index
  stopAutoPlay()
  setTimeout(startAutoPlay, 3000)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval.value = setInterval(nextSlide, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const selectCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    growing: 'status-growing',
    harvesting: 'status-harvesting',
    completed: 'status-completed'
  }
  return statusClasses[status] || 'status-growing'
}

const getStatusText = (status: string) => {
  const statusTexts: Record<string, string> = {
    growing: '生长中',
    harvesting: '收获期',
    completed: '已收获'
  }
  return statusTexts[status] || '生长中'
}

const formatViews = (views: number) => {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k'
  }
  return views.toString()
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-crop.jpg'
}

// Touch gesture methods
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isDragging.value = false
  stopAutoPlay()
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) {
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.value)
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)
    
    // Only start dragging if horizontal movement is greater than vertical
    if (deltaX > deltaY && deltaX > 10) {
      isDragging.value = true
      e.preventDefault() // Prevent scrolling
    }
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) {
    setTimeout(startAutoPlay, 3000)
    return
  }
  
  touchEndX.value = e.changedTouches[0].clientX
  const deltaX = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50
  
  if (Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // Swipe left - next slide
      nextSlide()
    } else {
      // Swipe right - previous slide
      previousSlide()
    }
  }
  
  isDragging.value = false
  setTimeout(startAutoPlay, 3000)
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? heroSlides.value.length - 1 
    : currentSlide.value - 1
}

// Search methods
const handleSearch = () => {
  // Search is handled by the computed filteredCrops
}

const clearSearch = () => {
  searchQuery.value = ''
}

const openCropDetail = (cropId: number) => {
  router.push(`/buyer/crop/${cropId}`)
}

const loadMore = async () => {
  loadingMore.value = true
  // Simulate loading
  await new Promise(resolve => setTimeout(resolve, 2000))
  loadingMore.value = false
  alert('已为您加载更多作物！')
}

const showRegister = () => {
  alert('注册功能：这里可以注册账号，获得更多功能如关注、收藏等')
}

// Lifecycle
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.buyer-home {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #86efac, #4ade80, #22c55e, #16a34a);
  background-size: 400% 400%;
  animation: gradientShift 6s ease-in-out infinite;
  height: 300px;
  position: relative;
  overflow: hidden;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease-out;
}

.carousel-slide.active {
  transform: translateX(0) !important;
}

.slide-content {
  position: absolute;
  top: 24px;
  left: 24px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.slide-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.slide-subtitle {
  color: #dcfce7;
  font-size: 1.125rem;
}

.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  transition: background 0.3s ease;
  cursor: pointer;
}

.carousel-dot.active {
  background: white;
}

/* Main Content */
.main-content {
  padding: 0 24px;
}

/* Search Bar */
.search-bar {
  background: white;
  border-radius: 25px;
  padding: 12px 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin: 24px 0;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.search-bar:focus-within {
  border-color: #16a34a;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  margin-left: 12px;
  background: transparent;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-tab {
  padding: 8px 16px;
  border-radius: 20px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.category-tab.active {
  background: #16a34a;
  color: white;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Crop Cards */
.crop-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.crop-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.crop-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.15);
}

.crop-image-container {
  position: relative;
}

.crop-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.crop-card:hover .crop-image {
  transform: scale(1.05);
}

.crop-status {
  position: absolute;
  top: 12px;
  left: 12px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status-growing {
  background: #dcfce7;
  color: #16a34a;
}

.status-harvesting {
  background: #fed7aa;
  color: #ea580c;
}

.status-completed {
  background: #e0e7ff;
  color: #4338ca;
}

.crop-views {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.crop-info {
  padding: 16px;
}

.crop-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
}

.crop-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.crop-location {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.crop-day {
  font-size: 0.875rem;
  color: #6b7280;
}

.crop-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.crop-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.crop-records {
  display: flex;
  align-items: center;
  color: #16a34a;
  font-size: 0.875rem;
}

.crop-update {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Load More Section */
.load-more-section {
  text-align: center;
  margin: 32px 0;
}

/* Registration Prompt */
.registration-prompt {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  margin: 32px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.prompt-icon {
  width: 64px;
  height: 64px;
  background: #fef3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.prompt-icon i {
  font-size: 1.5rem;
  color: #d97706;
}

.prompt-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.prompt-description {
  color: #6b7280;
  margin-bottom: 16px;
}

/* Floating Register Button */
.floating-register {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  font-size: 14px;
  z-index: 1000;
  animation: pulse 2s infinite;
  cursor: pointer;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Footer */
.footer {
  background: #1f2937;
  color: white;
  padding: 32px 24px;
  text-align: center;
  margin-top: 32px;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.footer-subtitle {
  color: #d1d5db;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.footer-info {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 640px) {
  .slide-title {
    font-size: 1.25rem;
  }
  
  .slide-subtitle {
    font-size: 1rem;
  }
  
  .main-content {
    padding: 0 16px;
  }
  
  .crop-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}</style>