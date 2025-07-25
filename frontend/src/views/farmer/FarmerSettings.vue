<template>
  <div class="farmer-settings">
    
    <!-- 用户概览卡片 -->
    <div class="p-6">
      <el-card class="user-overview-card" shadow="hover">
        <div class="user-card-content">
          <div class="user-info">
            <h2 class="user-title">{{ userInfo.account }}</h2>
            <p class="user-subtitle">农户账户</p>
            <p class="user-detail">注册于 {{ userInfo.created_at ? formatDate(userInfo.created_at) : '未知' }}</p>
          </div>
          <div class="user-icon-container">
            <el-avatar :size="80" class="user-avatar" :src="getAvatarUrl(farmerProfile.avatar_url)">
              <el-icon v-if="!farmerProfile.avatar_url" :size="40"><User /></el-icon>
            </el-avatar>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 设置内容区域 -->
    <div class="px-6 pb-24" v-loading="loading">
      
      <!-- 账户信息 -->
      <div class="settings-section">
        <h3 class="section-title">
          <el-icon class="mr-2"><Setting /></el-icon>
          账户信息
        </h3>
        <el-card shadow="never" class="settings-card">
          <el-descriptions :column="1" border size="large">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon color="#16a34a"><Message /></el-icon>
                  账号
                </div>
              </template>
              {{ userInfo.account }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon color="#3b82f6"><Calendar /></el-icon>
                  注册时间
                </div>
              </template>
              {{ userInfo.created_at ? formatDate(userInfo.created_at) : '未知' }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon color="#16a34a"><CircleCheck /></el-icon>
                  账户状态
                </div>
              </template>
              <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'" size="large">
                {{ userInfo.status === 1 ? '正常' : '已禁用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <!-- 农户档案 -->
      <div class="settings-section">
        <h3 class="section-title">
          <el-icon class="mr-2"><Grape /></el-icon>
          农户档案
        </h3>
        <el-card shadow="never" class="settings-card">
          <div class="profile-item" v-for="item in profileItems" :key="item.key">
            <div class="profile-info">
              <div class="profile-label">
                <el-icon :color="item.iconColor" class="mr-2">
                  <component :is="item.icon" />
                </el-icon>
                {{ item.label }}
              </div>
              <div class="profile-value">
                {{ (farmerProfile as any)[item.key] || '未设置' }}
              </div>
            </div>
            <el-button 
              type="primary" 
              plain 
              size="large"
              round
              class="capsule-button"
              @click="editProfile(item.key)"
              :icon="Edit"
            >
              编辑
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 安全设置 -->
      <div class="settings-section">
        <h3 class="section-title">
          <el-icon class="mr-2"><Lock /></el-icon>
          安全设置
        </h3>
        <el-card shadow="never" class="settings-card">
          <div class="security-item">
            <div class="security-info">
              <div class="security-label">
                <el-icon color="#f59e0b" class="mr-2"><Key /></el-icon>
                修改密码
              </div>
              <div class="security-desc">为了账户安全，建议定期更换密码</div>
            </div>
            <el-button 
              type="warning" 
              size="large"
              round
              class="capsule-button"
              @click="changePassword" 
              :icon="Edit"
            >
              修改
            </el-button>
          </div>
          
          <el-divider />
          
          <div class="security-item">
            <div class="security-info">
              <div class="security-label">
                <el-icon color="#ef4444" class="mr-2"><SwitchButton /></el-icon>
                退出登录
              </div>
              <div class="security-desc">退出当前账户</div>
            </div>
            <el-button 
              type="danger" 
              size="large"
              round
              class="capsule-button"
              @click="logout" 
              :icon="SwitchButton"
            >
              退出
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 系统信息 -->
      <div class="settings-section">
        <h3 class="section-title">
          <el-icon class="mr-2"><InfoFilled /></el-icon>
          系统信息
        </h3>
        <el-card shadow="never" class="settings-card">
          <el-descriptions :column="1" border size="large">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon color="#3b82f6"><Platform /></el-icon>
                  版本信息
                </div>
              </template>
              智慧农业溯源系统 v1.0.0
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon color="#16a34a"><Clock /></el-icon>
                  最后更新
                </div>
              </template>
              {{ userInfo.updated_at ? formatDate(userInfo.updated_at) : '未知' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <BottomNav :items="navItems" />

    <!-- 编辑档案弹窗 -->
    <el-dialog
      v-model="showEditModal"
      :title="editModalTitle"
      width="90%"
      :before-close="handleEditClose"
    >
      <el-form :model="editForm" label-width="80px" size="large">
        <el-form-item :label="editFieldLabel">
          <!-- 头像上传 -->
          <div v-if="editField === 'avatar_url'" class="avatar-upload-container">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-change="handleAvatarChange"
              :auto-upload="false"
            >
              <img v-if="editValue" :src="getAvatarUrl(editValue)" class="avatar-preview" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>支持 JPG、PNG 格式，文件大小不超过 2MB</p>
            </div>
          </div>
          <!-- 文本输入框 -->
          <el-input
            v-else-if="editField !== 'farm_description'"
            v-model="editValue"
            :type="getInputType(editField)"
            :placeholder="getPlaceholder(editField)"
            clearable
          />
          <!-- 多行文本输入框 -->
          <el-input
            v-else-if="editField === 'farm_info'"
            v-model="editValue"
            type="textarea"
            :rows="4"
            :placeholder="getPlaceholder(editField)"
          />
          <!-- 普通文本输入框 -->
          <el-input
            v-else
            v-model="editValue"
            :type="getInputType(editField)"
            :placeholder="getPlaceholder(editField)"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button 
          size="large"
          round
          class="capsule-button"
          @click="showEditModal = false"
        >
          取消
        </el-button>
        <el-button 
          type="primary" 
          size="large"
          round
          class="capsule-button"
          @click="saveProfile" 
          :loading="saveLoading"
        >
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPasswordModal"
      title="修改密码"
      width="90%"
      :before-close="handlePasswordClose"
    >
      <el-form :model="passwordForm" label-width="100px" size="large">
        <el-form-item label="当前密码">
          <el-input
            v-model="oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button 
          size="large"
          round
          class="capsule-button"
          @click="showPasswordModal = false"
        >
          取消
        </el-button>
        <el-button 
          type="primary" 
          size="large"
          round
          class="capsule-button"
          @click="savePassword" 
          :loading="passwordLoading"
        >
          保存
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, Setting, Message, Calendar, CircleCheck, Grape, 
  Edit, Lock, Key, SwitchButton, InfoFilled, Platform, Clock,
  Phone, Location, Grid, Plus
} from '@element-plus/icons-vue'
import BottomNav from '@/components/common/BottomNav.vue'
import { userAPI, farmerAPI, authAPI } from '@/services/api'

const router = useRouter()

// 用户基本信息（从后端API获取，对应users表）
const userInfo = ref({
  id: null,
  account: '',
  created_at: null,
  updated_at: null,
  status: 1,
  roles: 'farmer'
})

// 农户档案信息（从后端API获取，对应farmer_profiles表）
const farmerProfile = ref({
  id: null,
  user_id: null,
  name: '',
  phone: '',
  location: '',
  farm_info: '',
  avatar_url: '',
  created_at: null,
  updated_at: null
})

// 农户档案配置
const profileItems = ref([
  { key: 'name', label: '真实姓名', icon: User, iconColor: '#3b82f6' },
  { key: 'phone', label: '联系电话', icon: Phone, iconColor: '#16a34a' },
  { key: 'location', label: '农场地理位置', icon: Location, iconColor: '#ef4444' },
  { key: 'farm_info', label: '农场详细信息', icon: Grid, iconColor: '#f59e0b' },
  { key: 'avatar_url', label: '头像图片', icon: User, iconColor: '#8b5cf6' }
])

// 弹窗状态
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editField = ref('')
const editValue = ref('')
const saveLoading = ref(false)
const passwordLoading = ref(false)

// 表单数据
const editForm = ref({})
const passwordForm = ref({})

// 密码修改表单
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 头像上传相关
const uploadedFile = ref<File | null>(null)

// 加载状态
const loading = ref(false)

// 底部导航配置 - FarmerSettings页面应该高亮"设置"
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
    route: 'FarmerMessages'
  },
  { 
    name: 'FarmerSettings', 
    label: '设置', 
    icon: 'fas fa-cog', 
    route: 'FarmerSettings',
    active: true  // FarmerSettings页面高亮"设置"
  }
]

// 计算属性
const editModalTitle = computed(() => {
  const fieldNames: Record<string, string> = {
    name: '编辑真实姓名',
    phone: '编辑联系电话',
    location: '编辑农场地理位置',
    farm_info: '编辑农场详细信息',
    avatar_url: '编辑头像图片'
  }
  return fieldNames[editField.value] || '编辑信息'
})

const editFieldLabel = computed(() => {
  const fieldLabels: Record<string, string> = {
    name: '真实姓名',
    phone: '联系电话',
    location: '农场地理位置',
    farm_info: '农场详细信息',
    avatar_url: '头像图片'
  }
  return fieldLabels[editField.value] || '信息'
})

// 格式化日期
const formatDate = (date: Date | string | null) => {
  if (!date) return '未知'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取头像完整URL
const getAvatarUrl = (url: string | null) => {
  if (!url) return ''
  // 如果是相对路径，添加后端域名
  if (url.startsWith('/uploads/')) {
    return `http://localhost:3001${url}`
  }
  // 如果已经是完整URL或blob URL，直接返回
  return url
}

// 获取输入框类型
const getInputType = (field: string) => {
  if (field === 'phone') return 'tel'
  return 'text'
}

// 获取占位符
const getPlaceholder = (field: string) => {
  const placeholders: Record<string, string> = {
    name: '请输入您的真实姓名',
    phone: '请输入11位手机号码',
    location: '请输入农场地理位置',
    farm_info: '请输入农场简介和详细信息',
    avatar_url: '请上传头像图片'
  }
  return placeholders[field] || '请输入信息'
}

// 编辑档案
const editProfile = (field: string) => {
  editField.value = field
  editValue.value = (farmerProfile.value as any)[field] || ''
  showEditModal.value = true
}

// 保存档案信息
const saveProfile = async () => {
  if (!editValue.value.trim()) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  // 简单验证
  if (editField.value === 'phone' && !/^1[3-9]\d{9}$/.test(editValue.value)) {
    ElMessage.error('请输入正确的手机号码格式')
    return
  }
  
  saveLoading.value = true
  
  try {
    // 处理头像上传
    if (editField.value === 'avatar_url' && uploadedFile.value) {
      const uploadResponse = await farmerAPI.uploadAvatar(uploadedFile.value)
      if (uploadResponse.success) {
        editValue.value = uploadResponse.data.avatar_url
      } else {
        throw new Error(uploadResponse.message || '头像上传失败')
      }
    }
    
    // 更新其他字段
    if (editField.value !== 'avatar_url') {
      const updateData: any = {}
      updateData[editField.value] = editValue.value
      
      const response = await farmerAPI.updateProfile(updateData)
      if (!response.success) {
        throw new Error(response.message || '更新失败')
      }
    } else if (uploadedFile.value) {
      // 头像上传后不需要再次调用更新接口，因为上传接口已经更新了数据库
    }
    
    // 更新本地数据
    if (farmerProfile.value) {
      const profile = farmerProfile.value as any
      profile[editField.value] = editValue.value
      profile.updated_at = new Date().toISOString()
    }
    
    showEditModal.value = false
    ElMessage.success('保存成功！')
    
    // 清理上传文件引用
    uploadedFile.value = null
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    saveLoading.value = false
  }
}

// 修改密码
const changePassword = () => {
  showPasswordModal.value = true
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

// 保存新密码
const savePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    ElMessage.warning('请填写完整的密码信息')
    return
  }
  
  if (newPassword.value.length < 6) {
    ElMessage.error('新密码至少需要6位字符')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  
  passwordLoading.value = true
  
  try {
    const response = await userAPI.changePassword(oldPassword.value, newPassword.value)
    
    if (response.success) {
      showPasswordModal.value = false
      ElMessage.success('密码修改成功！')
      // 重置表单
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      throw new Error(response.message || '密码修改失败')
    }
  } catch (error: any) {
    console.error('密码修改失败:', error)
    ElMessage.error(error.message || '密码修改失败，请重试')
  } finally {
    passwordLoading.value = false
  }
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 调用后端退出接口
    await authAPI.logout()
    
    // 清除本地存储的token
    localStorage.removeItem('token')
    localStorage.removeItem('farmer')
    
    ElMessage.success('已退出登录')
    router.push({ name: 'HomePage' })
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('退出登录失败:', error)
      // 即使后端调用失败，也清除本地token
      localStorage.removeItem('token')
      localStorage.removeItem('farmer')
      router.push({ name: 'HomePage' })
    }
  }
}

// 头像上传处理
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarChange = (file: any) => {
  if (file.raw) {
    uploadedFile.value = file.raw
    // 创建本地预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      editValue.value = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }
}

const handleAvatarSuccess = () => {
  // 上传成功后的处理逻辑，在saveProfile中处理
}

// 弹窗关闭处理
const handleEditClose = (done: () => void) => {
  // 清理上传的文件
  if (editField.value === 'avatar_url') {
    uploadedFile.value = null
  }
  done()
}

const handlePasswordClose = (done: () => void) => {
  done()
}

// 获取用户信息和农户档案
const fetchUserProfile = async () => {
  try {
    loading.value = true
    const response = await userAPI.getProfile()
    
    if (response.success) {
      userInfo.value = response.data.userInfo
      farmerProfile.value = response.data.farmerProfile || {
        id: null,
        user_id: null,
        name: '',
        phone: '',
        location: '',
        farm_info: '',
        avatar_url: '',
        created_at: null,
        updated_at: null
      }
    } else {
      ElMessage.error(response.message || '获取用户信息失败')
    }
  } catch (error: any) {
    console.error('获取用户信息失败:', error)
    ElMessage.error(error.message || '获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 页面初始化
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.farmer-settings {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f9f0, #e8f5e8);
  padding-bottom: 5rem;
}

/* 用户概览卡片样式 - 使用Element Plus卡片 */
.user-overview-card {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%) !important;
  border: none !important;
  color: white;
  position: relative;
  overflow: hidden;
}

.user-overview-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.user-card-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  gap: 1.5rem;
}

.user-info {
  flex: 1;
  margin-right: 1.5rem;
}

.user-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.user-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
}

.user-detail {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  line-height: 1.4;
}

.user-icon-container {
  flex-shrink: 0;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 3px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
}

/* 设置区域样式 */
.settings-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.settings-card {
  border: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

/* 描述列表单元格样式 */
.cell-item {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #374151;
}

/* 农户档案项目样式 */
.profile-item {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.profile-item:last-child {
  border-bottom: none;
}

.profile-item:hover {
  background-color: #f9fafb;
}

.profile-info {
  flex: 1;
}

.profile-label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.profile-value {
  color: #6b7280;
  font-size: 0.95rem;
}

/* 安全设置项目样式 */
.security-item {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
}

.security-info {
  flex: 1;
}

.security-label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.security-desc {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-descriptions__label) {
  font-weight: 600 !important;
  color: #374151 !important;
}

:deep(.el-descriptions__content) {
  color: #6b7280 !important;
}

:deep(.el-card__body) {
  padding: 0 !important;
}

:deep(.el-descriptions) {
  margin: 0 !important;
}

:deep(.el-descriptions__body) {
  background: transparent !important;
}

:deep(.el-descriptions-item__container) {
  padding: 1.25rem 1.5rem !important;
}

:deep(.el-divider) {
  margin: 0 !important;
}

/* 底部导航栏样式 - 复用FarmerMyCrops的样式 */
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
  z-index: 1000;
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

/* Element Plus 弹窗样式优化 */
:deep(.el-dialog) {
  border-radius: 12px !important;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem !important;
}

:deep(.el-dialog__title) {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
}

:deep(.el-dialog__body) {
  padding: 2rem !important;
}

:deep(.el-dialog__footer) {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 2rem !important;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

:deep(.el-dialog__footer .el-button) {
  flex: 1;
  max-width: 120px;
}

:deep(.el-form-item__label) {
  font-weight: 600 !important;
  color: #374151 !important;
}

:deep(.el-input__inner) {
  border-radius: 8px !important;
}

/* 胶囊按钮样式 - 手机端友好 */
.capsule-button {
  border-radius: 2rem !important;
  min-width: 88px !important;
  min-height: 48px !important;
  height: 48px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  padding: 0 24px !important;
  letter-spacing: 0.5px !important;
}

.capsule-button:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
}

.capsule-button:active {
  transform: translateY(0) scale(0.98) !important;
  transition: all 0.1s ease !important;
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .capsule-button:hover {
    transform: none !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  .capsule-button:active {
    transform: scale(0.95) !important;
  }
}

/* 头像上传组件样式 */
.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
}

:deep(.avatar-uploader .el-upload) {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.upload-tips {
  text-align: center;
}

.upload-tips p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .profile-item, .security-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  
  .profile-info, .security-info {
    margin-bottom: 1rem;
    width: 100%;
  }
  
  :deep(.el-button:not(.capsule-button)) {
    width: 100% !important;
  }
  
  .capsule-button {
    min-width: 100px !important;
    height: 52px !important;
    font-size: 17px !important;
  }
  
  .avatar-upload-container {
    width: 100%;
  }
  
  :deep(.avatar-uploader .el-upload) {
    width: 100px;
    height: 100px;
  }
  
  .avatar-preview {
    width: 100px;
    height: 100px;
  }
  
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto !important;
  }
}

@media (max-width: 480px) {
  .user-overview-card {
    margin: 0 1rem !important;
  }
  
  .user-card-content {
    flex-direction: row;
    text-align: left;
    gap: 1rem;
  }
  
  .user-info {
    margin-right: 0;
    flex: 1;
  }
  
  .user-icon-container {
    flex-shrink: 0;
  }
  
  .settings-section {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    padding: 0 0.5rem;
  }
  
  :deep(.el-descriptions-item__container) {
    padding: 1rem !important;
  }
  
  .profile-item, .security-item {
    padding: 1rem !important;
  }
  
  :deep(.avatar-uploader .el-upload) {
    width: 80px;
    height: 80px;
  }
  
  .avatar-preview {
    width: 80px;
    height: 80px;
  }
  
  .upload-tips p {
    font-size: 0.8rem;
  }
}
</style>