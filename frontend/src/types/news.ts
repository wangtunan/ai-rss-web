import type { NewsCategory } from '@ai-rss/schema'
import type { NavType } from './nav'

export type {
  NewsCategory,
  NewsItem,
  NewsListRequest,
  NewsListResponse,
  NewsResponse,
} from '@ai-rss/schema'

/** 分类元信息 */
export interface CategoryMeta extends NewsCategory {
  /** 该分类属于哪些导航栏 */
  belong_to?: NavType[]
}
