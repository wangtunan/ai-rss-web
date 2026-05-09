import type { CliConfigFile } from './types'

const readEnvString = (name: string): string | undefined => {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

const readEnvNumber = (name: string): number | undefined => {
  const rawValue = readEnvString(name)
  if (!rawValue) return undefined

  const value = Number(rawValue)
  return Number.isFinite(value) ? value : undefined
}

export const loadEnvConfig = (): CliConfigFile => {
  const config: CliConfigFile = {}
  const mode = readEnvString('AI_RSS_DATA_MODE')

  if (mode === 'static' || mode === 'supabase') config.mode = mode

  const staticBaseUrl = readEnvString('AI_RSS_STATIC_BASE_URL')
  if (staticBaseUrl) config.staticBaseUrl = staticBaseUrl

  const supabaseUrl = readEnvString('AI_RSS_SUPABASE_URL')
  if (supabaseUrl) config.supabaseUrl = supabaseUrl

  const supabaseKey = readEnvString('AI_RSS_SUPABASE_KEY')
  if (supabaseKey) config.supabaseKey = supabaseKey

  const defaultLimit = readEnvNumber('AI_RSS_DEFAULT_LIMIT')
  if (defaultLimit !== undefined) config.defaultLimit = defaultLimit

  return config
}
