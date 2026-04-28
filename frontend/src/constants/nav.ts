import type { NavItem } from '@/types/nav'
import { NavType } from '@/types/nav'

export const NAV_LIST: NavItem[] = [
  {
    key: NavType.Default,
    label: '全部',
  },
  {
    key: NavType.Selected,
    label: '精选',
  },
  {
    key: NavType.AI,
    label: 'AI',
  },
  {
    key: NavType.Community,
    label: '社区',
  },
  {
    key: NavType.Blog,
    label: '博客',
  },
  {
    key: NavType.News,
    label: '新闻',
  },
  {
    key: NavType.Finance,
    label: '财经',
  },
]
