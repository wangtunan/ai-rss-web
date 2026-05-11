<template>
  <div class="dashboard">
    <TransitionGroup appear tag="main" name="category-card-panel" class="dashboard__grid">
      <div
        v-for="category in filteredCategories"
        :key="category.key"
        class="dashboard__grid-item"
      >
        <CategoryCardList
          :category="category"
          @loaded="markUpdatedNow"
        />
      </div>
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
  import CategoryCardList from '@/components/CategoryCardList/index.vue'

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
