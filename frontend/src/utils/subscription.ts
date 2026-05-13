import { CATEGORY_META } from '@/constants/news'

const SUBSCRIPTION_STORAGE_KEY = 'ai-rss-web:subscribed-categories'

export const normalizeSubscribedCategoryIds = (ids: string[]) => {
  const validIds = new Set(Object.keys(CATEGORY_META))

  return Array.from(new Set(ids)).filter((id) => validIds.has(id))
}

export const getSubscribedCategoryIds = () => {
  try {
    const value = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    if (!value) {
      return []
    }

    const ids = JSON.parse(value)
    if (!Array.isArray(ids)) {
      return []
    }

    return normalizeSubscribedCategoryIds(ids.filter((id): id is string => typeof id === 'string'))
  } catch {
    return []
  }
}

export const setSubscribedCategoryIds = (ids: string[]) => {
  const normalizedIds = normalizeSubscribedCategoryIds(ids)
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(normalizedIds))

  return normalizedIds
}
