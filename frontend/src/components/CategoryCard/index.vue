<template>
  <li class="category-card">
    <p class="category-card__rank">{{ props.index + 1 }}</p>
    <div class="category-card__main" :title="props.item.title">
      <a
        :href="props.item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="category-card__title-link"
        :title="props.item.title"
      >
        {{ props.item.title }}
      </a>

      <p class="category-card__summary" :title="props.item.ai_summary">
        <span class="category-card__summary-label">AI摘要</span>
        <span>{{ props.item.ai_summary }}</span>
      </p>

      <div class="category-card__footer">
        <span class="category-card__published-time">{{ props.item.published_time }}</span>

        <NewsTags
          :tags="props.item.ai_tags"
          :max-count="3"
        />

      </div>
    </div>
    <div class="category-card__meta">
      <span class="category-card__importance">★{{ props.item.ai_importance }}</span>
    </div>
  </li>
</template>
<script setup lang="ts">
  import NewsTags from '@/components/NewsTags/index.vue'
  import type { NewsItem } from '@/types/news'

  interface IProps {
    /** 排名 */
    index: number
    /** 资讯数据 */
    item: NewsItem
  }
  const props = defineProps<IProps>()
</script>

<style scoped src="./index.scss" lang="scss"></style>