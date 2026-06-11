import type { AuthProvider, LovvUser } from '../types/app'
import { lovvApiRequest, type LovvApiRequestOptions } from './httpClient'

export const authApiEndpoints = {
  session: '/api/v1/auth/session',
  me: '/api/v1/auth/me',
  google: '/api/v1/auth/google',
  kakao: '/api/v1/auth/kakao',
  refresh: '/api/v1/auth/refresh',
  logout: '/api/v1/auth/logout',
} as const

export type LovvApiUser = {
  id?: string
  userId?: string
  displayName?: string
  nickname?: string
  email?: string
  emailVerified?: boolean
  avatarUrl?: string | null
  roles?: string[]
  isNewUser?: boolean
}

export type LovvAuthCredentialRequest = {
  credentialType: string
  credential: string
  nonce?: string
  redirectUri?: string
}

export type LovvAuthTokenResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export type LovvAuthLoginResponse = LovvAuthTokenResponse & {
  session?: {
    sessionId?: string
    expiresAt?: string
  }
  user: LovvApiUser
  linkedProvider?: AuthProvider
}

export type LovvAuthSessionResponse = LovvAuthTokenResponse & {
  authenticated: boolean
  user: LovvApiUser
  preferences: unknown | null
  onboardingCompleted: boolean
}

export type LovvAuthMeResponse = {
  user: LovvApiUser
}

const createAvatarInitial = (name: string, email: string) =>
  (name.trim()[0] ?? email.trim()[0] ?? 'L').toUpperCase()

export const adaptLovvApiUser = (
  user: LovvApiUser,
  provider: AuthProvider = 'google',
): LovvUser => {
  const id = user.userId ?? user.id ?? ''
  const name = user.displayName ?? user.nickname ?? 'Lovv User'
  const email = user.email ?? ''

  return {
    id,
    name,
    email,
    avatarInitial: createAvatarInitial(name, email),
    provider,
  }
}

export const getAuthSession = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<LovvAuthSessionResponse>(authApiEndpoints.session, options)

export const getCurrentUser = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<LovvAuthMeResponse>(authApiEndpoints.me, options)

export const postGoogleLogin = (
  body: LovvAuthCredentialRequest,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvAuthLoginResponse>(authApiEndpoints.google, {
    ...options,
    method: 'POST',
    body,
  })

export const postKakaoLogin = (
  body: LovvAuthCredentialRequest,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvAuthLoginResponse>(authApiEndpoints.kakao, {
    ...options,
    method: 'POST',
    body,
  })

export const refreshAuthSession = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<LovvAuthTokenResponse>(authApiEndpoints.refresh, {
    ...options,
    method: 'POST',
  })

export const logoutAuthSession = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<{ success?: boolean } | null>(authApiEndpoints.logout, {
    ...options,
    method: 'POST',
  })
