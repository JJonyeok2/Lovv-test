import type { PlanDay, PlanDraft, PlanStop } from '../types/app'
import { lovvApiRequest, type LovvApiRequestOptions } from './httpClient'
import type { LovvItineraryDay } from './itinerariesApi'

export const recommendationsApiEndpoints = {
  generate: '/api/v1/recommendations',
} as const

export type LovvRecommendationRequest = {
  entryType: 'map_marker' | 'chat' | 'home_recommendation'
  destinationId: string
  cityId?: string
  country: 'KR' | 'JP'
  travelYear: number
  travelMonth: number
  durationDays: number
  themes: string[]
  includeFestivals: boolean
  constraints?: Record<string, unknown>
  naturalLanguageQuery?: string
}

export type LovvRecommendationItinerary = {
  title: string
  summary: string
  durationLabel: string
  days: LovvItineraryDay[]
}

export type LovvRecommendationResponse = {
  mock?: boolean
  recommendationId: string
  generatedAt: string
  destination: Record<string, unknown>
  requestSnapshot: Record<string, unknown>
  itinerary: LovvRecommendationItinerary
  savePayload: Record<string, unknown>
  validationStatus: Record<string, unknown>
}

const toPlanStop = (stop: LovvItineraryDay['stops'][number]): PlanStop => ({
  time: (stop.timeSlot ?? '?꾩묠') as PlanStop['time'],
  move: stop.moveHint ?? (typeof stop.sortOrder === 'number' ? `${stop.sortOrder}` : ''),
  title: stop.placeName ?? '',
  body: stop.body ?? '',
  reason: stop.recommendationReason ?? '',
})

const toPlanDay = (day: LovvItineraryDay): PlanDay => ({
  day: day.day,
  title: day.title ?? `Day ${day.day}`,
  summary: day.summary ?? '',
  stops: day.stops.map(toPlanStop),
})

export const adaptRecommendationToPlanDraft = (
  response: LovvRecommendationResponse,
): PlanDraft => {
  const days = response.itinerary.days.map(toPlanDay)

  return {
    durationLabel: response.itinerary.durationLabel,
    dayCount: days.length,
    intensityLabel: '',
    festivalThemeLabel: '',
    summary: response.itinerary.summary,
    days,
    stops: days.flatMap((day) => day.stops),
  }
}

export const postRecommendation = (
  body: LovvRecommendationRequest,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvRecommendationResponse>(recommendationsApiEndpoints.generate, {
    ...options,
    method: 'POST',
    body,
  })
