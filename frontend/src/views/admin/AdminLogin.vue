<template>
  <div class="admin-login">
    <div class="content-container">
      <div class="development-icon">
        <i class="fas fa-cog"></i>
      </div>
      <h1 class="title">管理员系统</h1>
      <p class="subtitle">正在开发中</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <button class="back-btn" @click="goToHome">
        <i class="fas fa-arrow-left mr-2"></i>
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-container {
  text-align: center;
  color: white;
  max-width: 500px;
  width: 100%;
}

.development-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
  animation: rotate 3s linear infinite;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .development-icon {
    font-size: 3rem;
  }
  
  .back-btn {
    padding: 14px 28px;
    font-size: 16px;
  }
}
</style>