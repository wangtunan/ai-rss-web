export type NavGroup = 'ai' | 'community' | 'inner_news' | 'outer_news' | 'finance' | 'blog'

export type CategoryMeta = {
  label: string
  subtitle: string
  group: NavGroup
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  openai: { label: 'OpenAI 官方动态', subtitle: 'OpenAI', group: 'ai' },
  hugging_face: { label: 'Hugging Face 动态', subtitle: 'Hugging Face', group: 'ai' },
  anthropic: { label: 'Anthropic 动态', subtitle: 'Anthropic', group: 'ai' },
  google_ai: { label: 'Google AI 动态', subtitle: 'Google AI', group: 'ai' },
  mit_technology_ai: { label: 'MIT Technology Review AI', subtitle: 'MIT Technology Review', group: 'ai' },
  the_decoder: { label: 'The Decoder', subtitle: 'The Decoder', group: 'ai' },
  hacker_news: { label: 'Hacker News 热榜', subtitle: 'Hacker News', group: 'community' },
  v2ex: { label: 'V2EX 热帖', subtitle: 'V2EX', group: 'community' },
  juejin: { label: '掘金', subtitle: '掘金', group: 'community' },
  stackoverflow_blog: { label: 'Stack Overflow Blog', subtitle: 'Stack Overflow', group: 'blog' },
  github: { label: 'GitHub Blog 动态', subtitle: 'GitHub', group: 'blog' },
  javascript_weekly: { label: 'JavaScript Weekly 周刊', subtitle: 'JavaScript Weekly', group: 'blog' },
  chinanews: { label: '中国新闻网', subtitle: '中国新闻网', group: 'inner_news' },
  infoq: { label: 'InfoQ', subtitle: 'InfoQ', group: 'inner_news' },
  zaobao_china: { label: '联合早报', subtitle: '联合早报', group: 'inner_news' },
  reuters: { label: '路透社', subtitle: '路透社', group: 'outer_news' },
  bloomberg: { label: '彭博社', subtitle: '彭博社', group: 'outer_news' },
  bbc_news: { label: 'BBC News', subtitle: 'BBC News', group: 'outer_news' },
  wsj: { label: '华尔街见闻', subtitle: '华尔街见闻', group: 'outer_news' },
  ft_chinese: { label: 'Financial Times 中文网', subtitle: 'FT 中文网', group: 'outer_news' },
  cls: { label: '财联社', subtitle: '财联社', group: 'finance' },
  xueqiu: { label: '雪球', subtitle: '雪球', group: 'finance' },
  '36kr': { label: '36氪', subtitle: '36氪', group: 'finance' },
}

export const getSourceLabel = (category: string, fallback?: string) => {
  return CATEGORY_META[category]?.subtitle ?? fallback ?? category
}
