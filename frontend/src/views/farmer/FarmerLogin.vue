<template>
  <div class="farmer-login">
    <!-- 头部标题区域 -->
    <div class="header-section">
      <div class="logo-container">
        <i class="fas fa-seedling text-4xl text-white"></i>
      </div>
      <h1 class="header-elderly">智慧农业溯源</h1>
      <p class="subtitle-elderly">记录作物成长的每一天</p>
    </div>

    <!-- 表单容器 -->
    <div class="form-container">
      <!-- 登录表单 -->
      <div v-show="isLogin" class="form-card">
        <h2 class="title-elderly">农民登录</h2>
        
        <div class="form-group">
          <FormInput
            v-model="loginForm.account"
            label="账号"
            icon="fas fa-user"
            placeholder="手机号或用户名"
            :error-message="loginErrors.account"
          />
          <p class="input-help">请输入您的手机号或用户名</p>
        </div>

        <div class="form-group">
          <FormInput
            v-model="loginForm.password"
            label="密码"
            icon="fas fa-lock"
            type="password"
            placeholder="请输入密码"
            :error-message="loginErrors.password"
          />
        </div>

        <BaseButton
          @click="handleLogin"
          label="立即登录"
          variant="primary"
          size="large"
          icon="fas fa-sign-in-alt"
          :loading="loginLoading"
          class="login-btn"
        />

        <div class="switch-link">
          <button @click="showRegister" class="link-btn">
            还没有账号？立即注册
          </button>
        </div>

        <div class="forgot-link">
          <button @click="forgotPassword" class="forgot-btn">
            忘记密码？
          </button>
        </div>
      </div>

      <!-- 注册表单 -->
      <div v-show="!isLogin" class="form-card">
        <h2 class="title-elderly">农民注册</h2>
        
        <div class="form-group">
          <FormInput
            v-model="registerForm.account"
            label="账号"
            icon="fas fa-user"
            placeholder="手机号或自定义用户名"
            :error-message="registerErrors.account"
          />
          <p class="input-help">可以使用手机号，也可以自定义用户名</p>
        </div>

        <div class="form-group">
          <FormInput
            v-model="registerForm.password"
            label="设置密码"
            icon="fas fa-lock"
            type="password"
            placeholder="请设置登录密码"
            :error-message="registerErrors.password"
          />
          <p class="input-help">密码用于登录，请牢记</p>
        </div>

        <div class="form-group">
          <FormInput
            v-model="registerForm.confirmPassword"
            label="确认密码"
            icon="fas fa-lock"
            type="password"
            placeholder="再次输入密码"
            :error-message="registerErrors.confirmPassword"
          />
        </div>

        <BaseButton
          @click="handleRegister"
          label="立即注册"
          variant="primary"
          size="large"
          icon="fas fa-user-plus"
          :loading="registerLoading"
          class="register-btn"
        />

        <div class="switch-link">
          <button @click="showLogin" class="link-btn">
            已有账号？立即登录
          </button>
        </div>
      </div>
    </div>

    <!-- 语音提示区域 -->
    <div class="voice-hint" :class="{ visible: showVoiceHint }">
      <div class="voice-content">
        <i class="fas fa-volume-up text-blue-600 mr-3"></i>
        <p class="hint-text">{{ hintText }}</p>
      </div>
    </div>

    <!-- 操作成功提示 -->
    <BaseModal
      v-model:visible="showSuccessModal"
      :show-close="false"
    >
      <div class="success-modal">
        <div class="success-icon">
          <i class="fas fa-check"></i>
        </div>
        <h3 class="success-title">操作成功！</h3>
        <p class="success-text">{{ successText }}</p>
        <div class="button-center">
          <BaseButton @click="closeModal" label="知道了" variant="primary" size="large" />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import FormInput from '@/components/common/FormInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

// 响应式数据
const isLogin = ref(true)
const loginLoading = ref(false)
const registerLoading = ref(false)
const showSuccessModal = ref(false)
const showVoiceHint = ref(false)
const hintText = ref('')
const successText = ref('')

// 表单数据
const loginForm = reactive({
  account: '',
  password: ''
})

