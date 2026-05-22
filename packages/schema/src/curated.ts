import type { NewsItem } from './news'

/** 分类显示元信息 */
export type CuratedPeriod = 'today' | 'week'

/** 精选资讯请求结构 */
export interface CuratedNewsRequest {
  /** 时间范围 */
  period: CuratedPeriod
  /** 每页条数 */
  limit?: number
  /** 偏移量 */
  offset?: number
}

/** 精选资讯返回结构 */
export interface CuratedNewsResponse {
  /** 时间范围 */
  period: CuratedPeriod
  /** 总条数 */
  total: number
  /** 每页条数 */
  limit: number
  /** 偏移量 */
  offset: number
  /** 资讯列表 */
  items: NewsItem[]
}
