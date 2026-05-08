import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerCategoryCommand = (program: Command): void => {
  program
    .command('category')
    .description('show news from a category')
    .argument('<category>', 'category key')
    .option('-l, --limit <number>', 'maximum number of items to show')
    .option('--json', 'output raw JSON')
    .action(() => {
      printPendingCommand('category', 'M5 will connect this command to @ai-rss/client.')
    })
}
