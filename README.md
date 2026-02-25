# Timer Application

React + TypeScript 타이머 앱입니다.

## 실행 방법

```bash
npm install
npm run dev
```
### 프로젝트 구조

```
src/
├── App.tsx                    # 메인 앱 컴포넌트
├── App.css                    # 스타일
├── hooks/
│   └── useTimer.ts            # 타이머 로직 커스텀 훅
└── components/
    ├── TimerDisplay.tsx       # 시간 표시 + 상태 배지
    ├── TimerControls.tsx      # Start/Pause/Reset 버튼
    └── GoalSetting.tsx        # 목표 시간 입력
```

## 설계 설명

### 시간 계산: `Date.now()` 기반

이 앱은 `Date.now()` 기준점을 저장하고, 매 렌더링마다 경과 시간을 계산합니다:

```
경과시간 = 이전 누적시간 + (Date.now() - 마지막 시작 시각)
```

- **Start**: `startTime = Date.now()` 기록
- **Pause**: `accumulated += Date.now() - startTime` 저장
- **Reset**: 모든 값 0으로 초기화
- 표시 갱신은 `setInterval(100ms)`로 하되, 시간 자체는 `Date.now()` 차이로 계산

이 방식은 브라우저 탭이 백그라운드로 가거나 CPU가 바빠도 정확한 시간을 유지합니다.

`setInterval`로 매초 카운터를 +1 하는 방식은 타이머 drift(오차)가 누적됩니다.
JavaScript의 `setInterval`은 정확한 간격을 보장하지 않기 때문입니다.

### 상태 모델

`idle` / `running` / `paused` 3가지 상태로 관리합니다.

| 상태 | Start | Pause | Reset |
|------|-------|-------|-------|
| Idle | O | X | X |
| Running | X | O | O |
| Paused | O (Resume) | X | O |

**왜 3가지로 나누었나:**

`isRunning`, `isPaused` 같은 boolean 2개로 관리하면 4가지 조합이 생깁니다.

```
isRunning: false, isPaused: false  → idle
isRunning: true,  isPaused: false  → 실행중
isRunning: false, isPaused: true   → 일시정지
isRunning: true,  isPaused: true   → 존재할 수 없는 상태
```

단일 `status` 값으로 관리하면 `'idle' | 'running' | 'paused'` 셋 중 하나만 가능하므로, 말이 안 되는 조합을 타입 수준에서 원천 차단할 수 있습니다.

### 목표 시간 기능

목표 시간을 설정하면, 경과 시간이 목표에 도달했을 때 시각적 알림(색상 변경 + 펄스 애니메이션)을 표시합니다.
타이머 실행 중에는 목표 시간을 변경할 수 없습니다.

### 기술 스택

- **React 19** + **TypeScript** — 타입 안전한 UI
- **커스텀 훅** (`useTimer`) — UI와 로직 분리, 외부 상태관리 라이브러리 불필요
- **CSS** — 간결한 스타일링
