import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.min.css'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { prefix: 'p', darkModeSelector: 'false', cssLayer: false },
  },
})
app.use(ToastService)

// Register PrimeVue components globally
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Card', Card)
app.component('Message', Message)
app.component('Dropdown', Dropdown)
app.component('Toast', Toast)

app.mount('#app')
