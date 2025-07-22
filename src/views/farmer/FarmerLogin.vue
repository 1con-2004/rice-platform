<template>
  <div class="farmer-login">
    
    <div class="login-container">
      <!-- Logo区域 -->
      <div class="text-center mb-8">
        <div class="logo-container">
          <i class="fas fa-seedling text-6xl text-green-600 mb-4"></i>
        </div>
        <h1 class="header-elderly text-green-700">智慧农业溯源</h1>
        <p class="text-elderly text-gray-600">专为农民朋友设计</p>
      </div>

      <!-- 表单切换区域 -->
      <div class="form-switch mb-8">
        <button 
          :class="['switch-btn', { active: isLogin }]"
          @click="showLogin"
        >
          登录账号
        </button>
        <button 
          :class="['switch-btn', { active: !isLogin }]"
          @click="showRegister"
        >
          注册账号
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="login-form">
        <FormInput
          v-model="loginForm.account"
          label="手机号码或身份证号"
          icon="fas fa-user"
          placeholder="请输入手机号码或身份证号"
          :error-message="loginErrors.account"
          required
        />

        <FormInput
          v-model="loginForm.password"
          label="登录密码"
          icon="fas fa-lock"
          type="password"
          placeholder="请输入登录密码"
          :error-message="loginErrors.password"
          required
        >
          <template #suffix>
            <button type="button" @click="togglePasswordVisibility('login')">
              <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </template>
        </FormInput>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="loginForm.remember" />
            <span>记住我的登录信息</span>
          </label>
        </div>

        <BaseButton
          label="登录"
          variant="primary"
          size="large"
          icon="fas fa-sign-in-alt"
          :loading="loginLoading"
          type="submit"
          class="w-full"
        />

        <div class="text-center mt-6">
          <button type="button" class="text-link" @click="showForgotPassword">
            忘记密码？点击找回
          </button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="register-form">
        <FormInput
          v-model="registerForm.phone"
          label="手机号码"
          icon="fas fa-mobile-alt"
          placeholder="请输入手机号码"
          :error-message="registerErrors.phone"
          required
        />

        <FormInput
          v-model="registerForm.name"
          label="真实姓名"
          icon="fas fa-user"
          placeholder="请输入真实姓名"
          :error-message="registerErrors.name"
          required
        />

        <FormInput
          v-model="registerForm.idCard"
          label="身份证号码"
          icon="fas fa-id-card"
          placeholder="请输入身份证号码"
          :error-message="registerErrors.idCard"
          required
        />

        <FormInput
          v-model="registerForm.password"
          label="设置密码"
          icon="fas fa-lock"
          type="password"
          placeholder="请设置登录密码"
          :error-message="registerErrors.password"
          required
        />

        <FormInput
          v-model="registerForm.confirmPassword"
          label="确认密码"
          icon="fas fa-lock"
          type="password"
          placeholder="请再次输入密码"
          :error-message="registerErrors.confirmPassword"
          required
        />

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="registerForm.agreement" required />
            <span>我已阅读并同意《用户协议》和《隐私政策》</span>
          </label>
        </div>

        <BaseButton
          label="注册"
          variant="primary"
          size="large"
          icon="fas fa-user-plus"
          :loading="registerLoading"
          type="submit"
          class="w-full"
        />
      </form>

      <!-- 语音提示区域 -->
      <div class="voice-hint mt-8 p-4 bg-blue-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <i class="fas fa-volume-up text-blue-600 mr-2"></i>
            <span class="text-blue-700">语音提示已开启</span>
          </div>
          <button @click="toggleVoice" class="btn-secondary">
            {{ voiceEnabled ? '关闭' : '开启' }}语音
          </button>
        </div>
      </div>

      <!-- 帮助区域 -->
      <div class="help-section mt-6 text-center">
        <p class="text-gray-600 mb-4">遇到问题？</p>
        <div class="flex justify-center gap-4">
          <button @click="callSupport" class="help-btn">
            <i class="fas fa-phone mr-2"></i>
            电话帮助
          </button>
          <button @click="showTutorial" class="help-btn">
            <i class="fas fa-play-circle mr-2"></i>
            操作教程
          </button>
        </div>
      </div>
    </div>

    <!-- 成功提示模态框 -->
    <BaseModal
      v-model:visible="showSuccessModal"
      title="登录成功"
      :show-footer="false"
      :closable="false"
    >
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="fas fa-check text-2xl text-green-600"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">登录成功！</h3>
        <p class="text-gray-600 mb-6">正在进入您的农作物管理页面...</p>
        <LoadingSpinner :visible="true" />
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/common/FormInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()

