import type { NewsClient, NewsClientOptions } from '../types'
import { UnsupportedDataModeError } from '../errors'
import { createStaticNewsClient } from '../static'

export const createNewsClient = (options: NewsClientOptions): NewsClient => {
  if (options.mode === 'static') return createStaticNewsClient(options)
  if (options.mode === 'supabase') throw new UnsupportedDataModeError(options.mode)
  throw new UnsupportedDataModeError(String((options as { mode?: unknown }).mode))
}
