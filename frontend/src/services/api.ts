// API 基础配置
const API_BASE_URL = 'http://localhost:3001/api'

// 获取存储的token
const getToken = () => {
  return localStorage.getItem('token')
}

// 通用API请求函数
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken()
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '网络请求失败' }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 用户相关API
export const userAPI = {
  // 获取用户信息和农户档案
  async getProfile() {
    return apiRequest('/user/profile')
  },

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string) {
    return apiRequest('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword })
    })
  }
}

// 农户相关API
export const farmerAPI = {
  // 更新农户档案
  async updateProfile(profileData: {
    name?: string
    phone?: string
    location?: string
    farm_info?: string
  }) {
    return apiRequest('/farmer/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  // 上传头像
  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)

    const token = getToken()
    
    const response = await fetch(`${API_BASE_URL}/farmer/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '上传失败' }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

// 认证相关API
export const authAPI = {
  // 退出登录
  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST'
    })
  }
}