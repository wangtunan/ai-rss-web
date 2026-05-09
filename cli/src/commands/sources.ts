import type { Command } from 'commander'

import { createClientFromConfig } from '../client'
import { printJson } from '../output/json'
import { printSources } from '../output/news'
import { resolveJsonOption } from './options'
import type { CategoryOption, JsonOption } from './options'

interface SourcesOptions extends JsonOption, CategoryOption {}

export const registerSourcesCommand = (program: Command): void => {
  program
    .command('sources')
    .description('show read-only news source metadata')
    .option('-c, --category <category>', 'filter by category')
    .option('--json', 'output raw JSON')
    .action(async (options: SourcesOptions) => {
      const { client } = await createClientFromConfig()
      const sources = await client.getSources()
      const filteredSources = options.category ? sources.filter((source) => source.category === options.category) : sources

      if (resolveJsonOption(program, options)) {
        printJson(filteredSources)
      } else {
        printSources(filteredSources, options.category ? `RSS Sources: ${options.category}` : 'RSS Sources')
      }
    })
}
