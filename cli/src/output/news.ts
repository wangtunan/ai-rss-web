import type { NewsItem, NewsListResponse, RssSource } from '@ai-rss/schema'

interface NewsListPrintOptions {
  compact?: boolean
}

const ANSI = {
  reset: '\u001B[0m',
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  cyan: '\u001B[36m',
  green: '\u001B[32m',
  blue: '\u001B[34m',
  yellow: '\u001B[33m',
  magenta: '\u001B[35m',
  red: '\u001B[31m',
  gray: '\u001B[90m',
}

const shouldUseColor = (): boolean => {
  return process.env.NO_COLOR === undefined && process.stdout.isTTY
}

const color = (value: string, code: string): string => {
  if (!shouldUseColor()) return value
  return `${code}${value}${ANSI.reset}`
}

const bold = (value: string): string => color(value, ANSI.bold)
const dim = (value: string): string => color(value, ANSI.dim)
const cyan = (value: string): string => color(value, ANSI.cyan)
const green = (value: string): string => color(value, ANSI.green)
const blue = (value: string): string => color(value, ANSI.blue)
const yellow = (value: string): string => color(value, ANSI.yellow)
const magenta = (value: string): string => color(value, ANSI.magenta)
const red = (value: string): string => color(value, ANSI.red)
const gray = (value: string): string => color(value, ANSI.gray)

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toISOString().slice(0, 10)
}

const formatTags = (tags: string[]): string => {
  if (tags.length === 0) return ''
  const tagColors = [magenta, cyan, yellow, green, blue]
  return tags.slice(0, 5).map((tag, index) => {
    const tagColor = tagColors[index % tagColors.length] ?? cyan
    return tagColor(`#${tag}`)
  }).join(' ')
}

const formatSource = (item: NewsItem): string => {
  const parts = [item.source, item.category].filter(Boolean)
  return parts.length > 0 ? parts.join(' / ') : item.category
}

const formatImportance = (value: number): string => {
  if (value >= 5) return red('★★★★★')
  if (value === 4) return yellow('★★★★☆')
  if (value === 3) return green('★★★☆☆')
  if (value === 2) return cyan('★★☆☆☆')
  return gray('★☆☆☆☆')
}

const formatLinkedTitle = (title: string, url: string): string => {
  const value = bold(title)
  if (!url || process.env.NO_COLOR !== undefined || !process.stdout.isTTY) return value
  return `\u001B]8;;${url}\u0007${value}\u001B]8;;\u0007`
}

const trimText = (value: string, maxLength: number): string => {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`
}

const printHeader = (response: NewsListResponse, title: string): void => {
  console.log(bold(cyan(title)))
  console.log(gray(`Total ${response.total} | Showing ${response.items.length} | Offset ${response.offset}`))
}

const printCompactNewsItem = (item: NewsItem, number: number): void => {
  const source = formatSource(item)
  const date = formatDate(item.published_time)
  console.log(`${gray(String(number).padStart(2, ' '))}. ${formatLinkedTitle(trimText(item.title, 88), item.link)}`)
  console.log(`    ${gray(`${source} | ${date}`)} ${formatImportance(item.ai_importance)}`)
}

const printFullNewsItem = (item: NewsItem, number: number): void => {
  const source = formatSource(item)
  const date = formatDate(item.published_time)
  const tags = formatTags(item.ai_tags)
  const meta = [
    green(`作者 ${source}`),
    gray(date),
    `评分 ${formatImportance(item.ai_importance)}`,
  ]

  console.log('')
  console.log(`${gray(String(number).padStart(2, ' '))}. ${formatLinkedTitle(item.title, item.link)}`)
  if (item.ai_summary) console.log(`    ${trimText(item.ai_summary, 160)}`)
  if (tags) console.log(`    ${tags}`)
  console.log(`    ${meta.join(gray(' | '))}`)
  console.log(`    ${cyan(item.link)}`)
}

export const printNewsList = (response: NewsListResponse, title: string, options: NewsListPrintOptions = {}): void => {
  printHeader(response, title)

  if (response.items.length === 0) {
    console.log('')
    console.log(dim('No news found. Try a different category, keyword, or limit.'))
    return
  }

  response.items.forEach((item, index) => {
    const number = response.offset + index + 1
    if (options.compact) {
      printCompactNewsItem(item, number)
    } else {
      printFullNewsItem(item, number)
    }
  })
}

export const printSources = (sources: RssSource[], title = 'RSS Sources'): void => {
  console.log(title)
  console.log(`Total: ${sources.length}`)

  if (sources.length === 0) {
    console.log('No sources found.')
    return
  }

  sources.forEach((source, index) => {
    const status = source.enabled ? 'enabled' : 'disabled'
    console.log('')
    console.log(`${index + 1}. ${source.name}`)
    console.log(`   ${source.category} | ${status} | sort ${source.sort_order}`)
    console.log(`   ${source.url}`)
  })
}
