export type CuratedPeriod = 'today' | 'week'

export interface NewsItem {
  id?: number
  source?: string
  category: string
  title: string
  link: string
  published_time: string
  raw_content?: string
  ai_summary: string
  ai_tags: string[]
  ai_importance: number
  ingest_date?: string
}