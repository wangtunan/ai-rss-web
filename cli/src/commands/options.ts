import type { Command } from 'commander'

import type { CliConfig } from '../config'

export interface JsonOption {
  json?: boolean
}

export interface LimitOption {
  limit?: string
}

export interface CategoryOption {
  category?: string
}

export interface CompactOption {
  compact?: boolean
}

export const resolveJsonOption = (command: Command, options: JsonOption): boolean => {
  return Boolean(options.json || command.opts<{ json?: boolean }>().json || command.parent?.opts<{ json?: boolean }>().json)
}

export const resolveLimitOption = (options: LimitOption, config: CliConfig): number => {
  if (options.limit === undefined) return config.defaultLimit

  const limit = Number(options.limit)
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error('limit must be a positive integer')
  }

  return limit
}
