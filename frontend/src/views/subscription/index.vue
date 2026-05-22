<template>
  <main ref="subscriptionPageRef" class="subscription-page">
    <!-- nav -->
    <SubscriptionNav
      :categories="subscribedCategories"
      :active-mode="activeMode"
      :active-category-id="activeCategoryId"
      @select-mixed="selectMixed"
      @select-category="selectCategory"
    />

    <!-- content -->
    <section class="subscription-page__content">
      <!-- header -->
      <SubscriptionHeader
        :eyebrow="headerEyebrow"
        :title="headerTitle"
        :has-subscriptions="Boolean(subscribedCategories.length)"
        :loading="loading"
        :feed-limit="feedLimit"
        :item-count="items.length"
        :items="items"
        :target-ref="subscriptionPageRef"
        @open-modal="openModal"
      />

      <!-- empty -->
      <SubscriptionEmpty v-if="!subscribedCategoryIds.length" @open-modal="openModal" />

      <!-- skeleton -->
      <CuratedCardSkeleton v-else-if="loading" :count="feedLimit" />

      <!-- error -->
      <CuratedCardError
        v-else-if="error"
        :message="error"
        @retry="loadFeed"
      />

      <!-- list -->
      <SubscriptionList
        v-else
        :items="items"
        :source-label="sourceLabel"
      />
    </section>

    <!-- modal -->
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
  import CuratedCardError from '@/components/CuratedCardError/index.vue'
  import CuratedCardSkeleton from '@/components/CuratedCardSkeleton/index.vue'
  import SubscriptionEmpty from '@/components/SubscriptionEmpty/index.vue'
  import SubscriptionHeader from '@/components/SubscriptionHeader/index.vue'
  import SubscriptionList from '@/components/SubscriptionList/index.vue'
  import SubscriptionModal from '@/components/SubscriptionModal/index.vue'
  import SubscriptionNav from '@/components/SubscriptionNav/index.vue'
  import { CATEGORY_META } from '@/constants/news'
  import { getSubscribedCategoryIds, setSubscribedCategoryIds } from '@/utils/subscription'
  import type { NewsItem, NewsListResponse } from '@/types/news'
  import type { SubscriptionCategory, SubscriptionFeedMode } from '@/types/subscription'

  const feedLimit = 20
  const subscribedCategoryIds = ref<string[]>([])
  const activeMode = ref<SubscriptionFeedMode>('mixed')
  const activeCategoryId = ref<string | null>(null)
  const items = ref<NewsItem[]>([])
  const subscriptionPageRef = ref<HTMLElement | null>(null)
  const loading = ref(false)
  const error = ref('')
  const showModal = ref(false)

  const subscribedCategories = computed<SubscriptionCategory[]>(() =>
    subscribedCategoryIds.value
      .map((key) => {
        const meta = CATEGORY_META[key]

        return meta ? { ...meta, key } : null
      })
      .filter((category): category is SubscriptionCategory => Boolean(category))
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

  const openModal = () => {
    showModal.value = true
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
