<template>
  <div class="farmer-messages min-h-screen">
    <!-- 顶部导航栏 -->
    <TopNav 
      title="消息中心"
      :show-back="false"
    >
      <template #left-icon>
        <i class="fas fa-comments text-2xl mr-3"></i>
      </template>
      <template #actions>
        <button @click="markAllRead" class="nav-action-btn">
          一键已读
        </button>
      </template>
    </TopNav>

    <!-- 消息统计 -->
    <MessageOverview 
      :unread-count="unreadCount" 
      :total-count="messages.length" 
    />

    <!-- 消息列表 -->
    <div class="px-4 pb-32">
      <h3 class="text-2xl font-bold text-green-800 mb-6 messages-title">最新消息</h3>
      <!-- 买家提问消息 -->
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message-item"
        :class="{ 
          'unread': !message.read && message.type === 'question',
          'system': message.type === 'system'
        }"
        :data-priority="message.priority"
        @click="openMessage(message)"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" :class="message.avatarClass">
              <i :class="message.icon + ' text-xl'"></i>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ message.title }}</p>
              <p class="text-gray-600">{{ message.subtitle }}</p>
            </div>
          </div>
          <div class="text-right">
            <span v-if="message.count" class="message-count">{{ message.count }}</span>
            <i v-if="message.read && message.type === 'question'" class="fas fa-check-circle text-green-500"></i>
            <p class="text-sm text-gray-500 mt-1">{{ formatTime(message.time) }}</p>
          </div>
        </div>
        
        <p v-if="message.content" class="text-gray-700 p-3 rounded-lg mb-3" :class="message.contentClass">
          {{ message.content }}
        </p>
        
        <div v-if="message.type === 'question' && !message.read" class="button-row">
          <BaseButton 
            class="flex-button" 
            variant="primary" 
            size="normal"
            :label="'一键回复'"
            icon="fas fa-reply"
            @click.stop="quickReply(message, '感谢关注，都是绿色种植的')"
          />
          <BaseButton 
            class="flex-button" 
            variant="secondary" 
            size="normal"
            :label="'查看详细'"
            icon="fas fa-eye"
            @click.stop="viewMessageDetail(message)"
          />
        </div>
        
        <BaseButton 
          v-if="message.showActionButton && message.actionText"
          class="w-full mt-3" 
          variant="primary" 
          size="normal"
          :label="message.actionText"
          :icon="message.actionIcon"
          @click="message.action?.()"
        />
      </div>
    </div>


    <!-- 操作提示区域 -->
    <div 
      class="fixed top-20 left-4 right-4 z-40"
      :class="{ 'hidden': !showVoiceHint }"
      id="hintArea"
    >
      <div class="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-center">
        
        <p class="text-blue-800 text-lg font-medium">{{ voiceHintText }}</p>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <BottomNav :items="navItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/common/BottomNav.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import MessageOverview from '@/components/common/MessageOverview.vue'

const router = useRouter()


