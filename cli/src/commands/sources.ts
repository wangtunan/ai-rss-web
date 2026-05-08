import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerSourcesCommand = (program: Command): void => {
  program
    .command('sources')
    .description('show read-only news source metadata')
    .option('-c, --category <category>', 'filter by category')
    .option('--json', 'output raw JSON')
    .action(() => {
      printPendingCommand('sources', 'M5 will connect this read-only command to @ai-rss/client.')
    })
}
