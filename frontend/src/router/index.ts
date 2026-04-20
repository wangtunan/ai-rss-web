import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '@/views/dashboard/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
  ],
})

export default router
