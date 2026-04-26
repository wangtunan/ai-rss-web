// 通用 JSON 请求函数
export const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`数据加载失败: ${response.status}`)
  }
  return response.json() as Promise<T>
}
