import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { NavType } from '@/types/nav'

const useNavStore = defineStore('nav', () => {
  const route = useRoute()
  const nav = route.query.nav as NavType
  const activeNav = ref<NavType>(nav || NavType.Default)

  return { activeNav }
})

export default useNavStore
