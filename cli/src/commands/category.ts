import type { Command } from 'commander'

import { createClientFromConfig } from '../client'
import { printJson } from '../output/json'
import { printNewsList } from '../output/news'
import { resolveJsonOption, resolveLimitOption } from './options'
import type { CompactOption, JsonOption, LimitOption } from './options'

interface CategoryOptions extends JsonOption, LimitOption, CompactOption {}

export const registerCategoryCommand = (program: Command): void => {
  program
    .command('category')
    .description('show news from a category')
    .argument('<category>', 'category key')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--compact', 'show compact one-line news output')
    .option('--json', 'output raw JSON')
    .action(async (category: string, options: CategoryOptions) => {
      const { client, config } = await createClientFromConfig()
      const limit = resolveLimitOption(options, config)
      const response = await client.getCategoryNews(category, { limit })

      if (resolveJsonOption(program, options)) {
        printJson(response)
      } else {
        printNewsList(response, `Category: ${category}`, { compact: Boolean(options.compact) })
      }
    })
}
