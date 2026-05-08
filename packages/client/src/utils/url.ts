import { StaticNewsRequestError } from '../errors/index'

export const joinUrl = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

export const normalizeBaseUrl = (baseUrl: string): string => {
  const normalized = baseUrl.trim()
  if (!normalized) throw new StaticNewsRequestError(baseUrl, 'staticBaseUrl is required')
  return normalized
}