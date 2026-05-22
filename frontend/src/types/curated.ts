import type { CuratedPeriod, NewsItem } from '@ai-rss/schema'

export type {
  CuratedNewsRequest,
  CuratedNewsResponse,
  CuratedPeriod,
} from '@ai-rss/schema'

/** 精选模块导航项 */
export interface CuratedNavItem {
  period: CuratedPeriod
  title: string
  subtitle: string
  badge: string
  limit: number
  items: unknown[]
}

/** 精选模块区域状态 */
export interface CuratedSection {
  period: CuratedPeriod
  title: string
  subtitle: string
  badge: string
  limit: number
  loading: boolean
  error: string
  items: NewsItem[]
}
