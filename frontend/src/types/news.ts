/** 主题模式：暗色或亮色 */
export type ThemeMode = 'dark' | 'light'

/** 单条资讯数据 */
export interface NewsItem {
  /** 数据来源分类标识，例如 hacker_news / v2ex / openai */
  category: string
  /** 资讯标题 */
  title: string
  /** 原文链接地址 */
  link: string
  /** 发布时间 */
  published_time: string
  /** 原始内容（可能包含 HTML） */
  raw_content: string
  /** AI 生成的摘要文本 */
  ai_summary: string
  /** AI 生成的标签列表 */
  ai_tags: string[]
  /** AI 评估的重要度分值 */
  ai_importance: number
}

/** 资讯接口返回结构 */
export interface NewsResponse {
  /** 本批次数据更新时间 */
  last_updated: string
  /** 资讯列表 */
  items: NewsItem[]
}

/** 资讯列表接口请求结构 */
export interface NewsListRequest {
  /** 分类 */
  category?: string
  /** 来源 */
  source?: string
  /** 日期 */
  ingest_date?: string
  /** 每页条数 */
  limit?: number
  /** 偏移量 */
  offset?: number
}

/** 资讯列表接口返回结构 */
export interface NewsListResponse {
  /** 总条数 */
  total: number
  /** 每页条数 */
  limit: number
  /** 偏移量 */
  offset: number
  /** 资讯列表 */
  items: NewsItem[]
}

/** 分类显示元信息 */
export interface CategoryMeta {
  /** 分类中文标题 */
  label: string
  /** 分类副标题（通常是来源名） */
  subtitle: string
  /** 分类图标地址（通常使用对应官网 favicon） */
  icon: string
}

/** 页面展示用的分类数据结构 */
export interface CategoryView {
  /** 分类唯一键 */
  key: string
  /** 分类标题 */
  label: string
  /** 分类副标题 */
  subtitle: string
  /** 分类图标地址（通常使用对应官网 favicon） */
  icon: string
  /** 该分类下用于渲染的资讯列表 */
  items: NewsItem[]
}
