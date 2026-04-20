<template>
  <div class="dashboard">
    <TopBar :last-updated="lastUpdatedLabel" :theme="theme" @toggle-theme="toggleTheme" />

    <main class="dashboard__grid">
      <CategoryCard
        v-for="category in categories"
        :key="category.key"
        :category="category"
        @loaded="markUpdatedNow"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import CategoryCard from '@/components/CategoryCard/index.vue'
  import TopBar from '@/components/TopBar/index.vue'
  import { useNewsBoard } from '@/hooks/useNewsBoard'
  import { useTheme } from '@/hooks/useTheme'

  const { theme, toggleTheme, initializeTheme } = useTheme()
  const { categories, lastUpdatedLabel, markUpdatedNow } = useNewsBoard()

  onMounted(() => {
    initializeTheme()
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
