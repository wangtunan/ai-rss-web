<template>
  <CategoryCardSkeleton v-if="loading" />

  <section v-else class="category-card">
    <header class="category-card__header">
      <div class="category-card__header-main">
        <h2 class="category-card__title">
          <span
            class="category-card__icon"
            aria-hidden="true"
            :class="{ 'category-card__icon--github': category.key === 'github' }"
          >
            <img :src="category.icon" :alt="`${category.subtitle} favicon`" />
          </span>
          <span>{{ category.label }}</span>
        </h2>
        <p class="category-card__subtitle">{{ category.subtitle }} · Top {{ items.length }}</p>
      </div>
      <span class="category-card__count-pill">{{ items.length }}</span>
    </header>

    <div v-if="error" class="category-card__error-panel">
      <p class="category-card__error-title">加载失败</p>
      <p class="category-card__error-message">{{ error }}</p>
      <button class="category-card__retry-button" @click="loadCategory">重试</button>
    </div>

    <ol v-else class="category-card__list">
      <li v-for="(item, index) in items" :key="`${category.key}-${item.link}`" class="category-card__row">
        <p class="category-card__rank">{{ index + 1 }}</p>
        <div class="category-card__main" :title="item.title">
          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="category-card__title-link"
            :title="item.title"
          >
            {{ item.title }}
          </a>

          <p class="category-card__summary" :title="item.ai_summary">
            <span class="category-card__summary-label">AI摘要</span>
            <span>{{ item.ai_summary }}</span>
          </p>

          <div class="category-card__footer">
            <span class="category-card__published-time">{{ item.published_time }}</span>

            <div v-if="item.ai_tags?.length" class="category-card__tags">
              <span v-for="tag in item.ai_tags.slice(0, 3)" :key="`${item.link}-${tag}`" class="category-card__tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div class="category-card__meta">
          <span class="category-card__importance">★{{ item.ai_importance }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import { fetchNewsListPayload } from '@/api/news'
  import CategoryCardSkeleton from '@/components/CategoryCardSkeleton/index.vue'
  import { MAX_ITEMS_PER_CATEGORY } from '@/constants/news'
  import type { NewsItem } from '@/types/news'

  type CategoryCardConfig = {
    key: string
    label: string
    subtitle: string
    icon: string
  }

  const props = defineProps<{
    category: CategoryCardConfig
  }>()

  const emit = defineEmits<{
    loaded: []
  }>()

  const loading = ref(true)
  const error = ref('')
  const items = ref<NewsItem[]>([])

  const loadCategory = async () => {
    loading.value = true
    error.value = ''

    try {
      const result = await fetchNewsListPayload({
        category: props.category.key,
        limit: MAX_ITEMS_PER_CATEGORY,
        offset: 0,
      })
      items.value = result.items
      emit('loaded')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(loadCategory)
</script>

<style scoped src="./index.scss" lang="scss"></style>
