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
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  locale: zh_CN,
  ripple: true,
})

app.mount('#app')
