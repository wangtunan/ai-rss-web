export interface RssSource {
  id: string
  category: string
  name: string
  url: string
  enabled: boolean
  sort_order: number
  max_entries: number | null
  created_at?: string
  updated_at?: string
}
