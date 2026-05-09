import type { Command } from 'commander'

import { loadCliConfig, parseConfigKey, parseConfigValue, setFileConfigValue } from '../config'
import { printConfig } from '../output/config'
import { printJson } from '../output/json'

export const registerConfigCommand = (program: Command): void => {
  const config = program.command('config').description('configure CLI display data source')

  config
    .command('get')
    .description('show CLI display configuration')
    .option('--json', 'output raw JSON')
    .action(async (_, command: Command) => {
      const cliConfig = await loadCliConfig()
      if (command.opts<{ json?: boolean }>().json || program.opts<{ json?: boolean }>().json) {
        printJson(cliConfig)
      } else {
        printConfig(cliConfig)
      }
    })

  config
    .command('set')
    .description('set a CLI display configuration value')
    .argument('<key>', 'configuration key')
    .argument('<value>', 'configuration value')
    .action(async (key: string, value: string) => {
      const configKey = parseConfigKey(key)
      const configValue = parseConfigValue(configKey, value)
      await setFileConfigValue(configKey, configValue)
      console.log(`Set ${configKey}.`)
    })
}
