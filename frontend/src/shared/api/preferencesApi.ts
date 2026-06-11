import type { PreferenceProfile, ThemeId } from '../types/app'
import { lovvApiRequest, type LovvApiRequestOptions } from './httpClient'

export const preferencesApiEndpoints = {
  current: '/api/v1/me/preferences',
} as const

export type LovvCountryTrack = 'KR' | 'JP'

export type LovvPreferencePayload = {
  countryTrack: LovvCountryTrack
  mappedThemes: string[]
  preferredRegions?: string[]
  selectedCityStyle?: string | null
  pace?: 'slow' | 'relaxed' | 'balanced' | 'active' | null
  tripDays?: number
  companionStyle?: string | null
  travelStyles?: string[]
  onboardingCompleted?: boolean
}

export type LovvPreferenceRecord = LovvPreferencePayload & {
  preferenceId?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
  onboardingCompleted: boolean
}

export type LovvPreferenceResponse = {
  preferences: LovvPreferenceRecord | null
  onboardingCompleted: boolean
}

export const adaptPreferenceProfileToPayload = (
  profile: PreferenceProfile,
  countryTrack: LovvCountryTrack = 'KR',
): LovvPreferencePayload => ({
  countryTrack,
  mappedThemes: profile.selectedThemeIds,
  onboardingCompleted: profile.selectedThemeIds.length > 0,
})

export const adaptPreferenceResponseToProfile = (
  response: LovvPreferenceResponse,
  fallback: PreferenceProfile,
): PreferenceProfile => {
  const mappedThemes = response.preferences?.mappedThemes ?? []
  const selectedThemeIds = mappedThemes.filter((theme): theme is ThemeId =>
    fallback.selectedThemeIds.includes(theme as ThemeId),
  )

  return {
    ...fallback,
    selectedThemeIds: selectedThemeIds.length > 0 ? selectedThemeIds : fallback.selectedThemeIds,
    source: 'preference_edit',
    updatedAt: response.preferences?.updatedAt ?? fallback.updatedAt,
  }
}

export const getPreferences = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<LovvPreferenceResponse>(preferencesApiEndpoints.current, options)

export const putPreferences = (
  body: LovvPreferencePayload,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvPreferenceResponse>(preferencesApiEndpoints.current, {
    ...options,
    method: 'PUT',
    body,
  })
