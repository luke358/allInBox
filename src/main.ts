import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import router from './router'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import 'normalize.css'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
