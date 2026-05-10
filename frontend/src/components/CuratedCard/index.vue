<template>
  <article class="curated-card">
    <a
      class="curated-card__title"
      :href="props.item.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ props.item.title }}
    </a>

    <p class="curated-card__reason">
      <span>AI推荐理由</span>
      {{ props.item.ai_summary || props.item.raw_content }}
    </p>

    <footer class="curated-card__footer">
      <NewsTags
        :tags="props.item.ai_tags"
        :max-count="3"
      />

      <div class="curated-card__byline">
        <span class="curated-card__source-time">
          <span class="curated-card__source">
            <img
              class="curated-card__source-icon"
              :src="sourceIcon"
              :alt="sourceLabel"
            />
            <span>{{ sourceLabel }}</span>
          </span>
          <time>{{ props.item.published_time || props.item.ingest_date }}</time>
        </span>
        <RatingStars class="curated-card__score" :score="props.item.ai_importance" />
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
  import RatingStars from '@/components/RatingStars/index.vue'
  import NewsTags from '@/components/NewsTags/index.vue'

  import type { NewsItem } from '@/types/news'
  import { CATEGORY_META } from '@/constants/news'

  interface IProps {
    /** 资讯数据 */
    item: NewsItem
    /** 源标签 */
    sourceLabel: string
  }

  const props = defineProps<IProps>()

  const sourceIcon = CATEGORY_META[props.item.category]?.icon ?? '/vite.svg'
</script>

<style scoped src="./index.scss" lang="scss"></style>