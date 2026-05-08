import type { Command } from 'commander'

import { printPendingCommand } from '../output/pending'

export const registerConfigCommand = (program: Command): void => {
  const config = program.command('config').description('configure CLI display data source')

  config
    .command('get')
    .description('show CLI display configuration')
    .action(() => {
      printPendingCommand('config get', 'M4 will add read-only data source configuration.')
    })

  config
    .command('set')
    .description('set a CLI display configuration value')
    .argument('<key>', 'configuration key')
    .argument('<value>', 'configuration value')
    .action(() => {
      printPendingCommand('config set', 'M4 will add read-only data source configuration.')
    })
}
