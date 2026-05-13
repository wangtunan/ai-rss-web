<template>
  <div class="layout">
    <TopBar
      :active-nav="navStore.activeNav"
      :last-updated="lastUpdatedLabel"
      :nav-items="NAV_LIST"
      :theme="theme"
      @change-nav="changeNav"
      @toggle-theme="toggleTheme"
    />
    <RouterView />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
  // ======= 第三方库 =======
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  // ======= hooks & stores =======
  import { useTheme } from '@/hooks/useTheme'
  import { useNewsBoard } from '@/hooks/useNewsBoard'
  import useNavStore from '@/stores/nav'

  // ======= components =======
  import TopBar from '@/components/TopBar/index.vue'
  import AppToast from '@/components/Toast/index.vue'

  // ======= 其它 =======
  import { NAV_LIST } from '@/constants/nav'
  import { NavType } from '@/types/nav'

  const router = useRouter()
  const route = useRoute()
  const { theme, toggleTheme, initializeTheme } = useTheme()
  const { lastUpdatedLabel } = useNewsBoard()
  const navStore = useNavStore()

  const changeNav = (nav: NavType) => {
    navStore.activeNav = nav
    if (nav === NavType.Selected) {
      router.push({ name: 'curated' })
      return
    }
    if (nav === NavType.Subscription) {
      router.push({ name: 'subscription' })
      return
    }
    router.replace({
      path: '/dashboard',
      query: {
        ...route.query,
        nav,
      },
    })
  }

  onMounted(() => {
    initializeTheme()
  })
</script>
