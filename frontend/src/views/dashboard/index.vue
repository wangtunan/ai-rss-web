<template>
  <div class="dashboard">
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
  // ======= 第三方库 =======
  import { computed } from 'vue'

  // ======= hooks & stores =======
  import { useNewsBoard } from '@/hooks/useNewsBoard'
  import useNavStore from '@/stores/nav'

  // ======= hooks & stores =======
  import CategoryCard from '@/components/CategoryCard/index.vue'

  // ======= 其它 =======
  import { NavType } from '@/types/nav'

  const { categories, markUpdatedNow } = useNewsBoard()
  const navStore = useNavStore()

  const filteredCategories = computed(() => {
    if (navStore.activeNav === NavType.Default) {
      return categories.value
    }

    return categories.value.filter((category) => category.belongTo.includes(navStore.activeNav))
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
