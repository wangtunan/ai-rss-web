import type { CuratedNewsRequest, CuratedNewsResponse, NewsListRequest, NewsListResponse, RssSource } from '@ai-rss/schema'

import type { FetchLike, NewsClient, SearchNewsRequest, StaticNewsClientOptions } from './types/index'
import { UnsupportedDataModeError, StaticNewsRequestError } from './errors/index'
import { applyNewsListFilters, searchNewsItems } from './filter/index'
import { joinUrl, normalizeBaseUrl } from './utils/url'
import { getFetch, fetchJson } from './utils/fetch'
const omitCategory = ({ category: _category, ...params }: NewsListRequest): NewsListRequest => params


export class StaticNewsClient implements NewsClient {
  private readonly baseUrl: string
  private readonly fetcher: FetchLike

  constructor(options: StaticNewsClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.staticBaseUrl)
    this.fetcher = getFetch(options.fetcher)
  }

  async getAllNews(params: Omit<NewsListRequest, 'category'> = {}): Promise<NewsListResponse> {
    return this.getNewsList({ ...params, category: 'all' })
  }

  async getNewsList(params: NewsListRequest = {}): Promise<NewsListResponse> {
    const category = params.category ?? 'all'
    const response = await this.readNewsFile(`${category}.json`)
    const filters = category === 'all' ? omitCategory(params) : params
    return applyNewsListFilters(response, filters)
  }

  async getTodayNews(params: Omit<CuratedNewsRequest, 'period'> = {}): Promise<CuratedNewsResponse> {
    return this.getCuratedNews({ ...params, period: 'today' })
  }

  async getCuratedNews(params: CuratedNewsRequest): Promise<CuratedNewsResponse> {
    const response = await this.readNewsFile<CuratedNewsResponse>(`curated-${params.period}.json`)
    const filtered = applyNewsListFilters(response, params)
    return {
      ...filtered,
      period: response.period ?? params.period,
    }
  }

  async getCategoryNews(category: string, params: Omit<NewsListRequest, 'category'> = {}): Promise<NewsListResponse> {
    return this.getNewsList({ ...params, category })
  }

  async searchNews(params: SearchNewsRequest): Promise<NewsListResponse> {
    const source = await this.getNewsList(createSourceSearchRequest(params))
    const matchedItems = searchNewsItems(source.items, params)
    const offset = params.offset ?? 0
    const limit = params.limit ?? matchedItems.length

    return {
      total: matchedItems.length,
      limit,
      offset,
      items: matchedItems.slice(offset, offset + limit),
    }
  }

  async getSources(): Promise<RssSource[]> {
    try {
      return await this.readFile<RssSource[]>('sources.json')
    } catch (error) {
      if (error instanceof StaticNewsRequestError && error.message.includes('HTTP 404')) return []
      throw error
    }
  }

  private readNewsFile<T extends NewsListResponse>(fileName: string): Promise<T> {
    return this.readFile<T>(fileName)
  }

  private readFile<T>(fileName: string): Promise<T> {
    return fetchJson<T>(this.fetcher, joinUrl(this.baseUrl, fileName))
  }
}

export const createStaticNewsClient = (options: StaticNewsClientOptions): NewsClient => new StaticNewsClient(options)

export const createUnsupportedSupabaseClient = (): NewsClient => {
  throw new UnsupportedDataModeError('supabase')
}

const createSourceSearchRequest = (params: SearchNewsRequest): NewsListRequest => {
  const request: NewsListRequest = {
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  }

  if (params.category) request.category = params.category
  if (params.source) request.source = params.source
  if (params.ingest_date) request.ingest_date = params.ingest_date

  return request
}