// 消息列表数据（模拟后端接口数据）
const messages = ref<Message[]>([
  {
    id: 1,
    title: '有人问你的水稻情况',
    subtitle: '3 人问了同样的问题',
    content: '买家们对您的水稻种植方式和品质非常感兴趣',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: 'question',
    priority: 'high',
    icon: 'fas fa-user',
    avatarClass: 'bg-orange-100 text-orange-600',
    count: 3,
    participants: [
      { id: 1, name: '李女士', avatar: '/api/avatars/buyer1.jpg', question: '请问您的水稻是有机种植吗？' },
      { id: 2, name: '张先生', avatar: '/api/avatars/buyer2.jpg', question: '水稻的品质怎么样？有检测报告吗？' },
      { id: 3, name: '王女士', avatar: '/api/avatars/buyer3.jpg', question: '什么时候可以购买？价格如何？' }
    ],
    location: '主要来自上海地区',
    urgency: 'high'
  },
  {
    id: 2,
    title: '收获季节提醒',
    subtitle: '您的水稻即将成熟',
    content: '根据您的种植记录和天气数据，水稻预计在15天后达到最佳收获期，请提前做好收获准备工作。',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: 'system',
    priority: 'medium',
    icon: 'fas fa-calendar-check',
    avatarClass: 'bg-blue-100 text-blue-600',
    contentClass: 'bg-blue-50',
    harvestDate: '2024-08-15',
    weather: '适合收获',
    expectedYield: '3.2吨/亩'
  },
  {
    id: 3,
    title: '记录提醒',
    subtitle: '好几天没有发布记录了',
    content: '您已经5天没有更新作物生长记录，建议及时拍照记录作物生长情况，让买家了解最新状态。',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    type: 'system',
    priority: 'medium',
    icon: 'fas fa-exclamation-triangle',
    avatarClass: 'bg-yellow-100 text-yellow-600',
    contentClass: 'bg-yellow-50',
    showActionButton: true,
    actionText: '立即拍照记录',
    actionIcon: 'fas fa-camera',
    action: () => goToPublish(),
    lastRecordDate: '5天前',
    followerCount: 128
  },
  {
    id: 4,
    title: '王女士问关于农药使用',
    subtitle: '已回复',
    content: '关于您的水稻是否使用了农药的问题，您已经给出了详细回复。',
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
    type: 'question',
    priority: 'low',
    icon: 'fas fa-user',
    avatarClass: 'bg-gray-100 text-gray-600',
    buyerInfo: {
      name: '王女士',
      location: '北京',
      avatar: '/api/avatars/buyer_wang.jpg'
    },
    replyDate: '1周前',
    satisfaction: 'high'
  },
  {
    id: 5,
    title: '买家点赞通知',
    subtitle: '24位买家点赞了您的作物',
    content: '您的水稻生长记录和种植方式获得了买家们的高度认可，共收获24个点赞和8条好评！',
    time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
    type: 'system',
    priority: 'low',
    icon: 'fas fa-heart',
    avatarClass: 'bg-green-100 text-green-600',
    contentClass: 'bg-green-50',
    likeCount: 24,
    commentCount: 8,
    topComments: [
      '看起来非常健康，期待上市！',
      '绿色种植的方式值得推广'
    ]
  }
])

// 定义消息类型接口（后端接口数据结构）
interface Message {
  id: number
  title: string
  subtitle?: string
  content?: string
  time: Date
  read: boolean
  type: 'question' | 'system'
  priority: 'high' | 'medium' | 'low'
  icon: string
  avatarClass: string
  contentClass?: string
  count?: number
  showActionButton?: boolean
  actionText?: string
  actionIcon?: string
  action?: () => void
  // 买家提问相关字段
  participants?: Array<{
    id: number
    name: string
    avatar: string
    question: string
  }>
  location?: string
  urgency?: string
  // 系统通知相关字段
  harvestDate?: string
  weather?: string
  expectedYield?: string
  lastRecordDate?: string
  followerCount?: number
  // 已回复消息相关
  buyerInfo?: {
    name: string
    location: string
    avatar: string
  }
  replyDate?: string
  satisfaction?: string
  // 点赞相关
  likeCount?: number
  commentCount?: number
  topComments?: string[]
}

// 页面状态
const showVoiceHint = ref(false)
const voiceHintText = ref('')

// 计算未读消息数量
const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length
})


// 模拟后端接口函数

const fetchMessages = async () => {
  // 模拟 API 调用： GET /api/farmer/messages
  return messages.value
}

const markMessageAsRead = async (messageId: number) => {
  // 模拟 API 调用： PUT /api/farmer/messages/{id}/read
  const message = messages.value.find(m => m.id === messageId)
  if (message) {
    message.read = true
  }
}

const sendQuickReply = async (messageId: number, reply: string) => {
  // 模拟 API 调用： POST /api/farmer/messages/{id}/reply
  console.log(`Sending reply: ${reply} to message ${messageId}`)
  await markMessageAsRead(messageId)
  return { success: true, message: '回复发送成功' }
}

// 底部导航配置 - FarmerMessages页面应该高亮"消息"
const navItems = [
  { 
    name: 'FarmerMyCrops', 
    label: '我的作物', 
    icon: 'fas fa-leaf', 
    route: 'FarmerMyCrops'
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
    route: 'FarmerMessages',
    active: true  // FarmerMessages页面高亮"消息"
  }
]

