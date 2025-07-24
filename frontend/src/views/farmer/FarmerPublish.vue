<template>
  <div class="farmer-publish min-h-screen bg-green-50">

    <!-- 主内容区域 -->
    <div class="p-6 pb-32">
      <!-- 拍照上传区域 -->
      <div class="upload-card mx-4 mb-6">
        <h2 class="text-2xl font-bold text-green-800 mb-6 text-center">添加照片或视频</h2>
        
        <div class="upload-buttons-container mb-6">
          <button class="upload-button" @click="takePhoto">
            <i class="fas fa-camera text-4xl text-green-600"></i>
            <span class="font-bold text-green-800">拍照片</span>
          </button>
          
          <button class="upload-button" @click="selectPhoto">
            <i class="fas fa-image text-4xl text-green-600"></i>
            <span class="font-bold text-green-800">选照片</span>
          </button>
        </div>

        <!-- 预览区域 -->
        <div v-if="showPreview" class="preview-area">
          <h3 class="text-lg font-semibold text-green-800 mb-3">照片预览</h3>
          <img :src="previewImage" class="preview-image" alt="预览图片">
          <div class="flex gap-3 mt-3">
            <BaseButton 
              class="flex-1" 
              variant="secondary" 
              size="large"
              :label="'重新拍摄'"
              icon="fas fa-redo"
              @click="retakePhoto"
            />
            <BaseButton 
              class="flex-1" 
              variant="primary" 
              size="large"
              :label="'确认使用'"
              icon="fas fa-check"
              @click="confirmPhoto"
            />
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="showUploadProgress" class="text-center py-8">
          <div class="progress-circle mx-auto mb-4" :style="{ '--progress': uploadProgress + '%' }">
            <div class="progress-inner">{{ uploadProgress }}%</div>
          </div>
          <p class="text-lg text-green-800 font-medium">正在上传，请稍等...</p>
        </div>
      </div>

      <!-- 添加描述区域 -->
      <div class="description-card mx-4 mb-6">
        <h2 class="text-2xl font-bold text-green-800 mb-6">添加描述</h2>
        
        <!-- 常用标签 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-green-800 mb-4">选择标签（点击即可添加）</h3>
          <div class="tag-group">
            <button 
              v-for="tag in availableTags" 
              :key="tag.name"
              class="tag tag-button"
              @click="addTag(tag.name)"
            >
              <i :class="tag.icon + ' mr-2'"></i>{{ tag.name }}
            </button>
          </div>
        </div>

        <!-- 已选标签 -->
        <div v-if="selectedTags.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-green-800 mb-3">已选标签</h3>
          <div class="tag-group">
            <span 
              v-for="tag in selectedTags" 
              :key="tag"
              class="tag active cursor-pointer"
              @click="removeTag(tag)"
            >
              {{ tag }} <i class="fas fa-times ml-2"></i>
            </span>
          </div>
        </div>

        <!-- 文字描述 -->
        <div class="form-group">
          <FormInput
            v-model="description"
            label="详细描述"
            type="textarea"
            placeholder="可以写一些详细的描述，比如：今天的水稻长得很好..."
            :rows="4"
            @input="checkPublishButton"
          />
        </div>
      </div>
    </div>

    <!-- 底部发布按钮 -->
    <div class="publish-button-container">
      <BaseButton 
        class="w-full publish-button" 
        variant="primary" 
        size="xl"
        :label="'确认发布'"
        icon="fas fa-paper-plane"
        :disabled="!canPublish"
        @click="publishPost"
      />
    </div>

    <!-- 底部导航栏 -->
    <BottomNav :items="navItems" />

    <!-- 操作提示区域 -->
    <div 
      class="fixed top-20 left-4 right-4 z-50"
      :class="{ 'hidden': !showVoiceHint }"
    >
      <div class="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-center">
      </div>
    </div>

    <!-- 发布成功提示 -->
    <BaseModal
      v-model:visible="showSuccessModal"
      title=""
      size="medium"
      :show-footer="false"
      :closable="false"
    >
      <div class="text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <i class="fas fa-check text-3xl text-green-600"></i>
        </div>
        <h3 class="text-3xl font-bold text-green-800 mb-4">发布成功！</h3>
        <p class="text-xl text-gray-600 mb-8">您的生长记录已成功发布</p>
        <BaseButton 
          variant="primary" 
          size="large"
          :label="'返回我的作物'"
          icon="fas fa-home"
          @click="closeSuccessModal"
        />
      </div>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '@/components/common/BottomNav.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

// 页面状态
const selectedImage = ref<string | null>(null)
const previewImage = ref('')
const showPreview = ref(false)
const showUploadProgress = ref(false)
const uploadProgress = ref(0)
const selectedTags = ref<string[]>([])
const description = ref('')
const showVoiceHint = ref(false)
const voiceHintText = ref('')
const showSuccessModal = ref(false)

// 文件输入引用
const fileInput = ref<HTMLInputElement>()

// 可用标签
const availableTags = ref([
  { name: '施肥', icon: 'fas fa-seedling' },
  { name: '浇水', icon: 'fas fa-tint' },
  { name: '除草', icon: 'fas fa-cut' },
  { name: '生长记录', icon: 'fas fa-chart-line' },
  { name: '收获', icon: 'fas fa-hand-holding-heart' },
  { name: '播种', icon: 'fas fa-seed' }
])

