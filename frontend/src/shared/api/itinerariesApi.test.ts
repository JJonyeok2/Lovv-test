import { describe, expect, it } from 'vitest'
import {
  adaptItineraryListToSavedPlans,
  adaptItineraryToSavedPlan,
  itinerariesApiEndpoints,
  type LovvItineraryDetail,
  type LovvItineraryListResponse,
} from './itinerariesApi'

const detailResponse: LovvItineraryDetail = {
  itineraryId: 'itinerary-1',
  sourceRecommendationId: 'rec-1',
  title: 'Gangneung 2-day itinerary',
  summary: 'A quiet route around Gangneung.',
  destination: {
    destinationId: 'KR-Gangneung',
    cityId: 'KR-Gangneung',
    name: 'Gangneung',
    country: 'KR',
    region: 'Gangwon',
    themes: ['sea_coast', 'festival'],
  },
  durationDays: 2,
  durationLabel: '1 night 2 days',
  festivalChoice: 'include',
  intensityLabel: 'low',
  savedAt: '2026-06-11T00:00:00Z',
  updatedAt: '2026-06-11T00:00:00Z',
  requestSummary: 'Festival-aware low walking route.',
  days: [
    {
      day: 1,
      title: 'Day 1',
      summary: 'Arrival day.',
      stops: [
        {
          sortOrder: 1,
          timeSlot: 'morning',
          placeName: 'Ojukheon',
          contentId: '250126',
          placeId: 'ATTRACTION-250126',
          moveHint: 'Short taxi ride',
          recommendationReason: 'Matches history preference.',
          body: 'Start with a quiet visit.',
          sourceBadges: ['official'],
        },
      ],
    },
  ],
}

describe('itinerary API adapter', () => {
  it('builds encoded saved itinerary endpoint paths', () => {
    expect(itinerariesApiEndpoints.detail('itinerary/1')).toBe('/api/v1/me/itineraries/itinerary%2F1')
  })

  it('maps backend itinerary detail days and item rows into SavedPlan shape', () => {
    const savedPlan = adaptItineraryToSavedPlan(detailResponse, { ownerId: 'user-1' })

    expect(savedPlan).toMatchObject({
      id: 'itinerary-1',
      ownerId: 'user-1',
      title: 'Gangneung 2-day itinerary',
      cityPair: 'Gangwon Gangneung',
      themeTag: 'sea_coast',
      themeLabels: ['sea_coast', 'festival'],
      conditionSummary: 'Festival-aware low walking route.',
      durationLabel: '1 night 2 days',
      festivalThemeLabel: 'include',
      intensityLabel: 'low',
      summary: 'A quiet route around Gangneung.',
      createdAt: '2026-06-11T00:00:00Z',
      savedAt: '2026-06-11T00:00:00Z',
    })
    expect(savedPlan.days).toEqual([
      {
        day: 1,
        title: 'Day 1',
        summary: 'Arrival day.',
        stops: [
          {
            time: 'morning',
            move: 'Short taxi ride',
            title: 'Ojukheon',
            body: 'Start with a quiet visit.',
            reason: 'Matches history preference.',
          },
        ],
      },
    ])
    expect(savedPlan.stops).toHaveLength(1)
  })

  it('maps itinerary lists without requiring detail days', () => {
    const response: LovvItineraryListResponse = {
      items: [
        {
          itineraryId: detailResponse.itineraryId,
          title: detailResponse.title,
          summary: detailResponse.summary,
          destination: detailResponse.destination,
          durationLabel: detailResponse.durationLabel,
          festivalChoice: detailResponse.festivalChoice,
          intensityLabel: detailResponse.intensityLabel,
          savedAt: detailResponse.savedAt,
        },
      ],
      nextCursor: null,
    }

    expect(adaptItineraryListToSavedPlans(response, { ownerId: 'user-1' })[0]).toMatchObject({
      id: 'itinerary-1',
      stops: [],
    })
  })
})
