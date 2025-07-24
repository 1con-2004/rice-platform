<template>
  <div class="buyer-crop-detail">
    <!-- 头部图片区域 -->
    <div class="hero-image">
      <button 
        @click="goBack" 
        class="back-button"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
      
      <div class="hero-content">
        <div class="hero-main">
          <h1 class="hero-title">{{ cropData.title }}</h1>
          <div class="hero-info">
            <span class="info-item"><i class="fas fa-map-marker-alt"></i>{{ cropData.location }}</span>
            <span class="info-item"><i class="fas fa-calendar"></i>第{{ cropData.growthDay }}天</span>
          </div>
        </div>
        <div class="hero-followers">
          <div class="followers-count">{{ cropData.followers }}</div>
          <div class="followers-label">关注数</div>
        </div>
      </div>
    </div>

    <!-- 农户信息卡片 -->
    <div class="farmer-info">
      <div class="farmer-header">
        <div class="farmer-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="farmer-details">
          <h3 class="farmer-name">{{ farmerData.name }}</h3>
          <p class="farmer-certification">{{ farmerData.certification }} · 种植经验{{ farmerData.experience }}年</p>
        </div>
        <button class="follow-btn" :class="{ 'following': isFollowing }" @click="toggleFollow">
          {{ isFollowing ? '已关注' : '关注' }}
        </button>
      </div>
      
      <!-- 生长进度 -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">生长进度</span>
          <span class="progress-percentage">{{ cropData.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: cropData.progress + '%' }"></div>
        </div>
        <div class="progress-footer">
          <span class="progress-start">播种</span>
          <span class="progress-end">收获预计还需{{ cropData.daysToHarvest }}天</span>
        </div>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ cropData.recordCount }}</div>
          <div class="stat-label">生长记录</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ cropData.growthDay }}</div>
          <div class="stat-label">种植天数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ cropData.pesticideUse }}</div>
          <div class="stat-label">农药使用</div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="px-6">
      <!-- 查看模式切换 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800">生长轨迹</h3>
        <div class="view-mode-buttons">
          <BaseButton
            class="view-mode-btn"
            label="时间线"
            :variant="viewMode === 'timeline' ? 'primary' : 'secondary'"
            size="normal"
            @click="setViewMode('timeline')"
          />
          <BaseButton
            class="view-mode-btn"
            label="按日查看"
            :variant="viewMode === 'calendar' ? 'primary' : 'secondary'"
            size="normal"
            @click="setViewMode('calendar')"
          />
        </div>
      </div>

      <!-- 按日查看视图 -->
      <div v-if="viewMode === 'calendar'" class="calendar-view">
        <div class="day-selector">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-800">{{ currentMonth }}</h4>
            <div class="flex gap-2">
              <button 
                @click="previousMonth"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="nextMonth"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="day-grid">
            <div class="day-item">日</div>
            <div class="day-item">一</div>
            <div class="day-item">二</div>
            <div class="day-item">三</div>
            <div class="day-item">四</div>
            <div class="day-item">五</div>
            <div class="day-item">六</div>
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              :class="[
                'day-item',
                { 'has-record': day.hasRecord },
                { 'today': day.isToday }
              ]"
              @click="jumpToDay(day.date)"
            >
              {{ day.day }}
            </div>
          </div>
        </div>
      </div>

      <!-- 时间线视图 -->
      <div v-if="viewMode === 'timeline'" class="timeline-vertical pb-24">
        <TimelineItem
          v-for="record in timelineRecords"
          :key="record.id"
          :date="record.date"
          :title="record.title"
          :description="record.description"
          :image="record.image"
          :tags="record.tags"
          :metadata="record.metadata"
          @image-click="showImageModal"
        >
          <template #metadata="{ metadata }">
            <div class="timeline-metadata">
              <span class="metadata-time"><i class="fas fa-clock"></i>{{ metadata.time }}</span>
              <span class="metadata-temperature"><i class="fas fa-thermometer-half"></i>{{ metadata.temperature }}</span>
            </div>
          </template>
        </TimelineItem>

        <!-- 加载更多提示 -->
        <div class="load-more-section">
          <button class="load-more-btn" @click="loadMoreRecords">
            <i class="fas fa-chevron-up"></i>
            查看更早的记录
          </button>
        </div>
      </div>
    </div>



    <!-- 图片查看模态框 -->
    <BaseModal
      v-model:visible="showImageModalFlag"
      size="full"
      :show-header="false"
      :show-footer="false"
      :close-on-overlay="true"
    >
      <div class="flex items-center justify-center h-full">
        <img 
          :src="modalImageSrc" 
          alt="高清图片" 
          class="max-w-full max-h-full rounded-lg"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import TimelineItem from '@/components/common/TimelineItem.vue'

