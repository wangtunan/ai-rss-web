import type { NewsItem } from './news'
import { NavType } from './nav'

export interface CategoryMeta {
  label: string
  subtitle: string
  icon: string
  belong_to?: NavType[]
}

export interface CategoryView {
  key: string
  label: string
  subtitle: string
  icon: string
  items: NewsItem[]
}
