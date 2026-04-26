import type { CategoryMeta } from '@/types/news'
import { NavType } from '@/types/nav'

export const MAX_ITEMS_PER_CATEGORY = 10

export const SORT_CATEGORY_KEYS = [
  'openai', 'hugging_face', 'hacker_news',
  'v2ex', 'vue_blog', 'javascript_weekly', 'zaobao_china', 'google_ai', 'github'
]

export const CATEGORY_META: Record<string, CategoryMeta> = {
  v2ex: {
    label: 'V2EX 热帖',
    subtitle: 'V2EX',
    icon: 'v2ex.ico',
    belong_to: [NavType.Community]
  },
  hacker_news: {
    label: 'Hacker News 热榜',
    subtitle: 'Hacker News',
    icon: '/hacker_news.ico',
    belong_to: [NavType.Community]
  },
  openai: {
    label: 'OpenAI 官方动态',
    subtitle: 'OpenAI',
    icon: '/openai.ico',
    belong_to: [NavType.AI]
  },
  google_ai: {
    label: 'Google AI 动态',
    subtitle: 'Google AI',
    icon: '/google.ico',
    belong_to: [NavType.AI]
  },
  hugging_face: {
    label: 'Hugging Face 动态',
    subtitle: 'Hugging Face',
    icon: '/hugging_face.ico',
    belong_to: [NavType.AI]
  },
  github: {
    label: 'GitHub Blog 动态',
    subtitle: 'GitHub',
    icon: '/github.ico',
    belong_to: [NavType.Blog]
  },
  vue_blog: {
    label: 'Vue Blog 动态',
    subtitle: 'Vue Blog',
    icon: '/vue.ico',
    belong_to: [NavType.Blog]
  },
  javascript_weekly: {
    label: 'JavaScript Weekly 周刊',
    subtitle: 'JavaScript Weekly',
    icon: '/js_weekly.png',
    belong_to: [NavType.Blog]
  },
  zaobao_china: {
    label: '联合早报',
    subtitle: '联合早报',
    icon: '/zaobao_china.ico',
    belong_to: [NavType.News]
  }
}