const registerForm = reactive({
  account: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const loginErrors = reactive({
  account: '',
  password: ''
})

const registerErrors = reactive({
  account: '',
  password: '',
  confirmPassword: ''
})

// 显示语音提示
const showVoiceHintMsg = (text: string) => {
  hintText.value = text
  showVoiceHint.value = true
  
  // 语音播报
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}

// 显示成功提示
const showSuccess = (text: string) => {
  successText.value = text
  showSuccessModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showSuccessModal.value = false
}

// 切换到注册
const showRegister = () => {
  isLogin.value = false
  clearErrors()
  showVoiceHintMsg('请填写注册信息')
}

// 切换到登录
const showLogin = () => {
  isLogin.value = true
  clearErrors()
  showVoiceHintMsg('请输入您的账号和密码')
}

// 清空错误信息
const clearErrors = () => {
  Object.keys(loginErrors).forEach(key => {
    loginErrors[key as keyof typeof loginErrors] = ''
  })
  Object.keys(registerErrors).forEach(key => {
    registerErrors[key as keyof typeof registerErrors] = ''
  })
}

// 处理登录
const handleLogin = async () => {
  clearErrors()
  
  if (!loginForm.account) {
    loginErrors.account = '请输入账号'
    showVoiceHintMsg('请先输入账号哦')
    return
  }
  
  if (!loginForm.password) {
    loginErrors.password = '请输入密码'
    showVoiceHintMsg('请先输入密码哦')
    return
  }
  
  loginLoading.value = true
  showVoiceHintMsg('正在登录，请稍候...')
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: loginForm.account,
        password: loginForm.password
      })
    })
    
    // 检查网络请求是否成功
    if (!response.ok) {
      const errorData = await response.json()
      showVoiceHintMsg(errorData.message || '登录失败，请重试')
      return
    }
    
    const result = await response.json()
    
    if (result.success) {
      // 保存用户信息和token
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('farmer', JSON.stringify(result.data.farmer))
      
      showSuccess('登录成功，正在进入系统...')
      setTimeout(() => {
        closeModal()
        showVoiceHintMsg('登录成功，欢迎回来！')
        // 这里可以跳转到其他页面
        // router.push('/farmer/dashboard')
      }, 2000)
    } else {
      showVoiceHintMsg(result.message || '登录失败，请重试')
    }
    
  } catch (error) {
    console.error('登录请求失败:', error)
    showVoiceHintMsg('网络连接失败，请检查网络后重试')
  } finally {
    loginLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  clearErrors()
  
  if (!registerForm.account) {
    registerErrors.account = '请输入账号'
    showVoiceHintMsg('请先输入账号哦')
    return
  }
  
  if (!registerForm.password) {
    registerErrors.password = '请输入密码'
    showVoiceHintMsg('请先设置密码哦')
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = '两次密码不一致'
    showVoiceHintMsg('两次密码不一样，请重新输入')
    return
  }
  
  registerLoading.value = true
  showVoiceHintMsg('正在注册，请稍候...')
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: registerForm.account,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword
      })
    })
    
    // 检查网络请求是否成功
    if (!response.ok) {
      const errorData = await response.json()
      showVoiceHintMsg(errorData.message || '注册失败，请重试')
      return
    }
    
    const result = await response.json()
    
    if (result.success) {
      showSuccess('注册成功！您现在可以登录了')
      setTimeout(() => {
        closeModal()
        showLogin()
        showVoiceHintMsg('注册成功，请登录')
        // 清空注册表单
        registerForm.account = ''
        registerForm.password = ''
        registerForm.confirmPassword = ''
      }, 2000)
    } else {
      showVoiceHintMsg(result.message || '注册失败，请重试')
    }
    
  } catch (error) {
    console.error('注册请求失败:', error)
    showVoiceHintMsg('网络连接失败，请检查网络后重试')
  } finally {
    registerLoading.value = false
  }
}

// 忘记密码
const forgotPassword = () => {
  showVoiceHintMsg('请联系客服帮助找回密码：400-123-4567')
}

// 页面初始化
onMounted(() => {
  setTimeout(() => {
    showVoiceHintMsg('欢迎使用智慧农业溯源系统')
  }, 1000)
})
</script>

<style scoped>
.farmer-login {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f9f0, #e8f5e8);
  padding-bottom: 5rem;
}

/* 头部区域 */
.header-section {
  text-align: center;
  padding: 3rem 0 2rem;
}

.logo-container {
  width: 6rem;
  height: 6rem;
  background: #16a34a;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-elderly {
  font-size: 2.5rem;
  font-weight: bold;
  color: #166534;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle-elderly {
  font-size: 1.25rem;
  color: #16a34a;
  font-weight: 500;
}

/* 表单容器 */
.form-container {
  padding: 0 1.5rem;
}

.form-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title-elderly {
  font-size: 2rem;
  font-weight: bold;
  color: #166534;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* 按钮样式 */
.login-btn, .register-btn {
  width: 100%;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  padding: 1rem;
  border-radius: 0.75rem;
}

.switch-link {
  text-align: center;
  margin-bottom: 1.5rem;
}

.link-btn {
  color: #16a34a;
  font-size: 1.125rem;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.link-btn:hover {
  color: #15803d;
}

.forgot-link {
  text-align: center;
  margin-top: 1.5rem;
}

.forgot-btn {
  color: #6b7280;
  font-size: 1rem;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}

.forgot-btn:hover {
  color: #4b5563;
}

/* 语音提示区域 */
.voice-hint {
  position: fixed;
  bottom: 6rem;
  left: 1rem;
  right: 1rem;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 10;
}

.voice-hint.visible {
  transform: translateY(0);
}

.voice-content {
  display: flex;
  align-items: center;
}

.hint-text {
  color: #1e40af;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}

/* 成功模态框 */
.success-modal {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 20rem;
  margin: 0 auto;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  background: #dcfce7;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon i {
  font-size: 2rem;
  color: #16a34a;
}

.success-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #166534;
  margin-bottom: 0.5rem;
}

.success-text {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* 适老化设计 - 大字体，高对比度 */
@media (max-width: 768px) {
  .header-elderly {
    font-size: 2.25rem;
  }
  
  .subtitle-elderly {
    font-size: 1.125rem;
  }
  
  .title-elderly {
    font-size: 1.75rem;
  }
  
  .form-container {
    padding: 0 1rem;
  }
  
  .form-card {
    padding: 1.5rem;
  }
}

/* 确保按钮足够大，便于老年人操作 */
:deep(.form-input) {
  font-size: 1.125rem;
  padding: 1rem;
  border-radius: 0.75rem;
}

:deep(.form-label) {
  font-size: 1.125rem;
  font-weight: 600;
}

:deep(.form-help) {
  font-size: 1rem;
}

:deep(.btn-primary) {
  min-height: 3.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.input-help {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.button-center {
  display: flex;
  justify-content: center;
}
</style>