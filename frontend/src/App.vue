<script setup lang="ts">
import { onMounted } from 'vue'

import CategoryCard from '@/components/CategoryCard.vue'
import TopBar from '@/components/TopBar.vue'
import { useNewsBoard } from '@/hooks/useNewsBoard'
import { useTheme } from '@/hooks/useTheme'

const { theme, toggleTheme, initializeTheme } = useTheme()
const { loading, errorMessage, groupedCategories, lastUpdatedLabel, loadNews } = useNewsBoard()

onMounted(async () => {
  initializeTheme()
  await loadNews()
})
</script>

<template>
  <div class="dashboard">
    <TopBar :last-updated="lastUpdatedLabel" :theme="theme" @toggle-theme="toggleTheme" />

    <main v-if="loading" class="state-card">正在加载数据...</main>
    <main v-else-if="errorMessage" class="state-card state-error">{{ errorMessage }}</main>
    <main v-else class="grid-board">
      <CategoryCard v-for="category in groupedCategories" :key="category.key" :category="category" />
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem 2rem 2.4rem;
  font-family:
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Noto Sans CJK SC',
    sans-serif;
  color: var(--text);
}

.grid-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.state-card {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: var(--surface);
  padding: 1rem 1.1rem;
  color: var(--text-soft);
}

.state-error {
  color: var(--danger);
}

@media (max-width: 820px) {
  .dashboard {
    padding: 1.2rem 1rem 1.35rem;
  }

  .grid-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid-board {
    grid-template-columns: 1fr;
  }
}
</style>
