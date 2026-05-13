<template>
  <main ref="subscriptionPageRef" class="subscription-page">
    <aside class="subscription-menu">
      <header class="subscription-menu__header">
        <p class="subscription-menu__eyebrow">Subscription</p>
        <h2 class="subscription-menu__title">我的订阅</h2>
      </header>

      <nav v-if="subscribedCategories.length" class="subscription-menu__nav">
        <button
          type="button"
          class="subscription-menu__nav-item"
          :class="{ 'subscription-menu__nav-item--active': activeMode === 'mixed' }"
          @click="selectMixed"
        >
          <span class="subscription-menu__nav-main">
            <span class="subscription-menu__nav-title">全部订阅</span>
            <span class="subscription-menu__nav-subtitle">聚合所有已订阅分类</span>
          </span>
          <span class="subscription-menu__nav-count">{{ subscribedCategories.length }}</span>
        </button>

        <button
          v-for="category in subscribedCategories"
          :key="category.key"
          type="button"
          class="subscription-menu__nav-item"
          :class="{
            'subscription-menu__nav-item--active': activeMode === 'single' && activeCategoryId === category.key,
          }"
          @click="selectCategory(category.key)"
        >
          <img
            class="subscription-menu__nav-icon"
            :src="category.icon"
            :alt="category.label"
          />
          <span class="subscription-menu__nav-title">{{ category.label }}</span>
        </button>
      </nav>
    </aside>

    <section class="subscription-page__content">
      <header class="subscription-header">
        <div class="subscription-header__left">
          <p class="subscription-header__eyebrow">{{ headerEyebrow }}</p>
          <h2 class="subscription-header__title">{{ headerTitle }}</h2>
        </div>
        <div class="subscription-header__actions">
          <span v-if="subscribedCategories.length" class="subscription-header__count">
            {{ loading ? feedLimit : items.length }} 条
          </span>
          <ShareAction
            :disabled="loading"
            :items="items"
            :target-ref="subscriptionPageRef"
          />
          <button
            class="subscription-header__button"
            type="button"
            title="管理订阅"
            aria-label="管理订阅"
            @click="showModal = true"
          >
            <svg
              class="subscription-header__button-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </header>

      <section v-if="!subscribedCategoryIds.length" class="subscription-empty">
        <p class="subscription-empty__title">还没有订阅任何分类</p>
        <p class="subscription-empty__description">选择你感兴趣的分类后，这里会展示聚合资讯流。</p>
        <button class="subscription-empty__button" type="button" @click="showModal = true">
          去订阅
        </button>
      </section>

      <CuratedCardSkeleton v-else-if="loading" :count="feedLimit" />

      <CuratedCardError
        v-else-if="error"
        :message="error"
        @retry="loadFeed"
      />

      <ol v-else class="subscription-list">
        <li
          v-for="item in items"
          :key="item.link"
          class="subscription-list__cell"
        >
          <CuratedCard
            :item="item"
            :source-label="sourceLabel(item)"
          />
        </li>
      </ol>
    </section>

    <SubscriptionModal
      v-if="showModal"
      :selected-ids="subscribedCategoryIds"
      @close="showModal = false"
      @save="saveSubscriptions"
    />
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'

  import { fetchNewsListPayload } from '@/api/news'
  import CuratedCard from '@/components/CuratedCard/index.vue'
  import CuratedCardError from '@/components/CuratedCardError/index.vue'
  import CuratedCardSkeleton from '@/components/CuratedCardSkeleton/index.vue'
  import ShareAction from '@/components/ShareAction/index.vue'
  import { CATEGORY_META } from '@/constants/news'
  import type { NewsItem, NewsListResponse } from '@/types/news'
  import { getSubscribedCategoryIds, setSubscribedCategoryIds } from '@/utils/subscription'

  import SubscriptionModal from './components/SubscriptionModal.vue'

  type FeedMode = 'mixed' | 'single'

  const feedLimit = 20
  const subscribedCategoryIds = ref<string[]>([])
  const activeMode = ref<FeedMode>('mixed')
  const activeCategoryId = ref<string | null>(null)
  const items = ref<NewsItem[]>([])
  const subscriptionPageRef = ref<HTMLElement | null>(null)
  const loading = ref(false)
  const error = ref('')
  const showModal = ref(false)

  const subscribedCategories = computed(() =>
    subscribedCategoryIds.value.map((key) => ({ key, ...CATEGORY_META[key] })).filter((category) => category.label)
  )

  const activeCategory = computed(() =>
    activeCategoryId.value ? CATEGORY_META[activeCategoryId.value] : null
  )

  const headerEyebrow = computed(() => (activeMode.value === 'mixed' ? 'All Subscriptions' : 'Category'))
  const headerTitle = computed(() => {
    if (!subscribedCategoryIds.value.length) {
      return '我的订阅'
    }

    if (activeMode.value === 'single' && activeCategory.value) {
      return activeCategory.value.label
    }

    return '全部订阅'
  })

  const sourceLabel = (item: NewsItem) => CATEGORY_META[item.category]?.subtitle ?? item.source ?? item.category

  const dedupeAndSortItems = (newsItems: NewsItem[]) => {
    const itemMap = new Map<string, NewsItem>()

    newsItems.forEach((item) => {
      itemMap.set(item.link || `${item.category}-${item.title}`, item)
    })

    return Array.from(itemMap.values()).sort(
      (a, b) => new Date(b.published_time || b.ingest_date || '').getTime() - new Date(a.published_time || a.ingest_date || '').getTime()
    )
  }

  const loadSingleFeed = async (category: string) => {
    const result = await fetchNewsListPayload({ category, limit: feedLimit, offset: 0 })
    items.value = result.items
  }

  const loadMixedFeed = async () => {
    const results = await Promise.allSettled(
      subscribedCategoryIds.value.map((category) => fetchNewsListPayload({ category, limit: feedLimit, offset: 0 }))
    )
    const fulfilledResults = results.filter(
      (result): result is PromiseFulfilledResult<NewsListResponse> => result.status === 'fulfilled'
    )

    if (!fulfilledResults.length) {
      throw new Error('订阅内容加载失败')
    }

    items.value = dedupeAndSortItems(fulfilledResults.flatMap((result) => result.value.items))
  }

  const loadFeed = async () => {
    if (!subscribedCategoryIds.value.length) {
      items.value = []
      error.value = ''
      loading.value = false
      return
    }

    loading.value = true
    error.value = ''

    try {
      if (activeMode.value === 'single' && activeCategoryId.value) {
        await loadSingleFeed(activeCategoryId.value)
      } else {
        await loadMixedFeed()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const selectMixed = () => {
    activeMode.value = 'mixed'
    activeCategoryId.value = null
  }

  const selectCategory = (category: string) => {
    activeMode.value = 'single'
    activeCategoryId.value = category
  }

  const saveSubscriptions = (ids: string[]) => {
    subscribedCategoryIds.value = setSubscribedCategoryIds(ids)
    showModal.value = false

    if (!subscribedCategoryIds.value.length) {
      selectMixed()
      items.value = []
      return
    }

    if (activeCategoryId.value && !subscribedCategoryIds.value.includes(activeCategoryId.value)) {
      selectMixed()
    }
  }

  onMounted(() => {
    subscribedCategoryIds.value = getSubscribedCategoryIds()
  })

  watch([subscribedCategoryIds, activeMode, activeCategoryId], loadFeed)
</script>

<style scoped src="./index.scss" lang="scss"></style>
