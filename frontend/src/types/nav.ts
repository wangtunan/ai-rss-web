export enum NavType {
  Community = 'community',
  AI = 'ai',
  News = 'news',
  Blog = 'blog',
  Finance = 'finance',
  Default = 'default',
  Selected = 'selected',
}

export interface NavItem {
  /** 导航栏唯一标识 */
  key: NavType
  /** 导航栏显示名称 */
  label: string
}