const router = useRouter()

// 响应式数据
const viewMode = ref<'timeline' | 'calendar'>('timeline')
const isFollowing = ref(false)
const showImageModalFlag = ref(false)
const modalImageSrc = ref('')
const currentDate = ref(new Date())

// 作物数据
const cropData = ref({
  title: '张大爷的优质水稻',
  location: '江苏省扬州市',
  growthDay: 89,
  followers: '1.2k',
  progress: 59,
  daysToHarvest: 62,
  recordCount: 12,
  pesticideUse: 0
})

// 农户数据
const farmerData = ref({
  name: '张大爷',
  certification: '认证农户',
  experience: 15
})

// 时间线记录数据
const timelineRecords = ref([
  {
    id: 1,
    date: new Date('2024-07-22'),
    title: '7月22日',
    description: '水稻长势很好，叶子绿油油的。今天浇了水，施了肥。天气晴朗，非常适合水稻生长。',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop',
    tags: ['浇水', '施肥', '生长记录'],
    metadata: {
      time: '上午 9:30',
      temperature: '28°C'
    }
  },
  {
    id: 2,
    date: new Date('2024-07-21'),
    title: '7月21日',
    description: '今天把田里的杂草都清理干净了，水稻可以更好地吸收养分了。除草工作比较辛苦，但是为了水稻的健康成长，值得。',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop',
    tags: ['除草'],
    metadata: {
      time: '下午 4:20',
      temperature: '31°C'
    }
  },
  {
    id: 3,
    date: new Date('2024-07-19'),
    title: '7月19日',
    description: '水稻抽穗了！这是水稻生长的重要阶段，意味着即将进入成熟期。今年的收成应该不错，穗子很饱满。',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=200&fit=crop',
    tags: ['生长记录', '抽穗期'],
    metadata: {
      time: '上午 8:15',
      temperature: '26°C'
    }
  },
  {
    id: 4,
    date: new Date('2024-04-24'),
    title: '4月24日',
    description: '今天开始播种水稻，希望今年有个好收成！选用的是优质的种子，经过精心挑选。天气条件很好，适合播种。',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop',
    tags: ['播种', '新开始'],
    metadata: {
      time: '上午 6:30',
      temperature: '18°C'
    }
  }
])

// 计算属性
const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  
  const days = []
  
  // 添加空白天数（月初）
  const firstDay = new Date(year, month, 1).getDay()
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: '', date: '', hasRecord: false, isToday: false })
  }
  
  // 添加实际天数
  const recordDays = [1, 5, 12, 16, 19, 21, 22] // 有记录的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = year === today.getFullYear() && 
                   month === today.getMonth() && 
                   i === today.getDate()
    days.push({
      day: i.toString(),
      date: `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`,
      hasRecord: recordDays.includes(i),
      isToday
    })
  }
  
  return days
})

// 方法
const goBack = () => {
  router.go(-1)
}

const setViewMode = (mode: 'timeline' | 'calendar') => {
  viewMode.value = mode
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  const message = isFollowing.value ? '关注成功！注册后可以收到农户的最新动态' : '已取消关注'
  alert(message)
}


const showImageModal = (src: string) => {
  modalImageSrc.value = src.replace('w=400&h=200', 'w=800&h=600')
  showImageModalFlag.value = true
}

