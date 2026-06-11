import type { PlanDay, PlanReactionType, PlanStop, SavedPlan } from '../types/app'
import { lovvApiRequest, type LovvApiRequestOptions } from './httpClient'

export const itinerariesApiEndpoints = {
  collection: '/api/v1/me/itineraries',
  detail: (itineraryId: string) => `/api/v1/me/itineraries/${encodeURIComponent(itineraryId)}`,
} as const

export type LovvItineraryDestination = {
  destinationId?: string
  cityId?: string
  name?: string
  country?: string
  region?: string
  themes?: string[]
}

export type LovvItineraryStop = {
  sortOrder?: number
  timeSlot?: string | null
  placeName?: string | null
  contentId?: string | null
  placeId?: string | null
  latitude?: number | null
  longitude?: number | null
  moveHint?: string | null
  recommendationReason?: string | null
  body?: string | null
  sourceBadges?: string[]
}

export type LovvItineraryDay = {
  day: number
  title?: string
  summary?: string
  stops: LovvItineraryStop[]
}

export type LovvItinerarySummary = {
  itineraryId: string
  sourceRecommendationId?: string
  title?: string
  summary?: string
  destination?: LovvItineraryDestination
  durationDays?: number
  durationLabel?: string
  festivalChoice?: string | null
  intensityLabel?: string | null
  savedAt?: string
  updatedAt?: string
  reactionType?: PlanReactionType
}

export type LovvItineraryDetail = LovvItinerarySummary & {
  snapshotHash?: string
  requestSnapshot?: Record<string, unknown>
  preferenceSnapshot?: Record<string, unknown>
  requestSummary?: string | null
  days?: LovvItineraryDay[]
}

export type LovvSaveItineraryResponse = {
  itineraryId: string
  sourceRecommendationId?: string
  savedAt?: string
  duplicate: boolean
}

export type LovvItineraryListResponse = {
  items: LovvItinerarySummary[]
  nextCursor: string | null
}

export type SavedPlanAdapterOptions = {
  ownerId: string
  fallbackCreatedAt?: string
}

const getDestinationLabel = (destination: LovvItineraryDestination | undefined) =>
  [destination?.region, destination?.name ?? destination?.destinationId ?? destination?.cityId]
    .filter(Boolean)
    .join(' ')

const getThemeLabels = (itinerary: LovvItinerarySummary | LovvItineraryDetail) =>
  itinerary.destination?.themes ?? []

const toPlanStop = (stop: LovvItineraryStop): PlanStop => ({
  time: (stop.timeSlot ?? '?꾩묠') as PlanStop['time'],
  move: stop.moveHint ?? '',
  title: stop.placeName ?? stop.placeId ?? stop.contentId ?? '',
  body: stop.body ?? '',
  reason: stop.recommendationReason ?? '',
})

const toPlanDays = (days: LovvItineraryDay[] | undefined): PlanDay[] =>
  (days ?? []).map((day) => ({
    day: day.day,
    title: day.title ?? `Day ${day.day}`,
    summary: day.summary ?? '',
    stops: day.stops.map(toPlanStop),
  }))

export const adaptItineraryToSavedPlan = (
  itinerary: LovvItinerarySummary | LovvItineraryDetail,
  { ownerId, fallbackCreatedAt = new Date(0).toISOString() }: SavedPlanAdapterOptions,
): SavedPlan => {
  const days = toPlanDays('days' in itinerary ? itinerary.days : undefined)
  const stops = days.flatMap((day) => day.stops)
  const themeLabels = getThemeLabels(itinerary)
  const requestSummary = 'requestSummary' in itinerary ? itinerary.requestSummary : undefined

  return {
    id: itinerary.itineraryId,
    ownerId,
    title: itinerary.title ?? 'Saved itinerary',
    cityPair: getDestinationLabel(itinerary.destination),
    themeTag: themeLabels[0] ?? '',
    themeLabels,
    conditionSummary: requestSummary ?? itinerary.summary ?? '',
    durationLabel: itinerary.durationLabel ?? '',
    festivalThemeLabel: itinerary.festivalChoice ?? '',
    intensityLabel: itinerary.intensityLabel ?? '',
    summary: itinerary.summary ?? '',
    days: days.length > 0 ? days : undefined,
    stops,
    createdAt: itinerary.savedAt ?? fallbackCreatedAt,
    savedAt: itinerary.savedAt ?? fallbackCreatedAt,
  }
}

export const adaptItineraryListToSavedPlans = (
  response: LovvItineraryListResponse,
  options: SavedPlanAdapterOptions,
) => response.items.map((item) => adaptItineraryToSavedPlan(item, options))

export const postItinerary = (
  body: Record<string, unknown>,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvSaveItineraryResponse>(itinerariesApiEndpoints.collection, {
    ...options,
    method: 'POST',
    body,
  })

export const getItineraries = (options: LovvApiRequestOptions = {}) =>
  lovvApiRequest<LovvItineraryListResponse>(itinerariesApiEndpoints.collection, options)

export const getItineraryDetail = (
  itineraryId: string,
  options: LovvApiRequestOptions = {},
) => lovvApiRequest<LovvItineraryDetail>(itinerariesApiEndpoints.detail(itineraryId), options)

export const deleteItinerary = (
  itineraryId: string,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<null>(itinerariesApiEndpoints.detail(itineraryId), {
    ...options,
    method: 'DELETE',
  })
