import type { NewsPayload } from '@/types/news'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const fetchNewsPayload = async (): Promise<NewsPayload> => {
  const url = `${API_BASE_URL}/api/v1/news?limit=100`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`数据加载失败: ${response.status}`)
  }
  const result = await response.json()

  return result as NewsPayload
}
