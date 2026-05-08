import { Command } from 'commander'

import { registerCategoryCommand } from './commands/category'
import { registerConfigCommand } from './commands/config'
import { registerListCommand } from './commands/list'
import { registerSearchCommand } from './commands/search'
import { registerSourcesCommand } from './commands/sources'
import { registerTodayCommand } from './commands/today'

export const createCliProgram = (): Command => {
  const program = new Command()

  program
    .name('ai-rss')
    .description('AI RSS read-only terminal reader')
    .version('0.1.0')
    .option('--json', 'output JSON when supported')

  registerTodayCommand(program)
  registerListCommand(program)
  registerCategoryCommand(program)
  registerSearchCommand(program)
  registerSourcesCommand(program)
  registerConfigCommand(program)

  return program
}
