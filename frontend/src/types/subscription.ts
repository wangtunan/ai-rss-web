import type { CategoryMeta } from './news'

/** 订阅聚合模式 */
export type SubscriptionFeedMode = 'mixed' | 'single'

/** 已订阅分类视图数据 */
export interface SubscriptionCategory extends CategoryMeta {
  /** 分类唯一键 */
  key: string
}
