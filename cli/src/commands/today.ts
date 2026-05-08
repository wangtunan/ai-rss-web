import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerTodayCommand = (program: Command): void => {
  program
    .command('today')
    .description('show curated news for today')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--json', 'output raw JSON')
    .action(() => {
      printPendingCommand('today', 'M5 will connect this command to @ai-rss/client.')
    })
}
