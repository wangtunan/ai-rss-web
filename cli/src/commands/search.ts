import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerSearchCommand = (program: Command): void => {
  program
    .command('search')
    .description('search news title, summary, source, and category')
    .argument('<keyword>', 'search keyword')
    .option('-c, --category <category>', 'filter by category')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--json', 'output raw JSON')
    .action(() => {
      printPendingCommand('search', 'M5 will connect this command to @ai-rss/client.')
    })
}
