import type { Component } from 'vue'

export interface RssSource {
  /** RSS 源唯一标识 */
  id: string
  /** RSS 源所属分类 */
  category: string
  /** RSS 源展示名称 */
  name: string
  /** RSS 订阅地址 */
  url: string
  /** 是否启用抓取 */
  enabled: boolean
  /** 页面和抓取使用的排序值 */
  sort_order: number
  /** 单个 RSS 源抓取条数上限 */
  max_entries: number | null
  /** 记录创建时间 */
  created_at?: string
  /** 记录更新时间 */
  updated_at?: string
}

export type RssSourceInput = Omit<RssSource, 'id' | 'created_at' | 'updated_at'>

export type RssSourceStatusFilter = 'all' | 'enabled' | 'disabled'

export interface RssSourceStatusOption {
  /** 筛选项展示文案 */
  label: string
  /** 筛选项状态值 */
  value: RssSourceStatusFilter
}

export type RssSourceMetricKey = 'total' | 'enabled' | 'disabled' | 'visible'

export interface RssSourceMetric {
  /** 指标唯一标识，用于绑定颜色和渲染 key */
  key: RssSourceMetricKey
  /** 指标展示文案 */
  label: string
  /** 指标数值 */
  value: number
  /** 指标装饰图标组件 */
  icon: Component
}
