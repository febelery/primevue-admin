import App from './App.vue'
import './assets/main.css'
import router from './router'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import { zh_CN } from 'primelocale/js/zh_CN.js'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    },
  },
  locale: zh_CN,
  ripple: true,
})

// 检测系统是否为深色模式
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('p-dark')
}

app.mount('#app')
