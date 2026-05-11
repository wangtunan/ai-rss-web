<template>
  <header class="category-header">
    <div class="category-header__main">
      <h2 class="category-header__title">
        <span
          class="category-header__icon"
          aria-hidden="true"
          :class="{ 'category-header__icon--github': props.category.key === 'github' }"
        >
          <img :src="props.category.icon" :alt="`${props.category.subtitle} favicon`" />
        </span>
        <span>{{ props.category.label }}</span>
      </h2>
      <p class="category-header__subtitle">{{ props.category.subtitle }} · Top {{ itemsCount }}</p>
    </div>

    <div class="category-header__right">
      <span class="category-header__count-pill">{{ itemsCount }}</span>
      <ShareAction
        :target-ref="props.targetRef"
        :items="props.items"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import ShareAction from '@/components/ShareAction/index.vue'
  import type { CategoryMeta, NewsItem } from '@/types/news'
  interface IProps {
    /** 分类数据 */
    category: CategoryMeta
    /** 资讯列表 */
    items: NewsItem[],
    /** 截图目标元素 */
    targetRef: HTMLElement | null
  }
  const props = defineProps<IProps>()


  const itemsCount = computed(() => props.items?.length)
</script>

<style scoped src="./index.scss" lang="scss"></style>