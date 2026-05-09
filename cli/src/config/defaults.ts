import type { CliConfig } from './types'

export const DEFAULT_CLI_CONFIG: CliConfig = {
  mode: 'static',
  staticBaseUrl: '',
  supabaseUrl: '',
  supabaseKey: '',
  defaultLimit: 20,
}

export const CLI_CONFIG_DIR_NAME = '.ai-rss'
export const CLI_CONFIG_FILE_NAME = 'config.json'
