import App from './App.vue'
import './assets/main.css'
import router from './router'
import zhCN from '@/locales/primevue'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
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
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  locale: zhCN,
  ripple: true,
})

app.mount('#app')
