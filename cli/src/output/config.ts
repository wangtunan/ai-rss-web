import type { CliConfig } from '../config'
import { getCliConfigPath } from '../config'

const maskSecret = (value: string): string => {
  if (!value) return ''
  if (value.length <= 8) return '********'
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

export const printConfig = (config: CliConfig): void => {
  console.log('AI RSS CLI config')
  console.log('')
  console.log(`Path: ${getCliConfigPath()}`)
  console.log(`mode: ${config.mode}`)
  console.log(`staticBaseUrl: ${config.staticBaseUrl || '(not set)'}`)
  console.log(`supabaseUrl: ${config.supabaseUrl || '(not set)'}`)
  console.log(`supabaseKey: ${maskSecret(config.supabaseKey) || '(not set)'}`)
  console.log(`defaultLimit: ${config.defaultLimit}`)
}
