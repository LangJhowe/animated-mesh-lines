import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'normalize.css'
import '/@/assets/style/index.styl'

const app = createApp(App).use(router)
app.mount('#app')
