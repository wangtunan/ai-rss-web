import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerListCommand = (program: Command): void => {
  program
    .command('list')
    .description('show latest news')
    .option('-c, --category <category>', 'filter by category')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--json', 'output raw JSON')
    .action(() => {
      printPendingCommand('list', 'M5 will connect this command to @ai-rss/client.')
    })
}
