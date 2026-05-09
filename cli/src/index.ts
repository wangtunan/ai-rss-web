import { createCliProgram } from './program'

const program = createCliProgram()
const argv = process.argv.slice(2)

if (argv.length === 0) {
  program.outputHelp()
  process.exitCode = 0
} else {
  program.parseAsync(process.argv).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`ai-rss: ${message}`)
    process.exitCode = 1
  })
}
