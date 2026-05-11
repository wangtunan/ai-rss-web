import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '@/components/Layout/index.vue'
const DashboardView = () => import('@/views/dashboard/index.vue')
const CuratedView = () => import('@/views/curated/index.vue')

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/curated',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'curated',
          name: 'curated',
          component: CuratedView,
        },
      ],
    },
  ],
})

export default router
