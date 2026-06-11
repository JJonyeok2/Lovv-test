export type LovvApiFetch = typeof fetch

export type LovvApiRequestOptions = {
  method?: string
  body?: unknown
  accessToken?: string | null
  headers?: HeadersInit
  signal?: AbortSignal
  credentials?: RequestCredentials
  fetcher?: LovvApiFetch
  baseUrl?: string
}

export type LovvApiErrorPayload = {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export class LovvApiError extends Error {
  status: number
  code: string
  details: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'LovvApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '')

export const getLovvApiBaseUrl = () =>
  normalizeBaseUrl(import.meta.env.VITE_LOVV_API_BASE_URL ?? '')

export const createLovvApiUrl = (path: string, baseUrl = getLovvApiBaseUrl()) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  return normalizedBaseUrl ? `${normalizedBaseUrl}${normalizedPath}` : normalizedPath
}

const parseJsonResponse = async (response: Response) => {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new LovvApiError(response.status, 'INVALID_JSON', 'API response was not valid JSON')
  }
}

export const lovvApiRequest = async <T>(
  path: string,
  {
    method = 'GET',
    body,
    accessToken,
    headers,
    signal,
    credentials = 'include',
    fetcher = fetch,
    baseUrl,
  }: LovvApiRequestOptions = {},
): Promise<T> => {
  const requestHeaders = new Headers(headers)

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetcher(createLovvApiUrl(path, baseUrl), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials,
    signal,
  })
  const parsedBody = await parseJsonResponse(response)

  if (!response.ok) {
    const payload = parsedBody as LovvApiErrorPayload | null
    const error = payload?.error

    throw new LovvApiError(
      response.status,
      error?.code ?? 'HTTP_ERROR',
      error?.message ?? `HTTP ${response.status}`,
      error?.details,
    )
  }

  return parsedBody as T
}
