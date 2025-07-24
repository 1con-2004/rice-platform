import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入视图组件
import HomePage from '@/views/HomePage.vue'

// 农户端路由
import FarmerLogin from '@/views/farmer/FarmerLogin.vue'
import FarmerMyCrops from '@/views/farmer/FarmerMyCrops.vue'
import FarmerPublish from '@/views/farmer/FarmerPublish.vue'
import FarmerMessages from '@/views/farmer/FarmerMessages.vue'
import FarmerMessageDetail from '@/views/farmer/FarmerMessageDetail.vue'
import FarmerSettings from '@/views/farmer/FarmerSettings.vue'

// 买家端路由
import BuyerHome from '@/views/buyer/BuyerHome.vue'
import BuyerCropDetail from '@/views/buyer/BuyerCropDetail.vue'
import BuyerSearch from '@/views/buyer/BuyerSearch.vue'

// 管理端路由
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminUserManagement from '@/views/admin/AdminUserManagement.vue'
import AdminContentReview from '@/views/admin/AdminContentReview.vue'
import AdminAnalytics from '@/views/admin/AdminAnalytics.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { title: '智慧农业溯源系统' }
  },
  
  // 农户端路由
  {
    path: '/farmer',
    children: [
      {
        path: 'login',
        name: 'FarmerLogin',
        component: FarmerLogin,
        meta: { title: '农户登录' }
      },
      {
        path: 'my-crops',
        name: 'FarmerMyCrops',
        component: FarmerMyCrops,
        meta: { title: '我的作物', requiresAuth: true }
      },
      {
        path: 'publish',
        name: 'FarmerPublish',
        component: FarmerPublish,
        meta: { title: '发布动态', requiresAuth: true }
      },
      {
        path: 'messages',
        name: 'FarmerMessages',
        component: FarmerMessages,
        meta: { title: '消息中心', requiresAuth: true }
      },
      {
        path: 'messages/:messageId',
        name: 'FarmerMessageDetail',
        component: FarmerMessageDetail,
        meta: { title: '消息详情', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'FarmerSettings',
        component: FarmerSettings,
        meta: { title: '个人设置', requiresAuth: true }
      }
    ]
  },
  
  // 买家端路由
  {
    path: '/buyer',
    children: [
      {
        path: 'home',
        name: 'BuyerHome',
        component: BuyerHome,
        meta: { title: '作物浏览' }
      },
      {
        path: 'crop/:id',
        name: 'BuyerCropDetail',
        component: BuyerCropDetail,
        meta: { title: '作物详情' }
      },
      {
        path: 'search',
        name: 'BuyerSearch',
        component: BuyerSearch,
        meta: { title: '搜索作物' }
      }
    ]
  },
  
  // 管理端路由
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: { title: '管理员登录' }
      },
      {
        path: 'users',
        name: 'AdminUserManagement',
        component: AdminUserManagement,
        meta: { title: '用户管理', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'content-review',
        name: 'AdminContentReview',
        component: AdminContentReview,
        meta: { title: '内容审核', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: AdminAnalytics,
        meta: { title: '数据统计', requiresAuth: true, role: 'admin' }
      }
    ]
  },
  
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 检查认证状态
  if (to.meta.requiresAuth) {
    // 这里可以添加认证检查逻辑
    // const isAuthenticated = checkAuthStatus()
    // if (!isAuthenticated) {
    //   next('/farmer/login')
    //   return
    // }
  }
  
  next()
})

export default router