// 响应式数据
const isLogin = ref(true)
const loginLoading = ref(false)
const registerLoading = ref(false)
const showLoginPassword = ref(false)
const showSuccessModal = ref(false)
const voiceEnabled = ref(true)

// 表单数据
const loginForm = reactive({
  account: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  phone: '',
  name: '',
  idCard: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 错误信息
const loginErrors = reactive({
  account: '',
  password: ''
})

const registerErrors = reactive({
  phone: '',
  name: '',
  idCard: '',
  password: '',
  confirmPassword: ''
})

// 方法
const showLogin = () => {
  isLogin.value = true
  announceVoice('切换到登录界面')
}

const showRegister = () => {
  isLogin.value = false
  announceVoice('切换到注册界面')
}

const togglePasswordVisibility = (type: 'login' | 'register') => {
  if (type === 'login') {
    showLoginPassword.value = !showLoginPassword.value
  }
}

const validateLogin = () => {
  // 重置错误信息
  Object.keys(loginErrors).forEach(key => {
    loginErrors[key as keyof typeof loginErrors] = ''
  })

  let isValid = true

  if (!loginForm.account.trim()) {
    loginErrors.account = '请输入手机号码或身份证号'
    isValid = false
  }

  if (!loginForm.password.trim()) {
    loginErrors.password = '请输入登录密码'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLogin()) return

  loginLoading.value = true
  announceVoice('正在验证登录信息，请稍候')

  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 简单的演示验证
    if (loginForm.account === '13800138000' && loginForm.password === '123456') {
      showSuccessModal.value = true
      announceVoice('登录成功！正在进入您的管理页面')
      
      // 保存登录状态
      if (loginForm.remember) {
        localStorage.setItem('rememberedUser', loginForm.account)
      }
      
      // 3秒后跳转
      setTimeout(() => {
        router.push('/farmer/my-crops')
      }, 3000)
    } else {
      loginErrors.account = '账号或密码错误，请重新输入'
      announceVoice('账号或密码错误，请重新输入')
    }
  } catch (error) {
    announceVoice('登录失败，请检查网络连接')
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  // 注册逻辑
  registerLoading.value = true
  announceVoice('正在创建账户，请稍候')
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    announceVoice('注册成功！请使用新账户登录')
    showLogin()
  } finally {
    registerLoading.value = false
  }
}

const showForgotPassword = () => {
  alert('请联系客服：400-888-9999')
  announceVoice('请联系客服热线：400-888-9999')
}

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  announceVoice(voiceEnabled.value ? '语音提示已开启' : '语音提示已关闭')
}

const callSupport = () => {
  if (window.confirm('是否拨打客服电话：400-888-9999？')) {
    window.location.href = 'tel:400-888-9999'
  }
}

const showTutorial = () => {
  alert('操作教程功能开发中...')
}

// 语音播报功能
const announceVoice = (text: string) => {
  if (!voiceEnabled.value) return
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}
</script>

<style scoped>
.farmer-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
  padding-top: 54px;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.logo-container {
  padding: 20px 0;
}

.form-switch {
  display: flex;
  background: white;
  border-radius: var(--border-radius);
  padding: 4px;
  box-shadow: var(--shadow-soft);
}

.switch-btn {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: var(--text-large);
  font-weight: 600;
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-btn.active {
  background: var(--primary-green);
  color: white;
  box-shadow: var(--shadow-soft);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-large);
  color: var(--text-dark);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.text-link {
  color: var(--primary-green);
  text-decoration: none;
  font-size: var(--text-large);
  cursor: pointer;
}

.text-link:hover {
  text-decoration: underline;
}

.help-btn {
  background: white;
  border: 2px solid var(--border-light);
  border-radius: var(--border-radius);
  padding: 12px 20px;
  font-size: var(--text-base);
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-btn:hover {
  border-color: var(--primary-green);
  color: var(--primary-green);
}

.w-full {
  width: 100%;
}
</style>