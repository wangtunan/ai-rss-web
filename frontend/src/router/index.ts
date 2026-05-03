import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '@/views/dashboard/index.vue'
import AdminSourcesView from '@/views/admin/sources/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/admin/sources',
      name: 'admin-sources',
      component: AdminSourcesView,
    },
  ],
})

export default router
