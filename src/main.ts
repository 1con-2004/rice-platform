import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入样式文件
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

// 导入 FontAwesome
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')