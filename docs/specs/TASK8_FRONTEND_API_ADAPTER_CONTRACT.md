# TASK8 Frontend API Adapter Contract

## Goal

Align the frontend HTTP adapter boundary with the organization backend API contract before replacing PoC/localStorage flows.

The UI should not know endpoint paths, fetch details, token headers, or backend response casing. UI code should call feature/data source functions, and those functions should choose between the PoC adapter and the HTTP adapter.

## Base URL

Frontend environment variable:

```text
VITE_LOVV_API_BASE_URL=https://...
```

Rules:

- Real values belong only in `.env.local` or deployment environment settings.
- `.env.example` must contain only placeholder values.
- If `VITE_LOVV_API_BASE_URL` is empty, adapters may call same-origin paths for local proxy/dev use.

## Endpoint Inventory

### Auth

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Session bootstrap | `GET` | `/api/v1/auth/session` | `shared/api/authApi.ts` |
| Current user | `GET` | `/api/v1/auth/me` | `shared/api/authApi.ts` |
| Google login | `POST` | `/api/v1/auth/google` | `shared/api/authApi.ts` |
| Kakao login | `POST` | `/api/v1/auth/kakao` | `shared/api/authApi.ts` |
| Refresh | `POST` | `/api/v1/auth/refresh` | `shared/api/authApi.ts` |
| Logout | `POST` | `/api/v1/auth/logout` | `shared/api/authApi.ts` |

### Preferences

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Read preferences | `GET` | `/api/v1/me/preferences` | `shared/api/preferencesApi.ts` |
| Save preferences | `PUT` | `/api/v1/me/preferences` | `shared/api/preferencesApi.ts` |

### Map/City

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Markers | `GET` | `/api/v1/map/markers` | `shared/api/smallCityApi.ts` |
| City list | `GET` | `/api/v1/map/cities` | `shared/api/smallCityApi.ts` |
| City detail | `GET` | `/api/v1/map/cities/{cityId}` | `shared/api/smallCityApi.ts` |
| Places | `GET` | `/api/v1/map/cities/{cityId}/places` | `shared/api/smallCityApi.ts` |
| Seasonality | `GET` | `/api/v1/map/cities/{cityId}/seasonality` | `shared/api/smallCityApi.ts` |
| Compatibility city list | `GET` | `/api/small-cities` | `shared/api/smallCityApi.ts` |
| Compatibility city detail | `GET` | `/api/small-cities/{cityId}` | `shared/api/smallCityApi.ts` |
| Compatibility places | `GET` | `/api/small-cities/{cityId}/places` | `shared/api/smallCityApi.ts` |

### Recommendations

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Generate recommendation | `POST` | `/api/v1/recommendations` | `shared/api/recommendationsApi.ts` |

`GET /api/v1/recommendations/{recommendationId}` is deferred until async/live recommendation reload is required.

### Saved Itineraries

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Save itinerary | `POST` | `/api/v1/me/itineraries` | `shared/api/itinerariesApi.ts` |
| List itineraries | `GET` | `/api/v1/me/itineraries` | `shared/api/itinerariesApi.ts` |
| Itinerary detail | `GET` | `/api/v1/me/itineraries/{itineraryId}` | `shared/api/itinerariesApi.ts` |
| Delete itinerary | `DELETE` | `/api/v1/me/itineraries/{itineraryId}` | `shared/api/itinerariesApi.ts` |

### Reactions

| Flow | Method | Endpoint | Frontend adapter |
| --- | --- | --- | --- |
| Set like/dislike | `PUT` | `/api/v1/me/itineraries/{itineraryId}/reaction` | `shared/api/reactionsApi.ts` |
| Clear reaction | `DELETE` | `/api/v1/me/itineraries/{itineraryId}/reaction` | `shared/api/reactionsApi.ts` |

## Shape Gaps To Guard In Tests

| Field | Backend shape | Frontend expectation | Adapter rule |
| --- | --- | --- | --- |
| `seasonality` | Separate `/seasonality` response with `recommendedMonths`, `cautionMonths`, `monthly[]` | Month-aware planner/map metadata | Keep as `SmallCitySeasonality`; do not force UI to parse weather raw data |
| `festivalCount` | `festival_count`, `festivalCount`, or `summary.festivalCount` | `SmallCity.festivalCount`, detail `festivalCount` | Normalize both casings and count festivals as fallback |
| `reactionType` | `like` or `dislike`; DELETE returns 204 | `PlanReactionType = like/dislike/null` | PUT maps to `like/dislike`; DELETE maps to `null` |
| `itinerary_items` | Backend detail returns `days[].stops[]` derived from item rows | `SavedPlan.days`, `SavedPlan.stops` | Convert `timeSlot/placeName/moveHint/recommendationReason` into `PlanStop` |
| `places` | Detail may embed grouped `places`; places route may return `attractions[]` and `festivals[]` | `SmallCityPlaceGroups`, `SmallCityFestival[]` | Flatten all supported shapes into category groups |

## Connection Order

1. Map/City HTTP adapter.
2. Preferences HTTP adapter.
3. Itineraries HTTP adapter.
4. Reactions HTTP adapter.
5. Recommendations HTTP adapter.

## Current Boundary

PoC/localStorage adapters stay in place until product wiring starts. New HTTP adapters should be additive and tested. UI components should not import endpoint constants directly.
