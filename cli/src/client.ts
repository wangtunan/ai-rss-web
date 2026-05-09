import { createNewsClient } from '@ai-rss/client'
import type { NewsClient } from '@ai-rss/client'

import { loadCliConfig } from './config'
import type { CliConfig } from './config'

export class CliConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CliConfigError'
  }
}

export interface CliClientContext {
  client: NewsClient
  config: CliConfig
}

export const createClientFromConfig = async (): Promise<CliClientContext> => {
  const config = await loadCliConfig()

  if (config.mode === 'static') {
    if (!config.staticBaseUrl) {
      throw new CliConfigError('staticBaseUrl is required. Run: ai-rss config set static-base-url <url>')
    }

    return {
      config,
      client: createNewsClient({
        mode: 'static',
        staticBaseUrl: config.staticBaseUrl,
      }),
    }
  }

  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new CliConfigError('supabaseUrl and supabaseKey are required for supabase mode.')
  }

  return {
    config,
    client: createNewsClient({
      mode: 'supabase',
      supabaseUrl: config.supabaseUrl,
      supabaseKey: config.supabaseKey,
    }),
  }
}
