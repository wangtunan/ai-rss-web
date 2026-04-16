import type { CategoryMeta } from '@/types/news'

export const MAX_ITEMS_PER_CATEGORY = 10

export const SORT_CATEGORY_KEYS = [
  'openai', 'hugging_face', 'google_ai',
  'v2ex', 'hacker_news', 'github'
]

export const CATEGORY_META: Record<string, CategoryMeta> = {
  v2ex: {
    label: 'V2EX 热帖',
    subtitle: 'V2EX',
    icon: 'v2ex.ico'
  },
  hacker_news: {
    label: 'Hacker News 热榜',
    subtitle: 'Hacker News',
    icon: '/hacker_news.ico',
  },
  openai: {
    label: 'OpenAI 官方动态',
    subtitle: 'OpenAI',
    icon: '/openai.ico'
  },
  google_ai: {
    label: 'Google AI 动态',
    subtitle: 'Google AI',
    icon: '/google.ico'
  },
  hugging_face: {
    label: 'Hugging Face 动态',
    subtitle: 'Hugging Face',
    icon: '/hugging_face.ico',
  },
  github: {
    label: 'GitHub Blog 动态',
    subtitle: 'GitHub',
    icon: '/github.ico'
  },
}
