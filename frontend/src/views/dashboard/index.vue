<template>
  <div class="dashboard">
    <TopBar
      :active-nav="activeNav"
      :last-updated="lastUpdatedLabel"
      :nav-items="NAV_LIST"
      :theme="theme"
      @change-nav="changeNav"
      @toggle-theme="toggleTheme"
    />

    <CuratedBoard v-if="activeNav === NavType.Selected" @loaded="markUpdatedNow" />

    <TransitionGroup v-else appear tag="main" name="category-card" class="dashboard__grid">
      <CategoryCard
        v-for="category in filteredCategories"
        :key="category.key"
        :category="category"
        @loaded="markUpdatedNow"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CategoryCard from '@/components/CategoryCard/index.vue'
  import CuratedBoard from '@/components/CuratedBoard/index.vue'
  import TopBar from '@/components/TopBar/index.vue'
  import { NAV_LIST } from '@/constants/nav'
  import { useNewsBoard } from '@/hooks/useNewsBoard'
  import { useTheme } from '@/hooks/useTheme'
  import { NavType } from '@/types/nav'

  const route = useRoute()
  const router = useRouter()
  const { theme, toggleTheme, initializeTheme } = useTheme()
  const { categories, lastUpdatedLabel, markUpdatedNow } = useNewsBoard()
  const navTypes = new Set<string>(Object.values(NavType))
  
  const routeNav = computed(() => {
    const nav = route.query.nav
    return typeof nav === 'string' && navTypes.has(nav) ? (nav as NavType) : NavType.Default
  })
  const activeNav = ref<NavType>(routeNav.value)

  const filteredCategories = computed(() => {
    if (activeNav.value === NavType.Default) {
      return categories.value
    }

    return categories.value.filter((category) => category.belongTo.includes(activeNav.value))
  })

  const changeNav = (nav: NavType) => {
    activeNav.value = nav
    router.replace({
      query: {
        ...route.query,
        nav,
      },
    })
  }

  watch(routeNav, (nav) => {
    activeNav.value = nav
  })

  onMounted(() => {
    initializeTheme()
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
