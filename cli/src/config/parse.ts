import type { DataMode } from '@ai-rss/schema'

import type { CliConfig, CliConfigKey } from './types'

const CONFIG_KEY_ALIASES: Record<string, CliConfigKey> = {
  mode: 'mode',
  'data-mode': 'mode',
  staticBaseUrl: 'staticBaseUrl',
  'static-base-url': 'staticBaseUrl',
  supabaseUrl: 'supabaseUrl',
  'supabase-url': 'supabaseUrl',
  supabaseKey: 'supabaseKey',
  'supabase-key': 'supabaseKey',
  defaultLimit: 'defaultLimit',
  'default-limit': 'defaultLimit',
}

export const parseConfigKey = (key: string): CliConfigKey => {
  const configKey = CONFIG_KEY_ALIASES[key]
  if (!configKey) {
    const keys = Object.keys(CONFIG_KEY_ALIASES).sort().join(', ')
    throw new Error(`Unknown config key "${key}". Supported keys: ${keys}`)
  }

  return configKey
}

const parseDataMode = (value: string): DataMode => {
  if (value === 'static' || value === 'supabase') return value
  throw new Error('mode must be "static" or "supabase"')
}

const parseDefaultLimit = (value: string): number => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error('defaultLimit must be a positive integer')
  return parsed
}

export const parseConfigValue = <Key extends CliConfigKey>(key: Key, value: string): CliConfig[Key] => {
  if (key === 'mode') return parseDataMode(value) as CliConfig[Key]
  if (key === 'defaultLimit') return parseDefaultLimit(value) as CliConfig[Key]
  return value as CliConfig[Key]
}
