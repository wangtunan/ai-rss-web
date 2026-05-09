import type { DataMode } from '@ai-rss/schema'

export interface CliConfig {
  mode: DataMode
  staticBaseUrl: string
  supabaseUrl: string
  supabaseKey: string
  defaultLimit: number
}

export type CliConfigKey = keyof CliConfig

export interface CliConfigFile {
  mode?: DataMode
  staticBaseUrl?: string
  supabaseUrl?: string
  supabaseKey?: string
  defaultLimit?: number
}
