import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { NavType } from '@/types/nav'

const getActiveNav = (routeName: unknown, routeNav: unknown) => {
  if (routeName === 'curated') {
    return NavType.Selected
  }

  if (routeName === 'subscription') {
    return NavType.Subscription
  }

  return (routeNav as NavType) || NavType.Selected
}

const useNavStore = defineStore('nav', () => {
  const route = useRoute()
  const activeNav = computed<NavType>({
    get: () => getActiveNav(route.name, route.query.nav),
    set: () => undefined,
  })

  return { activeNav }
})

export default useNavStore
