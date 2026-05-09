import type { Command } from 'commander'

import { createClientFromConfig } from '../client'
import { printJson } from '../output/json'
import { printNewsList } from '../output/news'
import { resolveJsonOption, resolveLimitOption } from './options'
import type { CategoryOption, CompactOption, JsonOption, LimitOption } from './options'

interface SearchOptions extends JsonOption, LimitOption, CategoryOption, CompactOption {}

export const registerSearchCommand = (program: Command): void => {
  program
    .command('search')
    .description('search news title, summary, source, and category')
    .argument('<keyword>', 'search keyword')
    .option('-c, --category <category>', 'filter by category')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--compact', 'show compact one-line news output')
    .option('--json', 'output raw JSON')
    .action(async (keyword: string, options: SearchOptions) => {
      const { client, config } = await createClientFromConfig()
      const limit = resolveLimitOption(options, config)
      const request = {
        keyword,
        limit,
      }
      const response = await client.searchNews(options.category ? { ...request, category: options.category } : request)

      if (resolveJsonOption(program, options)) {
        printJson(response)
      } else {
        printNewsList(response, options.category ? `Search: ${keyword} (${options.category})` : `Search: ${keyword}`, { compact: Boolean(options.compact) })
      }
    })
}
