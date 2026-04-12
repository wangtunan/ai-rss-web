import type { NewsPayload } from '@/types/news'

export const fetchNewsPayload = async (): Promise<NewsPayload> => {
  const response = await fetch('/data.json', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`数据加载失败: ${response.status}`)
  }

  return (await response.json()) as NewsPayload
}
