export enum NavType {
  Community = 'community',
  AI = 'ai',
  OuterNews = 'outer_news',
  InnerNews = 'inner_news',
  Blog = 'blog',
  Finance = 'finance',
  Default = 'default',
  Selected = 'selected',
}

export interface NavItem {
  key: NavType
  label: string
}
