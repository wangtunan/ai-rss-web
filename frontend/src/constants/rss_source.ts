import type { RssSourceStatusOption } from '@/types/rss_source'

export const RSS_SOURCE_PAGE_SIZES = [10, 20, 50]

export const DEFAULT_RSS_SOURCE_PAGE_SIZE = 10

export const RSS_SOURCE_STATUS_OPTIONS: RssSourceStatusOption[] = [
  { label: '全部', value: 'all' },
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
]
