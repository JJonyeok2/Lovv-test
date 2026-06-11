import type { PlanReactionType } from '../types/app'
import { lovvApiRequest, type LovvApiRequestOptions } from './httpClient'

export const reactionsApiEndpoints = {
  reaction: (itineraryId: string) =>
    `/api/v1/me/itineraries/${encodeURIComponent(itineraryId)}/reaction`,
} as const

export type LovvReactionRequest = {
  reactionType: Exclude<PlanReactionType, null>
}

export type LovvReactionResponse = {
  itineraryId: string
  reactionType: Exclude<PlanReactionType, null>
  changed: boolean
  updatedAt?: string
}

export const adaptReactionResponse = (
  response: LovvReactionResponse | null,
): PlanReactionType => response?.reactionType ?? null

export const putItineraryReaction = (
  itineraryId: string,
  reactionType: Exclude<PlanReactionType, null>,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<LovvReactionResponse>(reactionsApiEndpoints.reaction(itineraryId), {
    ...options,
    method: 'PUT',
    body: { reactionType } satisfies LovvReactionRequest,
  })

export const deleteItineraryReaction = (
  itineraryId: string,
  options: LovvApiRequestOptions = {},
) =>
  lovvApiRequest<null>(reactionsApiEndpoints.reaction(itineraryId), {
    ...options,
    method: 'DELETE',
  })
