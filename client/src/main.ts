import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'

import '@/assets/styles.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).mount('#app')