// 底部导航配置
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
    route: 'FarmerPublish',
    active: true
  },
  { 
    name: 'FarmerMessages', 
    label: '消息', 
    icon: 'fas fa-comments', 
    route: 'FarmerMessages'
  }
]

// 计算是否可以发布
const canPublish = computed(() => {
  return selectedImage.value && (selectedTags.value.length > 0 || description.value.trim())
})

// 拍照功能
const takePhoto = () => {
  showVoiceHint.value = true
  voiceHintText.value = '正在打开相机'
  fileInput.value?.click()
  hideVoiceHint()
}

// 选择照片
const selectPhoto = () => {
  showVoiceHint.value = true
  voiceHintText.value = '正在打开相册'
  fileInput.value?.click()
  hideVoiceHint()
}

// 重新拍摄
const retakePhoto = () => {
  showPreview.value = false
  selectedImage.value = null
  previewImage.value = ''
  showVoiceHint.value = true
  voiceHintText.value = '请重新选择照片'
  hideVoiceHint()
}

// 确认照片
const confirmPhoto = () => {
  showPreview.value = false
  selectedImage.value = previewImage.value
  simulateUpload()
}

// 模拟上传过程
const simulateUpload = () => {
  showUploadProgress.value = true
  showVoiceHint.value = true
  voiceHintText.value = '开始上传照片'
  hideVoiceHint()
  
  uploadProgress.value = 0
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)
      showUploadProgress.value = false
      showVoiceHint.value = true
      voiceHintText.value = '照片上传成功'
      hideVoiceHint()
    }
  }, 200)
}

// 添加标签
const addTag = (tagName: string) => {
  if (!selectedTags.value.includes(tagName)) {
    selectedTags.value.push(tagName)
    showVoiceHint.value = true
    voiceHintText.value = `已添加标签：${tagName}`
    hideVoiceHint()
  }
}

// 移除标签
const removeTag = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagName)
  showVoiceHint.value = true
  voiceHintText.value = `已移除标签：${tagName}`
  hideVoiceHint()
}

// 检查发布按钮状态
const checkPublishButton = () => {
  // 这个函数会在computed中自动处理
}

// 发布动态
const publishPost = () => {
  if (!selectedImage.value) {
    showVoiceHint.value = true
    voiceHintText.value = '请先选择照片哦'
    hideVoiceHint()
    return
  }
  
  if (selectedTags.value.length === 0 && !description.value.trim()) {
    showVoiceHint.value = true
    voiceHintText.value = '请添加标签或写一些描述哦'
    hideVoiceHint()
    return
  }
  
  // 模拟发布过程
  showVoiceHint.value = true
  voiceHintText.value = '正在发布，请稍等...'
  
  setTimeout(() => {
    showSuccessModal.value = true
    showVoiceHint.value = true
    voiceHintText.value = '发布成功！'
    hideVoiceHint()
  }, 2000)
}

// 关闭成功提示
const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
  router.push({ name: 'FarmerMyCrops' })
}

// 重置表单
const resetForm = () => {
  selectedImage.value = null
  previewImage.value = ''
  selectedTags.value = []
  description.value = ''
  showPreview.value = false
  showUploadProgress.value = false
  uploadProgress.value = 0
}

// 隐藏语音提示
const hideVoiceHint = () => {
  setTimeout(() => {
    showVoiceHint.value = false
  }, 3000)
}

// 页面初始化
onMounted(() => {
  showVoiceHint.value = true
  voiceHintText.value = '请选择照片开始记录作物生长'
  hideVoiceHint()
})
</script>

<style scoped>
/* 上传卡片样式 */
.upload-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin:30px;
}

.description-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin:30px 30px 140px 30px ;
}

/* 上传按钮容器 */
.upload-buttons-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

/* 上传按钮样式 */
.upload-button {
  flex: 1;
  height: 120px;
  font-size: 20px;
  border: 3px dashed #10b981;
  background: #ecfdf5;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: #d1fae5;
  border-color: #059669;
}

/* 进度圆环样式 */
.progress-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#10b981 var(--progress, 0%), #e5e7eb 0%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-inner {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

/* 预览图片样式 */
.preview-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin: 16px 0;
}

/* 标签组样式 */
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f0fdf4;
  color: #059669;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  border: 2px solid #bbf7d0;
}

.tag:hover, .tag.active {
  background: #059669;
  color: white;
  border-color: #059669;
}

.tag-button {
  border: 2px solid #bbf7d0;
}

.tag-button:hover {
  background: #dcfce7;
  border-color: #86efac;
}

/* 表单组样式 */
.form-group {
  margin-bottom: 24px;
}

/* 页面背景 */
.farmer-publish {
  background-color: #f0fdf4;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 发布按钮容器 */
.publish-button-container {
  position: fixed !important;
  bottom: 84px !important;
  left: 16px !important;
  right: 16px !important;
  background: transparent !important;
  padding: 16px !important;
  z-index: 40 !important;
}

/* 发布按钮样式 */
.publish-button {
  width: 100% !important;
  display: block !important;
  margin: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .upload-button {
    height: 100px;
    font-size: 18px;
  }
  
  .upload-card, .description-card {
    margin: 0 -8px 24px -8px;
    padding: 16px;
    border-radius: 12px;
  }
  
  .tag {
    padding: 6px 12px;
    font-size: 14px;
    min-height: 36px;
  }
  
  .publish-button-container {
    left: 12px !important;
    right: 12px !important;
    padding: 12px !important;
    bottom: 80px !important;
  }
}
</style>