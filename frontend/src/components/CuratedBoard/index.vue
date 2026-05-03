<template>
  <main class="curated-board">
    <aside class="curated-board__menu" aria-label="精选范围">
      <header class="curated-board__menu-header">
        <p class="curated-board__eyebrow">Curated</p>
        <h2 class="curated-board__menu-title">精选</h2>
      </header>

      <nav class="curated-board__nav">
        <button
          v-for="section in sections"
          :key="section.period"
          type="button"
          class="curated-board__nav-item"
          :class="{ 'curated-board__nav-item--active': activePeriod === section.period }"
          :aria-current="activePeriod === section.period ? 'page' : undefined"
          @click="activePeriod = section.period"
        >
          <span class="curated-board__nav-main">
            <span class="curated-board__nav-title">{{ section.title }}</span>
            <span class="curated-board__nav-subtitle">{{ section.subtitle }}</span>
          </span>
          <span class="curated-board__nav-count">{{ section.items.length || section.limit }}</span>
        </button>
      </nav>
    </aside>

    <section class="curated-board__content" :aria-busy="activeSection.loading">
      <header class="curated-board__content-header">
        <div>
          <p class="curated-board__eyebrow">{{ activeSection.badge }}</p>
          <h2 class="curated-board__content-title">{{ activeSection.title }}</h2>
        </div>
        <span class="curated-board__content-count">{{ activeSection.loading ? activeSection.limit : activeSection.items.length }} 条</span>
      </header>

      <div v-if="activeSection.loading" class="curated-skeleton" aria-hidden="true">
        <article v-for="index in activeSection.limit" :key="`${activeSection.period}-skeleton-${index}`" class="curated-skeleton__item">
          <div class="curated-skeleton__accent"></div>
          <div class="curated-skeleton__line curated-skeleton__line--title"></div>
          <div class="curated-skeleton__line curated-skeleton__line--title-short"></div>
          <div class="curated-skeleton__reason">
            <div class="curated-skeleton__line curated-skeleton__line--reason"></div>
            <div class="curated-skeleton__line curated-skeleton__line--reason"></div>
            <div class="curated-skeleton__line curated-skeleton__line--reason-short"></div>
          </div>
          <div class="curated-skeleton__tags">
            <div class="curated-skeleton__pill curated-skeleton__pill--teal"></div>
            <div class="curated-skeleton__pill curated-skeleton__pill--blue"></div>
            <div class="curated-skeleton__pill curated-skeleton__pill--amber"></div>
          </div>
          <div class="curated-skeleton__footer">
            <div class="curated-skeleton__source">
              <div class="curated-skeleton__icon"></div>
              <div class="curated-skeleton__line curated-skeleton__line--meta"></div>
            </div>
            <div class="curated-skeleton__stars">
              <span v-for="star in 5" :key="star" class="curated-skeleton__star"></span>
            </div>
          </div>
        </article>
        <span class="curated-board__sr-only">精选内容加载中</span>
      </div>

      <div v-else-if="activeSection.error" class="curated-board__error">
        <p class="curated-board__error-title">加载失败</p>
        <p class="curated-board__error-message">{{ activeSection.error }}</p>
        <button class="curated-board__retry" type="button" @click="loadSection(activeSection)">重试</button>
      </div>

      <ol v-else class="curated-list">
        <li v-for="item in activeSection.items" :key="`${activeSection.period}-${item.link}`" class="curated-list__cell">
          <article class="curated-list__item">
            <a class="curated-list__title" :href="item.link" target="_blank" rel="noopener noreferrer">
              {{ item.title }}
            </a>

            <p class="curated-list__reason">
              <span>AI推荐理由</span>
              {{ item.ai_summary || item.raw_content }}
            </p>

            <footer class="curated-list__footer">
              <div v-if="item.ai_tags?.length" class="curated-list__tags">
                <span v-for="tag in item.ai_tags.slice(0, 3)" :key="`${item.link}-${tag}`" class="curated-list__tag">
                  {{ tag }}
                </span>
              </div>

              <div class="curated-list__byline">
                <span class="curated-list__source-time">
                  <span class="curated-list__source">
                    <img class="curated-list__source-icon" :src="sourceIcon(item)" :alt="sourceLabel(item)" />
                    <span>{{ sourceLabel(item) }}</span>
                  </span>
                  <time>{{ item.published_time || item.ingest_date }}</time>
                </span>
                <RatingStars class="curated-list__score" :score="item.ai_importance" />
              </div>
            </footer>
          </article>
        </li>
      </ol>
    </section>
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import { fetchCuratedNewsPayload } from '@/api/news'
  import RatingStars from '@/components/RatingStars/index.vue'
  import { CATEGORY_META } from '@/constants/news'
  import type { CuratedPeriod, NewsItem } from '@/types/news'

  type CuratedSection = {
    period: CuratedPeriod
    title: string
    subtitle: string
    badge: string
    limit: number
    loading: boolean
    error: string
    items: NewsItem[]
  }

  const emit = defineEmits<{
    loaded: []
  }>()

  const activePeriod = ref<CuratedPeriod>('today')

  const sections = ref<CuratedSection[]>([
    {
      period: 'today',
      title: '当日精选',
      subtitle: '今日 Top 20',
      badge: 'Today',
      limit: 20,
      loading: true,
      error: '',
      items: [],
    },
    // {
    //   period: 'week',
    //   title: '本周精选',
    //   subtitle: '近 7 日 Top 20',
    //   badge: 'This Week',
    //   limit: 20,
    //   loading: true,
    //   error: '',
    //   items: [],
    // },
  ])

  const activeSection = computed<CuratedSection>(() => {
    return sections.value.find((section) => section.period === activePeriod.value) ?? sections.value[0]!
  })

  const sourceMeta = (item: NewsItem) => CATEGORY_META[item.category]

  const sourceIcon = (item: NewsItem) => sourceMeta(item)?.icon ?? '/vite.svg'

  const sourceLabel = (item: NewsItem) => sourceMeta(item)?.subtitle ?? item.source ?? item.category

  const loadSection = async (section: CuratedSection) => {
    section.loading = true
    section.error = ''

    try {
      const result = await fetchCuratedNewsPayload({
        period: section.period,
        limit: section.limit,
        offset: 0,
      })
      section.items = result.items
    } catch (e) {
      section.error = e instanceof Error ? e.message : '未知错误'
      section.items = []
    } finally {
      section.loading = false
    }
  }

  const loadAll = async () => {
    await Promise.all(sections.value.map((section) => loadSection(section)))
    emit('loaded')
  }

  onMounted(loadAll)
</script>

<style scoped src="./index.scss" lang="scss"></style>
