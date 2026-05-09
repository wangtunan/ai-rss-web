import type { Command } from 'commander'

import { createClientFromConfig } from '../client'
import { printJson } from '../output/json'
import { printNewsList } from '../output/news'
import { resolveJsonOption, resolveLimitOption } from './options'
import type { CompactOption, JsonOption, LimitOption } from './options'

interface TodayOptions extends JsonOption, LimitOption, CompactOption {}

export const registerTodayCommand = (program: Command): void => {
  program
    .command('today')
    .description('show curated news for today')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--compact', 'show compact one-line news output')
    .option('--json', 'output raw JSON')
    .action(async (options: TodayOptions) => {
      const { client, config } = await createClientFromConfig()
      const limit = resolveLimitOption(options, config)
      const response = await client.getTodayNews({ limit })

      if (resolveJsonOption(program, options)) {
        printJson(response)
      } else {
        printNewsList(response, 'Today', { compact: Boolean(options.compact) })
      }
    })
}
