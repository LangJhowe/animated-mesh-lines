import { createApp } from 'vue'

import 'normalize.css'
import '@/assets/style/index.styl'
import './assets/style/global.styl'

import App from './App.vue'
import router from './router'
import './router/interceptor'
import registerDirective from './directives'
import './libs/monaco-editor-language'
import './native'


const app = createApp(App).use(router)
registerDirective(app)
app.mount('#app')

