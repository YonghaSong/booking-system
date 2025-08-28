# 📑 booking-calendar-spec.md — v2 (Calendar/Time 영역 분리)

## Overview
이 문서는 **예약 달력 UI**의 레이아웃과 상호작용을 업데이트한다.  
핵심 목표는 **달력과 시간 선택 UI를 물리적으로 분리**하여, 날짜 선택 시 **별도 영역(데스크톱: 우측 고정 / 모바일: 하단 고정)** 에서 시간대 슬롯을 선택하도록 하는 것이다.

### Changes at a Glance
- 날짜 셀 내부의 **슬롯 버튼(오전/오후/저녁) 전부 제거** → 겹침/오버플로우 원인 차단
- **TimeSlotPanel** 컴포넌트 신규 도입 (분리된 시간 선택 영역)
- 레이아웃을 **2컬럼 그리드(데스크톱)** + **모바일 하단 패널**로 재구성
- 월/일/슬롯 데이터 접근 API를 월 단위와 일 단위로 명확히 분리

---

## Layout
### Desktop (`md+`)
- 상위 컨테이너: `md:grid md:grid-cols-[360px,1fr] md:gap-6`
- 좌측: **BookingCalendar**(달력) 카드
- 우측: **TimeSlotPanel**(시간) 카드 — `md:sticky md:top-4 max-h-[70vh] overflow-y-auto`

### Mobile (`<md`)
- 달력은 페이지 본문에 표시
- 날짜 선택 시 **하단 고정 패널**로 TimeSlotPanel 노출  
  - `fixed inset-x-0 bottom-0 z-50 bg-white border-t p-4 shadow-2xl`
  - 닫기 버튼 제공

---

## File Structure
```
src/
 ├─ components/
 │   ├─ BookingCalendar.tsx       # 달력 UI (날짜 선택만 담당)
 │   ├─ CalendarHeader.tsx        # 월 이동, 라벨
 │   ├─ TimeSlotPanel.tsx         # 분리된 시간 선택 패널(신규)
 │
 ├─ pages/
 │   └─ BookingPage.tsx           # 레이아웃/상태 조합 (예시)
 │
 ├─ lib/
 │   ├─ api.ts                    # fetchMonthAvailability, fetchDaySlots
 │   └─ date.ts                   # 달력 매트릭스 유틸
 │
 └─ types/
     └─ booking.ts                # 타입 정의
```

---

## Types
```ts
export type SlotKey = "morning" | "afternoon" | "evening";
export type SlotStatus = "available" | "full" | "closed";

export type DayAvailability = {
  date: string; // "2025-08-27"
  slots: Record<SlotKey, SlotStatus>;
  isBookable: boolean;
};

export type MonthAvailability = {
  month: string; // "2025-08"
  days: DayAvailability[];
};
```

---

## Component Contracts
### BookingCalendar.tsx
- Props
```ts
type BookingCalendarProps = {
  initialMonth?: string;
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  fetchMonthAvailability: (month: string) => Promise<MonthAvailability>;
  locale?: "ko" | "en";
};
```
- Responsibilities
  - 월 단위 가용성 로딩/표시
  - 날짜 활성/비활성, 선택 처리
  - **슬롯 버튼 렌더링 없음**

### TimeSlotPanel.tsx (신규)
- Props
```ts
type TimeSlotPanelProps = {
  selectedDate?: string; // 미선택 시 빈 상태 메시지
  fetchDaySlots: (date: string) => Promise<Record<SlotKey, SlotStatus>>;
  value?: { date?: string; slot?: SlotKey };
  onChange?: (next: { date: string; slot: SlotKey }) => void;
  openInMobile?: boolean;       // <md에서 패널 오픈 여부
  onCloseMobile?: () => void;   // 하단 패널 닫기
};
```
- UI
  - 헤더: `YYYY년 M월 D일 (요일)` + 캘린더 아이콘
  - 슬롯 라디오 버튼(3개): `오전 / 오후 / 저녁`
    - base: `w-24 h-12 rounded-full border text-sm font-medium flex items-center justify-center`
    - available: `bg-white border-gray-300 hover:bg-gray-50`
    - selected: `bg-blue-600 text-white border-blue-600`
    - disabled(full/closed): `bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed`
  - 상태 라벨: `예약가능 / 마감 / 휴무`

