import App from './App.vue'
import './api/interceptor'
import './assets/main.css'
import router from './router'
import { DARK_CLASS, useLayout } from '@/composables/useLayout'
import { PiniaColada } from '@pinia/colada'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import { zh_CN } from 'primelocale/js/zh_CN.js'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: `.${DARK_CLASS}`,
      cssLayer: false,
    },
  },
  locale: zh_CN,
  ripple: true,
})

// 初始化布局配置
const { initLayout } = useLayout()
initLayout()

app.mount('#app')
