# Lovv Web

Lovv is a web app prototype for curated small-city travel recommendations across Korea and Japan.

The current frontend MVP is implemented with React, TypeScript, Vite, and Tailwind CSS.

## Current MVP Scope

- Google mock signup gate before onboarding
- Split-screen service intro on the first login screen
- Travel mood onboarding with Korea-first city themes
- Main Lovv landing screen with theme hashtags and a small-city map preview
- AI itinerary chat mock with trip-duration guide chips and festival-inclusion choices
- Generated itinerary detail below the chat

## Product Direction

Lovv provides a small-city travel recommendation curation service.

- It recommends Korea and Japan small-city candidates based on mood and travel pace.
- It uses chat to narrow trip duration, festival inclusion, walking intensity, and itinerary tone.
- It is designed to expand into liking, saving itineraries to My Page, and post-trip reviews.

## Scripts

```bash
cd frontend
npm run dev
npm test
npm run lint
npm run build
```

## Repository Structure

```text
.
├── docs/                 # MVP specs and reference notes
├── frontend/             # Current React frontend prototype
│   ├── src/
│   └── tests/
├── backend/              # Reserved for future backend app
├── database/             # Reserved for DB schema, migrations, seeds, ERD
├── models/               # Reserved for AI model and inference assets
├── wiki/                 # Team conventions and mdBook docs
└── .github/              # GitHub templates and workflows
```

## Development Notes

Feature additions should be committed in small, reviewable chunks and pushed to `JJonyeok2/Lovv_web`.

Before pushing, run the relevant checks:

- `cd frontend && npm test`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

## 다음 작업

현재 프론트에는 백엔드 API와 연결하기 위한 adapter 경계가 준비되어 있습니다. UI 컴포넌트가 endpoint나 `fetch`를 직접 알지 않게 유지하고, `frontend/src/shared/api` 아래 adapter를 통해 단계적으로 연결합니다.

1. Map/City 연결
   - 지도 마커 40개, 도시 상세 패널, 장소 목록을 `smallCityApi` HTTP 응답으로 교체합니다.
   - `seasonality`, `festivalCount`, `places` 필드가 화면에서 필요한 형태로 매핑되는지 확인합니다.
   - API 실패 시 기존 mock 데이터로 fallback 되는 흐름을 유지합니다.

2. Preferences 연결
   - 온보딩 선택값 저장/조회 흐름을 `preferencesApi`로 연결합니다.
   - 로그인 후 세션에서 내려오는 사용자 정보와 온보딩 완료 여부를 함께 확인합니다.

3. Itineraries 연결
   - 생성된 일정 저장, 마이페이지 목록, 상세 조회, 삭제 흐름을 `itinerariesApi`로 연결합니다.
   - 백엔드의 `itinerary_items` / `days.items` 응답을 현재 프론트 `SavedPlan` 구조로 안정적으로 변환합니다.

4. Reactions 연결
   - 좋아요/싫어요/해제 상태를 `reactionsApi`로 연결합니다.
   - `reactionType`은 `like`, `dislike`, `null`만 UI 상태로 들어오도록 유지합니다.

5. Recommendations 연결
   - 추천 생성은 가장 마지막에 연결합니다.
   - LangGraph 기반 MVP 응답 shape와 이후 AgentCore 확장 shape가 흔들릴 수 있으므로, 프론트는 `recommendationsApi` adapter를 통해서만 추천 결과를 받습니다.

6. 환경 변수 설정
   - 실제 API Gateway 또는 SAM local 주소는 `frontend/.env.local`에 `VITE_LOVV_API_BASE_URL`로 설정합니다.
   - 실제 값은 Git에 올리지 않고, `frontend/.env.example`에는 예시 값만 유지합니다.

## License

See [LICENSE](./LICENSE).
