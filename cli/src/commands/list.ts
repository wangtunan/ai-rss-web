import type { Command } from 'commander'

import { createClientFromConfig } from '../client'
import { printJson } from '../output/json'
import { printNewsList } from '../output/news'
import { resolveJsonOption, resolveLimitOption } from './options'
import type { CategoryOption, CompactOption, JsonOption, LimitOption } from './options'

interface ListOptions extends JsonOption, LimitOption, CategoryOption, CompactOption {}

export const registerListCommand = (program: Command): void => {
  program
    .command('list')
    .description('show latest news')
    .option('-c, --category <category>', 'filter by category')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--compact', 'show compact one-line news output')
    .option('--json', 'output raw JSON')
    .action(async (options: ListOptions) => {
      const { client, config } = await createClientFromConfig()
      const limit = resolveLimitOption(options, config)
      const response = await client.getNewsList({
        category: options.category ?? 'all',
        limit,
      })

      if (resolveJsonOption(program, options)) {
        printJson(response)
      } else {
        printNewsList(response, options.category ? `Latest News: ${options.category}` : 'Latest News', { compact: Boolean(options.compact) })
      }
    })
}
