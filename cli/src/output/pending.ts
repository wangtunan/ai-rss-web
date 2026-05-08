export const printPendingCommand = (command: string, detail: string): void => {
  console.log(`ai-rss ${command}`)
  console.log('')
  console.log('This command is registered, but not wired to data yet.')
  console.log(detail)
}
