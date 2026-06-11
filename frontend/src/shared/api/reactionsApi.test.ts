import { describe, expect, it } from 'vitest'
import {
  adaptReactionResponse,
  reactionsApiEndpoints,
  type LovvReactionResponse,
} from './reactionsApi'

describe('reaction API adapter', () => {
  it('builds encoded reaction endpoint paths', () => {
    expect(reactionsApiEndpoints.reaction('plan/1')).toBe('/api/v1/me/itineraries/plan%2F1/reaction')
  })

  it('maps like, dislike, and cleared reaction states', () => {
    const liked: LovvReactionResponse = {
      itineraryId: 'itinerary-1',
      reactionType: 'like',
      changed: true,
      updatedAt: '2026-06-11T00:00:00Z',
    }
    const disliked: LovvReactionResponse = {
      ...liked,
      reactionType: 'dislike',
    }

    expect(adaptReactionResponse(liked)).toBe('like')
    expect(adaptReactionResponse(disliked)).toBe('dislike')
    expect(adaptReactionResponse(null)).toBeNull()
  })
})
