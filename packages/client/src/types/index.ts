import type {
  CuratedNewsRequest,
  CuratedNewsResponse,
  DataMode,
  NewsItem,
  NewsListRequest,
  NewsListResponse,
  RssSource,
} from '@ai-rss/schema'

export type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>

export type NewsClientOptions = StaticNewsClientOptions | SupabaseNewsClientOptions

export type NewsSearchableField = keyof Pick<NewsItem, 'title' | 'ai_summary' | 'raw_content' | 'source' | 'category'>

export interface StaticNewsClientOptions {
  mode: Extract<DataMode, 'static'>
  staticBaseUrl: string
  fetcher?: FetchLike
}

export interface SupabaseNewsClientOptions {
  mode: Extract<DataMode, 'supabase'>
  supabaseUrl: string
  supabaseKey: string
}

export interface SearchNewsRequest extends NewsListRequest {
  keyword: string
}

export interface NewsClient {
  getAllNews(params?: Omit<NewsListRequest, 'category'>): Promise<NewsListResponse>
  getNewsList(params?: NewsListRequest): Promise<NewsListResponse>
  getTodayNews(params?: Omit<CuratedNewsRequest, 'period'>): Promise<CuratedNewsResponse>
  getCuratedNews(params: CuratedNewsRequest): Promise<CuratedNewsResponse>
  getCategoryNews(category: string, params?: Omit<NewsListRequest, 'category'>): Promise<NewsListResponse>
  searchNews(params: SearchNewsRequest): Promise<NewsListResponse>
  getSources(): Promise<RssSource[]>
}

export interface StaticNewsFiles {
  all: NewsListResponse
  curatedToday: CuratedNewsResponse
  category: NewsListResponse
  sources: RssSource[]
}
