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
    icon: 'https://www.v2ex.com/favicon.ico'
  },
  hacker_news: {
    label: 'Hacker News 热榜',
    subtitle: 'Hacker News',
    icon: 'https://news.ycombinator.com/favicon.ico',
  },
  openai: {
    label: 'OpenAI 官方动态',
    subtitle: 'OpenAI',
    icon: 'https://openai.com/favicon.ico'
  },
  google_ai: {
    label: 'Google AI 动态',
    subtitle: 'Google AI',
    icon: 'https://blog.google/favicon.ico'
  },
  hugging_face: {
    label: 'Hugging Face 动态',
    subtitle: 'Hugging Face',
    icon: 'https://huggingface.co/favicon.ico',
  },
  github: {
    label: 'GitHub Blog 动态',
    subtitle: 'GitHub',
    icon: 'https://github.com/favicon.ico'
  },
}
