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

    <TransitionGroup appear tag="main" name="category-card" class="dashboard__grid">
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
  import { computed, onMounted, ref } from 'vue'

  import CategoryCard from '@/components/CategoryCard/index.vue'
  import TopBar from '@/components/TopBar/index.vue'
  import { NAV_LIST } from '@/constants/nav'
  import { useNewsBoard } from '@/hooks/useNewsBoard'
  import { useTheme } from '@/hooks/useTheme'
  import { NavType } from '@/types/nav'

  const { theme, toggleTheme, initializeTheme } = useTheme()
  const { categories, lastUpdatedLabel, markUpdatedNow } = useNewsBoard()
  const activeNav = ref<NavType>(NavType.Default)

  const filteredCategories = computed(() => {
    if (activeNav.value === NavType.Default) {
      return categories.value
    }

    return categories.value.filter((category) => category.belongTo.includes(activeNav.value))
  })

  const changeNav = (nav: NavType) => {
    activeNav.value = nav
  }

  onMounted(() => {
    initializeTheme()
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
