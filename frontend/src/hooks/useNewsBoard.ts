import { computed, ref } from 'vue'

import { fetchNewsPayload } from '@/api/news'
import { CATEGORY_META, MAX_ITEMS_PER_CATEGORY, SORT_CATEGORY_KEYS } from '@/constants/news'
import type { CategoryView, NewsItem, NewsPayload } from '@/types/news'

export const useNewsBoard = () => {
  const payload = ref<NewsPayload | null>(null)
  const loading = ref(true)
  const errorMessage = ref('')

  const groupedCategories = computed<CategoryView[]>(() => {
    if (!payload.value) return []

    const grouped = payload.value.items.reduce<Record<string, NewsItem[]>>((acc, item) => {
      const bucket = acc[item.category] ?? []
      bucket.push(item)
      acc[item.category] = bucket
      return acc
    }, {})

    const orderMap = new Map(SORT_CATEGORY_KEYS.map((key, index) => [key, index]))

    return Object.entries(grouped)
      .map(([key, items]) => {
        const meta = CATEGORY_META[key] ?? {
          label: key.replaceAll('_', ' '),
          subtitle: 'News Feed',
          icon: '/vite.svg',
        }
        const sortedItems = [...items].sort((a, b) => b.ai_importance - a.ai_importance)
        return {
          key,
          label: meta.label,
          subtitle: meta.subtitle,
          icon: meta.icon,
          items: sortedItems.slice(0, MAX_ITEMS_PER_CATEGORY),
        }
      })
      .sort((a, b) => {
        const aOrder = orderMap.get(a.key) ?? Number.MAX_SAFE_INTEGER
        const bOrder = orderMap.get(b.key) ?? Number.MAX_SAFE_INTEGER
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }
        return a.key.localeCompare(b.key)
      })
  })

  const lastUpdatedLabel = computed(() => payload.value?.last_updated ?? '--')

  const loadNews = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      payload.value = await fetchNewsPayload()
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMessage,
    groupedCategories,
    lastUpdatedLabel,
    loadNews,
  }
}
