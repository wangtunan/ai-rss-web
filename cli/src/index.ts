import { createCliProgram } from './program'

const program = createCliProgram()

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`ai-rss: ${message}`)
  process.exitCode = 1
})
