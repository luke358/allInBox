import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '',
      component: defineAsyncComponent(() => import(`../views/home.vue`)),
    },
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.meta.title) {
    document.title = `${to.meta.title}`;
  }
  next()
})

router.afterEach((to, from) => {
  // console.log(to, from)
  console.log('afterEach')
})

export default router