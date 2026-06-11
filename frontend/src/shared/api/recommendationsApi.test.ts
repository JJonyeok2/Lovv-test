import { describe, expect, it } from 'vitest'
import {
  adaptRecommendationToPlanDraft,
  recommendationsApiEndpoints,
  type LovvRecommendationResponse,
} from './recommendationsApi'

describe('recommendation API adapter', () => {
  it('keeps recommendation generation as a one-shot POST endpoint', () => {
    expect(recommendationsApiEndpoints.generate).toBe('/api/v1/recommendations')
    expect(recommendationsApiEndpoints).not.toHaveProperty('detail')
  })

  it('maps backend recommendation itinerary into PlanDraft shape', () => {
    const response: LovvRecommendationResponse = {
      mock: true,
      recommendationId: 'rec-1',
      generatedAt: '2026-06-11T00:00:00Z',
      destination: { cityId: 'KR-Gangneung' },
      requestSnapshot: { durationDays: 1 },
      savePayload: {},
      validationStatus: {},
      itinerary: {
        title: 'Gangneung day trip',
        summary: 'A quiet day trip.',
        durationLabel: 'day trip',
        days: [
          {
            day: 1,
            title: 'Day 1',
            summary: 'Start slow.',
            stops: [
              {
                sortOrder: 1,
                timeSlot: 'morning',
                placeName: 'Ojukheon',
                moveHint: 'Walk 10 minutes',
                recommendationReason: 'Matches preference.',
                body: 'Visit first.',
              },
            ],
          },
        ],
      },
    }

    expect(adaptRecommendationToPlanDraft(response)).toEqual({
      durationLabel: 'day trip',
      dayCount: 1,
      intensityLabel: '',
      festivalThemeLabel: '',
      summary: 'A quiet day trip.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          summary: 'Start slow.',
          stops: [
            {
              time: 'morning',
              move: 'Walk 10 minutes',
              title: 'Ojukheon',
              body: 'Visit first.',
              reason: 'Matches preference.',
            },
          ],
        },
      ],
      stops: [
        {
          time: 'morning',
          move: 'Walk 10 minutes',
          title: 'Ojukheon',
          body: 'Visit first.',
          reason: 'Matches preference.',
        },
      ],
    })
  })
})
