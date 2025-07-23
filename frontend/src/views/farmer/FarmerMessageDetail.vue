<template>
  <div class="farmer-message-detail min-h-screen bg-green-50">
    <!-- 顶部导航栏 -->
    <TopNav 
      title="买家询问"
      :show-back="true"
      @back="goBack"
    />

    <!-- 聊天内容区域 -->
    <div class="flex-1 overflow-y-auto p-6 pb-80">
      <!-- 买家消息气泡 -->
      <div class="chat-bubble buyer mb-4">
        您好，请问您的水稻是用什么肥料的？安全吗？
      </div>
      <div class="chat-bubble buyer mb-4">
        我想给孩子吃，比较关心食品安全
      </div>
      <div class="text-center text-gray-500 text-sm my-4">2小时前</div>

      <!-- 农民回复（如果有的话） -->
      <div v-if="replies.length > 0">
        <div 
          v-for="reply in replies" 
          :key="reply.id"
          class="chat-bubble farmer mb-4"
        >
          {{ reply.content }}
        </div>
        <div class="text-center text-gray-500 text-sm my-2">刚刚</div>
      </div>
    </div>

    <!-- 常用回复模板 -->
    <div class="fixed bottom-20 left-0 right-0 bg-gray-50 p-4 border-t border-gray-200">
      <p class="text-lg font-semibold text-gray-800 mb-3">常用回复（点击即可发送）</p>
      <div class="space-y-2">
        <div 
          v-for="template in replyTemplates" 
          :key="template.id"
          class="reply-template"
          @click="sendQuickReply(template.content)"
        >
          {{ template.content }}
        </div>
      </div>
    </div>

    <!-- 自定义回复输入框 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div class="flex gap-3 items-end">
        <FormInput
          v-model="customReply"
          placeholder="输入自定义回复..."
          class="flex-1"
          @keyup.enter="sendCustomReply"
        />
        <BaseButton 
          variant="primary" 
          size="normal"
          icon="fas fa-paper-plane"
          :label="'发送'"
          @click="sendCustomReply"
          :disabled="!customReply.trim()"
        />
      </div>
    </div>

    <!-- 操作提示区域 -->
    <div 
      class="fixed top-20 left-4 right-4 z-40"
      :class="{ 'hidden': !showVoiceHint }"
    >
      <div class="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-center">
       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TopNav from '@/components/common/TopNav.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()
const route = useRoute()

// 页面状态
const customReply = ref('')
const showVoiceHint = ref(false)
const voiceHintText = ref('')
const replies = ref<Reply[]>([])

// 常用回复模板
const replyTemplates = ref([
  { id: 1, content: '感谢关注，都是绿色种植的' },
  { id: 2, content: '我们使用有机肥料，不打农药' },
  { id: 3, content: '欢迎来实地看看，地址在描述里' },
  { id: 4, content: '谢谢，有什么问题随时问' }
])

// 回复接口
interface Reply {
  id: number
  content: string
  timestamp: Date
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 发送快速回复
const sendQuickReply = async (content: string) => {
  showVoiceHint.value = true
  voiceHintText.value = '正在发送回复：' + content
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 添加到回复列表
    replies.value.push({
      id: Date.now(),
      content,
      timestamp: new Date()
    })
    
    voiceHintText.value = '回复发送成功，买家会收到您的消息'
  } catch (error) {
    voiceHintText.value = '回复发送失败，请重试'
  }
  
  setTimeout(() => {
    showVoiceHint.value = false
  }, 2000)
}

// 发送自定义回复
const sendCustomReply = async () => {
  const content = customReply.value.trim()
  if (!content) return
  
  await sendQuickReply(content)
  customReply.value = ''
}

// 页面初始化
onMounted(() => {
  const messageId = route.params.messageId
  const messageType = route.query.type
  
  console.log('消息ID:', messageId, '消息类型:', messageType)
  
  // 可以根据messageId加载具体的消息内容
  showVoiceHint.value = true
  voiceHintText.value = '正在加载对话内容...'
  
  setTimeout(() => {
    showVoiceHint.value = false
  }, 1500)
})
</script>

<style scoped>
/* 聊天气泡样式 */
.chat-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin: 8px 0;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-bubble.buyer {
  background: #f3f4f6;
  color: #1f2937;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.chat-bubble.farmer {
  background: #10b981;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

/* 回复模板样式 */
.reply-template {
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #059669;
  font-weight: 500;
}

.reply-template:hover {
  background: #dcfce7;
  border-color: #86efac;
  transform: translateY(-1px);
}

.reply-template:active {
  transform: translateY(0);
}

/* 页面背景 */
.farmer-message-detail {
  background-color: #f0fdf4;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chat-bubble {
    max-width: 85%;
    padding: 10px 14px;
    font-size: 15px;
  }
  
  .reply-template {
    padding: 10px 14px;
    font-size: 15px;
  }
}
</style>