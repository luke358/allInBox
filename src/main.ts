import { createApp } from 'vue'
import 'virtual:uno.css'

import "./style.css"
import App from './App.vue'
import './samples/node-api'
import 'normalize.css'
createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