const jumpToDay = (date: string) => {
  if (!date) return
  setViewMode('timeline')
  alert(`跳转到${date}的记录`)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const loadMoreRecords = () => {
  alert('正在加载更早的记录...')
}

onMounted(() => {
  // 页面加载完成后的初始化逻辑
})
</script>

<style scoped>
.hero-image {
  height: 240px;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=240&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: end;
  padding: 24px;
  color: white;
  position: relative;
}

.hero-content {
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.hero-main {
  flex: 1;
}

.hero-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  line-height: 1.2;
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item i {
  width: 12px;
  font-size: 0.75rem;
}

.hero-followers {
  text-align: center;
  margin-left: 16px;
}

.followers-count {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.followers-label {
  font-size: 0.75rem;
  margin-top: 2px;
  opacity: 0.9;
}

.back-button {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.05);
}

.back-button i {
  font-size: 16px;
}

.farmer-info {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 20px 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.farmer-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.farmer-avatar {
  width: 60px;
  height: 60px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.farmer-avatar i {
  color: #16a34a;
  font-size: 24px;
}

.farmer-details {
  flex: 1;
}

.farmer-name {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.farmer-certification {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.follow-btn {
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.follow-btn:hover {
  background: #15803d;
}

.follow-btn.following {
  background: #e5e7eb;
  color: #6b7280;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #6b7280;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: #9ca3af;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  padding: 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #059669);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.timeline-vertical {
  position: relative;
  padding-left: 30px;
}

.timeline-vertical::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #d1d5db;
}

.day-selector {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.day-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-item.has-record {
  background: #dcfce7;
  color: #16a34a;
}

.day-item.today {
  background: #fbbf24;
  color: white;
}

.day-item:hover {
  transform: scale(1.1);
}

/* 按钮行布局修复 - 基于BaseButton组件布局问题修复文档 */
.view-mode-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 重写flex按钮的margin以修复布局冲突，并设置椭圆形状 */
.view-mode-buttons :deep(.view-mode-btn) {
  margin: 0 !important; /* 使用!important重写全局样式 */
  flex-shrink: 0;
  border-radius: 20px !important; /* 椭圆形按钮 */
  padding: 8px 16px !important;
  font-size: 14px !important;
}

/* 时间线元数据样式 */
.timeline-metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
  color: #6b7280;
}

.metadata-time,
.metadata-temperature {
  display: flex;
  align-items: center;
  gap: 4px;
}

.metadata-time i,
.metadata-temperature i {
  font-size: 12px;
}

/* 加载更多按钮样式 */
.load-more-section {
  text-align: center;
  padding: 32px 0;
}

.load-more-btn {
  background: none;
  border: none;
  color: #16a34a;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  padding: 8px 0;
}

.load-more-btn:hover {
  color: #15803d;
  transform: translateY(-1px);
}

.load-more-btn i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.load-more-btn:hover i {
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .farmer-info {
    margin: 20px 16px 24px;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .hero-title {
    font-size: 1.25rem;
  }
  
  .hero-info {
    gap: 2px;
  }
  
  .info-item {
    font-size: 0.8rem;
  }
  
  .followers-count {
    font-size: 1.25rem;
  }
  
  .view-mode-buttons {
    gap: 6px;
  }
  
  .back-button {
    top: 20px;
    left: 20px;
    width: 36px;
    height: 36px;
  }
  
  .back-button i {
    font-size: 14px;
  }
  
  .farmer-avatar {
    width: 50px;
    height: 50px;
  }
  
  .farmer-avatar i {
    font-size: 20px;
  }
  
  .farmer-name {
    font-size: 16px;
  }
  
  .follow-btn {
    padding: 6px 16px;
    font-size: 13px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .timeline-metadata {
    font-size: 13px;
  }
  
  .load-more-btn {
    font-size: 15px;
  }
  
  .load-more-section {
    padding: 24px 0;
  }
}
</style>