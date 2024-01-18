import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import './style.scss'
import App from './App.vue'
// import './samples/node-api'
import 'normalize.css'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
