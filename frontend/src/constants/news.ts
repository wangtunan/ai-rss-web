import type { CategoryMeta } from '@/types/news'
import { NavType } from '@/types/nav'

export const MAX_ITEMS_PER_CATEGORY = 10

// AI 分类元信息
export const AI_CATEGORY_META: Record<string, CategoryMeta> = {
  openai: {
    label: 'OpenAI 官方动态',
    subtitle: 'OpenAI',
    icon: '/openai.ico',
    belong_to: [NavType.AI]
  },
  hugging_face: {
    label: 'Hugging Face 动态',
    subtitle: 'Hugging Face',
    icon: '/hugging_face.ico',
    belong_to: [NavType.AI]
  },
  google_ai: {
    label: 'Google AI 动态',
    subtitle: 'Google AI',
    icon: '/google.ico',
    belong_to: [NavType.AI]
  },
}

// 社区分类元信息
export const COMMUNITY_CATEGORY_META: Record<string, CategoryMeta> = {
  hacker_news: {
    label: 'Hacker News 热榜',
    subtitle: 'Hacker News',
    icon: '/hacker_news.ico',
    belong_to: [NavType.Community]
  },
  v2ex: {
    label: 'V2EX 热帖',
    subtitle: 'V2EX',
    icon: 'v2ex.ico',
    belong_to: [NavType.Community]
  },
  juejin: {
    label: '掘金',
    subtitle: '掘金',
    icon: '/juejin.png',
    belong_to: [NavType.Community]
  },
}

// 博客分类元信息
export const BLOG_CATEGORY_META: Record<string, CategoryMeta> = {
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
}

// 新闻分类元信息
export const NEWS_CATEGORY_META: Record<string, CategoryMeta> = {
  infoq: {
    label: 'InfoQ',
    subtitle: 'InfoQ',
    icon: '/infoq.webp',
    belong_to: [NavType.News]
  },
  wsj: {
    label: '华尔街日报',
    subtitle: '华尔街日报',
    icon: '/wsj.png',
    belong_to: [NavType.News]
  },
  zaobao_china: {
    label: '联合早报',
    subtitle: '联合早报',
    icon: '/zaobao_china.ico',
    belong_to: [NavType.News]
  },
  '36kr': {
    label: '36氪',
    subtitle: '36氪',
    icon: '/36kr.ico',
    belong_to: [NavType.News]
  }
}

// 财经分类元信息
export const FINANCE_CATEGORY_META: Record<string, CategoryMeta> = {
  xueqiu: {
    label: '雪球',
    subtitle: '雪球',
    icon: '/xueqiu.ico',
    belong_to: [NavType.Finance]
  },
  "36kr": {
    label: '36氪',
    subtitle: '36氪',
    icon: '/36kr.ico',
    belong_to: [NavType.Finance]
  },
  cls: {
    label: '财联社',
    subtitle: '财联社',
    icon: '/cls.png',
    belong_to: [NavType.Finance]
  },
}

// 所有分类元信息
export const CATEGORY_META: Record<string, CategoryMeta> = {
  ...AI_CATEGORY_META,
  ...COMMUNITY_CATEGORY_META,
  ...BLOG_CATEGORY_META,
  ...NEWS_CATEGORY_META,
  ...FINANCE_CATEGORY_META,
}

// 排序分类键
export const SORT_CATEGORY_KEYS = Object.keys(CATEGORY_META)
