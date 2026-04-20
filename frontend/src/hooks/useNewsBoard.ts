import { computed, ref } from 'vue'

import { CATEGORY_META, SORT_CATEGORY_KEYS } from '@/constants/news'

export type CategoryCardConfig = {
  key: string
  label: string
  subtitle: string
  icon: string
}

export const useNewsBoard = () => {
  const lastUpdated = ref('--')
  const categories = computed<CategoryCardConfig[]>(() =>
    SORT_CATEGORY_KEYS.map((key) => {
      const meta = CATEGORY_META[key] ?? {
        label: key.replaceAll('_', ' '),
        subtitle: 'News Feed',
        icon: '/vite.svg',
      }
      return {
        key,
        label: meta.label,
        subtitle: meta.subtitle,
        icon: meta.icon,
      }
    }),
  )

  const lastUpdatedLabel = computed(() => lastUpdated.value)

  const markUpdatedNow = () => {
    lastUpdated.value = new Date().toLocaleString('zh-CN', { hour12: false })
  }

  return {
    categories,
    lastUpdatedLabel,
    markUpdatedNow,
  }
}
