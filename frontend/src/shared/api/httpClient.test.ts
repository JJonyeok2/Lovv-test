import { describe, expect, it, vi } from 'vitest'
import { createLovvApiUrl, lovvApiRequest } from './httpClient'
import type { LovvApiError, LovvApiFetch } from './httpClient'

describe('Lovv HTTP client', () => {
  it('uses same-origin paths when API base URL is empty', () => {
    expect(createLovvApiUrl('/api/v1/auth/session', '')).toBe('/api/v1/auth/session')
    expect(createLovvApiUrl('api/v1/auth/session', '')).toBe('/api/v1/auth/session')
  })

  it('joins configured API base URL without leaking env values', () => {
    expect(createLovvApiUrl('/api/v1/auth/session', 'https://api.example.com/')).toBe(
      'https://api.example.com/api/v1/auth/session',
    )
  })

  it('adds bearer token, JSON body, and credentialed request defaults', async () => {
    const calls: [RequestInfo | URL, RequestInit | undefined][] = []
    const fetcher: LovvApiFetch = async (input, init) => {
      calls.push([input, init])

      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    const result = await lovvApiRequest<{ ok: boolean }>('/api/v1/test', {
      method: 'POST',
      body: { value: 1 },
      accessToken: 'access-token',
      fetcher,
      baseUrl: '',
    })
    const request = calls[0]?.[1] as RequestInit
    const headers = request.headers as Headers

    expect(result).toEqual({ ok: true })
    expect(calls[0]).toEqual(['/api/v1/test', expect.objectContaining({ credentials: 'include' })])
    expect(request.body).toBe(JSON.stringify({ value: 1 }))
    expect(headers.get('Authorization')).toBe('Bearer access-token')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('maps stable backend error payloads into LovvApiError', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'ONBOARDING_REQUIRED',
              message: 'Complete onboarding first.',
            },
          }),
          { status: 409 },
        ),
    )

    await expect(lovvApiRequest('/api/v1/recommendations', { fetcher, baseUrl: '' })).rejects.toMatchObject({
      name: 'LovvApiError',
      status: 409,
      code: 'ONBOARDING_REQUIRED',
      message: 'Complete onboarding first.',
    } satisfies Partial<LovvApiError>)
  })
})