### BookingPage.tsx (예시 스켈레톤)
```tsx
<section className="md:grid md:grid-cols-[360px,1fr] md:gap-6">
  <div>
    <BookingCalendar
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      fetchMonthAvailability={fetchMonthAvailability}
    />
  </div>

  <div className="hidden md:block">
    <aside className="sticky top-4">
      <TimeSlotPanel
        selectedDate={selectedDate}
        fetchDaySlots={fetchDaySlots}
        value={value}
        onChange={handleChange}
      />
    </aside>
  </div>

  {isMobile && selectedDate && (
    <TimeSlotPanel
      selectedDate={selectedDate}
      fetchDaySlots={fetchDaySlots}
      value={value}
      onChange={handleChange}
      openInMobile
      onCloseMobile={() => setSelectedDate(undefined)}
    />
  )}
</section>
```

---

## API
### 월 단위 가용성
```ts
fetchMonthAvailability(month: string): Promise<MonthAvailability>
// GET /api/availability?month=2025-08
```
### 일 단위 슬롯
```ts
fetchDaySlots(date: string): Promise<{ morning: SlotStatus; afternoon: SlotStatus; evening: SlotStatus; }>
// GET /api/availability/day?date=2025-08-27
```

---

## Styles (No-Overlap Rules)
- Day cell (겹침 방지):
  - base: `relative aspect-square p-1 flex items-start justify-start rounded-lg border`
  - disabled: `bg-gray-100 text-gray-400 cursor-not-allowed opacity-60`
  - selected: `ring-2 ring-blue-600`
  - **주의: 날짜 셀 내부에 어떤 슬롯 버튼도 렌더하지 않는다**
- Side panel (desktop):
  - `md:sticky md:top-4 max-h-[70vh] overflow-y-auto`
- Bottom sheet (mobile):
  - `fixed inset-x-0 bottom-0 z-50 bg-white border-t p-4 shadow-2xl`

---

## Accessibility
- Calendar: `role="grid"` / rows `role="row"` / cells `role="gridcell"` + `aria-selected`, `aria-disabled`
- TimeSlotPanel: `role="radiogroup"` / 버튼 `role="radio" aria-checked`
- 키보드:
  - 달력: 방향키, Home/End, PageUp/PageDown, Enter/Space
  - 패널: Tab/Arrow 이동, Enter/Space 선택
- `aria-live="polite"`로 날짜 변경 시 패널 헤더를 공지

---

## Edge Cases & Errors
- `selectedDate`가 비가용: 패널에 "해당 날짜는 예약 불가" 메시지 + 다른 날짜 선택 유도
- API 실패: 패널 상단 경고 배너 + 재시도 버튼
- 월 변경으로 `selectedDate`가 범위 이탈: `selectedDate` 초기화

---

## Tests
- 날짜 클릭 → 패널에 해당 날짜 슬롯 노출
- `full/closed` 슬롯 클릭 불가
- 모바일에서 하단 패널 표시/닫기 동작
- 달력 내부에서 슬롯 버튼이 **렌더되지 않음**을 보장
- 반응형 레이아웃에서 오버플로우/겹침이 발생하지 않음

---

## Done Criteria
- 겹침 완전 해소(셀 내부 슬롯 제거)
- 데스크톱 우측 고정 패널 / 모바일 하단 고정 패널에서만 시간 선택
- `onChange({ date, slot })` 정상 발생
- 로딩/에러/빈 상태 처리, a11y 준수