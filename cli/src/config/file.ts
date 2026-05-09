import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { DEFAULT_CLI_CONFIG } from './defaults'
import { loadEnvConfig } from './env'
import { getCliConfigDir, getCliConfigPath } from './path'
import type { CliConfig, CliConfigFile, CliConfigKey } from './types'

const compactConfig = (config: CliConfigFile): CliConfigFile => {
  const compacted: CliConfigFile = {}

  if (config.mode !== undefined) compacted.mode = config.mode
  if (config.staticBaseUrl !== undefined) compacted.staticBaseUrl = config.staticBaseUrl
  if (config.supabaseUrl !== undefined) compacted.supabaseUrl = config.supabaseUrl
  if (config.supabaseKey !== undefined) compacted.supabaseKey = config.supabaseKey
  if (config.defaultLimit !== undefined) compacted.defaultLimit = config.defaultLimit

  return compacted
}

const parseConfigFile = (content: string): CliConfigFile => {
  const parsed = JSON.parse(content) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('CLI config file must contain a JSON object')
  }

  return compactConfig(parsed as CliConfigFile)
}

export const loadFileConfig = async (): Promise<CliConfigFile> => {
  try {
    const content = await readFile(getCliConfigPath(), 'utf8')
    return parseConfigFile(content)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return {}
    throw error
  }
}

export const loadCliConfig = async (): Promise<CliConfig> => {
  const fileConfig = await loadFileConfig()
  const envConfig = loadEnvConfig()

  return {
    ...DEFAULT_CLI_CONFIG,
    ...fileConfig,
    ...envConfig,
  }
}

export const saveFileConfig = async (config: CliConfigFile): Promise<void> => {
  await mkdir(getCliConfigDir(), { recursive: true })
  await writeFile(getCliConfigPath(), `${JSON.stringify(compactConfig(config), null, 2)}\n`, 'utf8')
}

export const setFileConfigValue = async <Key extends CliConfigKey>(key: Key, value: CliConfig[Key]): Promise<CliConfigFile> => {
  const config = await loadFileConfig()
  const nextConfig: CliConfigFile = {
    ...config,
    [key]: value,
  }

  await saveFileConfig(nextConfig)
  return nextConfig
}
