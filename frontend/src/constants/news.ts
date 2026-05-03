import type { CategoryMeta } from '@/types/news'
import { NavType } from '@/types/nav'

export const MAX_ITEMS_PER_CATEGORY = 10

// AI 分类元信息
export const AI_CATEGORY_META: Record<string, CategoryMeta> = {
  openai: {
    label: 'OpenAI 官方动态',
    subtitle: 'OpenAI',
    icon: '/logo/openai.ico',
    belong_to: [NavType.AI],
  },
  hugging_face: {
    label: 'Hugging Face 动态',
    subtitle: 'Hugging Face',
    icon: '/logo/hugging_face.ico',
    belong_to: [NavType.AI],
  },
  anthropic: {
    label: 'Anthropic 动态',
    subtitle: 'Anthropic',
    icon: '/logo/anthropic.png',
    belong_to: [NavType.AI],
  },
  google_ai: {
    label: 'Google AI 动态',
    subtitle: 'Google AI',
    icon: '/logo/google.ico',
    belong_to: [NavType.AI],
  },
  mit_technology_ai: {
    label: 'MIT Technology Review AI',
    subtitle: 'MIT Technology Review',
    icon: '/logo/mit.png',
    belong_to: [NavType.AI],
  },
  the_decoder: {
    label: 'The Decoder',
    subtitle: 'The Decoder',
    icon: '/logo/decoder.png',
    belong_to: [NavType.AI],
  }
}

// Community 分类元信息
export const COMMUNITY_CATEGORY_META: Record<string, CategoryMeta> = {
  hacker_news: {
    label: 'Hacker News 热榜',
    subtitle: 'Hacker News',
    icon: '/logo/hacker_news.ico',
    belong_to: [NavType.Community],
  },
  v2ex: {
    label: 'V2EX 热帖',
    subtitle: 'V2EX',
    icon: '/logo/v2ex.ico',
    belong_to: [NavType.Community],
  },
  juejin: {
    label: '掘金',
    subtitle: '掘金',
    icon: '/logo/juejin.png',
    belong_to: [NavType.Community],
  },
}

// Blog 分类元信息
export const BLOG_CATEGORY_META: Record<string, CategoryMeta> = {
  stackoverflow_blog: {
    label: 'Stack Overflow Blog',
    subtitle: 'Stack Overflow',
    icon: '/logo/stackoverflow.png',
    belong_to: [NavType.Blog],
  },
  github: {
    label: 'GitHub Blog 动态',
    subtitle: 'GitHub',
    icon: '/logo/github.ico',
    belong_to: [NavType.Blog],
  },
  javascript_weekly: {
    label: 'JavaScript Weekly 周刊',
    subtitle: 'JavaScript Weekly',
    icon: '/logo/js_weekly.png',
    belong_to: [NavType.Blog],
  },
}

// 国内新闻 分类元信息
export const INNER_NEWS_CATEGORY_META: Record<string, CategoryMeta> = {
  chinanews: {
    label: '中国新闻网',
    subtitle: '中国新闻网',
    icon: '/logo/chinanews.png',
    belong_to: [NavType.InnerNews],
  },
  infoq: {
    label: 'InfoQ',
    subtitle: 'InfoQ',
    icon: '/logo/infoq.webp',
    belong_to: [NavType.InnerNews],
  },
  zaobao_china: {
    label: '联合早报',
    subtitle: '联合早报',
    icon: '/logo/zaobao_china.ico',
    belong_to: [NavType.InnerNews],
  }
}

// 海外新闻 分类元信息
export const OUTER_NEWS_CATEGORY_META: Record<string, CategoryMeta> = {
  reuters: {
    label: '路透社',
    subtitle: '路透社',
    icon: '/logo/reuters.png',
    belong_to: [NavType.OuterNews],
  },
  bbc_news: {
    label: 'BBC News',
    subtitle: 'BBC News',
    icon: '/logo/bbs.png',
    belong_to: [NavType.OuterNews],
  },
  wsj: {
    label: '华尔街见闻',
    subtitle: '华尔街见闻',
    icon: '/logo/wsj.png',
    belong_to: [NavType.OuterNews],
  },
  ft_chinese: {
    label: 'Financial Times 中文网',
    subtitle: 'FT 中文网',
    icon: '/logo/ft.png',
    belong_to: [NavType.OuterNews],
  },
}

// Finance 分类元信息
export const FINANCE_CATEGORY_META: Record<string, CategoryMeta> = {
  cls: {
    label: '财联社',
    subtitle: '财联社',
    icon: '/logo/cls.png',
    belong_to: [NavType.Finance],
  },
  xueqiu: {
    label: '雪球',
    subtitle: '雪球',
    icon: '/logo/xueqiu.ico',
    belong_to: [NavType.Finance],
  },
  '36kr': {
    label: '36氪',
    subtitle: '36氪',
    icon: '/logo/36kr.ico',
    belong_to: [NavType.Finance],
  },
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  ...AI_CATEGORY_META,
  ...COMMUNITY_CATEGORY_META,
  ...BLOG_CATEGORY_META,
  ...INNER_NEWS_CATEGORY_META,
  ...OUTER_NEWS_CATEGORY_META,
  ...FINANCE_CATEGORY_META,
}

export const SORT_CATEGORY_KEYS = Object.keys(CATEGORY_META)