// 页面初始化时加载数据
const loadData = async () => {
  try {
    await fetchMessages()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

// 打开消息
const openMessage = async (message: Message) => {
  if (!message.read) {
    await markMessageAsRead(message.id)
  }
  
  if (message.type === 'question') {
    viewMessageDetail(message)
  } else {
    showVoiceHint.value = true
    voiceHintText.value = `已打开${message.title}`
    setTimeout(() => {
      showVoiceHint.value = false
    }, 2000)
  }
}

// 查看消息详情（跳转到新页面）
const viewMessageDetail = (message: Message) => {
  // 跳转到消息详情页面，传递消息 ID
  router.push({
    name: 'FarmerMessageDetail',
    params: { messageId: message.id.toString() },
    query: { type: message.type }
  })
}


// 快速回复
const quickReply = async (message: Message, replyText: string) => {
  showVoiceHint.value = true
  voiceHintText.value = '正在发送回复：' + replyText
  
  try {
    await sendQuickReply(message.id, replyText)
    voiceHintText.value = '回复发送成功，买家会收到您的消息'
  } catch (error) {
    voiceHintText.value = '回复发送失败，请重试'
  }
  
  setTimeout(() => {
    showVoiceHint.value = false
  }, 2000)
}

// 标记全部已读
const markAllRead = async () => {
  showVoiceHint.value = true
  voiceHintText.value = '正在标记所有消息为已读...'
  
  try {
    // 模拟 API 调用： PUT /api/farmer/messages/mark-all-read
    messages.value.forEach(message => {
      message.read = true
    })
    voiceHintText.value = '所有消息已标为已读'
  } catch (error) {
    voiceHintText.value = '操作失败，请重试'
  }
  
  setTimeout(() => {
    showVoiceHint.value = false
  }, 2000)
}

// 跳转到发布页面
const goToPublish = () => {
  router.push({ name: 'FarmerPublish' })
}

// 页面初始化
onMounted(async () => {
  await loadData()
  
  const unreadCount = messages.value.filter(m => !m.read).length
  if (unreadCount > 0) {
    showVoiceHint.value = true
    voiceHintText.value = `您有${unreadCount}条未读消息`
    setTimeout(() => {
      showVoiceHint.value = false
    }, 3000)
  }
})
</script>

<style scoped>
/* 标题样式 */
.messages-title {
  margin-left: 32px !important;
}

/* 消息卡片样式 */
.message-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 0 32px 32px 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.message-item.unread {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.message-item.system {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.message-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.12);
  border-radius: 14px;
}

.message-count {
  display: inline-block;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

/* 按钮行布局 */
.button-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 重写flex按钮的margin */
.button-row :deep(.flex-button) {
  flex: 1;
  margin: 0 !important;
}

/* 导航栏操作按钮样式 */
.nav-action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.nav-action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.nav-action-btn:active {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(0);
}


/* 优先级标识 */
.message-card[data-priority="high"] {
  border-left-width: 5px;
  border-left-color: #ef4444;
}

.message-card[data-priority="medium"] {
  border-left-color: #f59e0b;
}

.message-card[data-priority="low"] {
  border-left-color: #10b981;
}


/* 顶部导航栏样式 */
.top-nav {
  background: linear-gradient(135deg, #16a34a, #059669);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
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
  height: 80px; /* 固定导航栏高度 */
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

/* 页面胼景色 */
.farmer-messages {
  background-color: #f0fdf4; /* 淡绿色背景 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .message-overview-card {
    margin: 30px;
    padding: 24px 20px;
    border-radius: 16px;
  }
  
  .stat-item {
    padding: 8px;
  }
  
  .breathing-icon {
    width: 60px;
    height: 60px;
  }
  
  .circle-1 { width: 60px; height: 60px; }
  .circle-2 { width: 90px; height: 90px; }
  .circle-3 { width: 45px; height: 45px; }
}

/* 手机端优化和触摸友好性 */
@media (max-width: 480px) {
  .message-overview-card {
    padding: 20px 16px;
  }
  
  .grid.grid-cols-2 {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px 8px;
    text-align: center;
  }
  
  .stat-icon {
    margin: 0 auto 4px;
  }
  
  .message-item {
    padding: 14px;
    margin: 0 6px 10px 6px;
    border-radius: 12px;
  }
  
  /* 手机端增加更多底部间距 */
  .px-4.pb-32 {
    padding-bottom: 120px !important;
  }
  
  /* 手机端动画性能优化 */
  .message-overview-card {
    animation: none;
  }
  
  .floating-circles {
    display: none;
  }
}

/* 适老化设计 - 大字体，高对比度，大按钮 */
@media (max-width: 768px) {
  /* 最小触控区域60px */
  .message-item {
    min-height: 80px;
  }
  
  .reply-template {
    min-height: 60px;
  }
  
  /* 大字体 */
  h2, h3 {
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1.125rem;
  }
  
  .text-lg {
    font-size: 1.25rem;
  }
}
</style>