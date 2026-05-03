import { supabase } from '@/utils/supabase'

import type { RssSource, RssSourceInput } from '@/types/rss_source'

const RSS_SOURCES_TABLE = 'rss_sources'


// 获取所有 RSS 源
export const fetchRssSources = async (): Promise<RssSource[]> => {
  const { data, error } = await supabase
    .from(RSS_SOURCES_TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(`加载 RSS 源失败：${error.message}`)

  return data ?? []
}

// 创建 RSS 源
export const createRssSource = async (payload: RssSourceInput): Promise<RssSource> => {
  const { data, error } = await supabase
    .from(RSS_SOURCES_TABLE)
    .insert(payload)
    .select('*')
    .maybeSingle()

  if (error) throw new Error(`创建 RSS 源失败：${error.message}`)
  if (!data) throw new Error('创建 RSS 源失败：没有返回新建记录')

  return data
}

// 更新 RSS 源
export const updateRssSource = async (id: string, payload: Partial<RssSourceInput>): Promise<void> => {
  const { count, error } = await supabase
    .from(RSS_SOURCES_TABLE)
    .update(payload)
    .eq('id', id)
    .select('id')

  if (error) throw new Error(`更新 RSS 源失败：${error.message}`)
  if (count === 0) throw new Error('更新 RSS 源失败：没有记录被更新，请检查记录是否存在或 Supabase UPDATE 策略')
}


// 删除 RSS 源
export const deleteRssSource = async (id: string): Promise<void> => {
  const { error } = await supabase.from(RSS_SOURCES_TABLE).delete().eq('id', id)

  if (error) throw new Error(`删除 RSS 源失败：${error.message}`)
}
