<template>
  <div class="message-overview-card">
    <div class="overview-content">
      <div class="overview-text">
        <h2 class="overview-title">消息概览</h2>
        <div class="stats-container">
          <div class="stat-item">
            <p class="stat-label">未读消息</p>
            <p class="stat-value">{{ unreadCount }}</p>
          </div>
          <div class="stat-item">
            <p class="stat-label">总消息数</p>
            <p class="stat-value">{{ totalCount }}</p>
          </div>
        </div>
      </div>
      <div class="overview-icon">
        <i class="fas fa-bell"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  unreadCount: number
  totalCount: number
}

defineProps<Props>()
</script>

<style scoped>
.message-overview-card {
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 0 32px 32px 32px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.message-overview-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.12);
}

.overview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.overview-text {
  flex: 1;
}

.overview-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: white;
}

.stats-container {
  display: flex;
  gap: 48px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
  font-weight: 400;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.overview-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.overview-icon i {
  font-size: 24px;
  color: white;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .message-overview-card {
    margin: 0 6px 10px 6px;
    padding: 14px;
  }
  
  .overview-title {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .stats-container {
    gap: 32px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .overview-icon {
    width: 56px;
    height: 56px;
  }
  
  .overview-icon i {
    font-size: 20px;
  }
}
</style>