import { createApp } from 'vue'
import 'virtual:uno.css'
import router from './router'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import 'normalize.css'

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
