
# 📱 Booking Calendar — Mobile Compact Redesign (v2.1)

You are a senior front-end engineer. Refactor the existing Booking Calendar UI for **compact mobile layout**. Remove duplicated information, reduce vertical footprint, and keep touch targets accessible.

## Goals
- **달력 + 시간 선택**이 모바일 첫 화면(375×812 기준)에서 **스크롤 없이** 거의 보이도록 압축.
- **중복 정보 제거**로 텍스트 밀도 축소.
- **터치 최소 44×44**는 유지하되, 여백/글자/테두리를 줄여 전체 높이를 최소화.
- 데스크톱은 기존 레이아웃 유지(좌 달력 / 우 시간 패널).

---

## Remove / Merge (중복 제거)
1) **“선택된 예약 일정” 카드 삭제.**  
   - 시간대 패널 헤더 아래 한 줄 요약만 남김:  
     `선택됨 · 2025-08-29(금) · 저녁(18:00–20:00)`
2) 시간대 선택 아래 **상태 안내 문구(“예약 가능 시간대입니다”) 제거**. 선택되면 요약 라인에만 반영.
3) **아이콘 남발 금지.** 헤더에 아이콘 1개(시계)만 사용, 나머지는 텍스트로.
4) 달력 하단 **범례(선택됨/예약가능/예약불가)** 숨김.  
   - `aria-label`과 시각적 상태(색/테두리)로 구분. 접근성은 SR 텍스트로 보완.

---

## Layout
- **Mobile (`<md`)**
  - 상위: `px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] space-y-3`
  - 달력 카드: `p-2` / 셀 간격 `gap-1`
  - 시간 패널 카드: `p-3`
  - 하단 CTA 바(선택 시만): `fixed inset-x-0 bottom-0 z-50 bg-white border-t p-2`
    - 버튼: `h-11 rounded-lg w-full` (텍스트 `다음` 또는 `확인`)
- **Desktop (`md+`)**
  - 2컬럼 유지: `md:grid md:grid-cols-[360px,1fr] md:gap-6`
  - 우측 패널: `md:sticky md:top-4`

---

## Calendar Compaction (Tailwind)
- 그리드: `grid grid-cols-7 gap-1`
- 요일 헤더: `text-[10px] text-gray-500`
- 날짜 셀: `size-11 md:size-12 rounded-lg border flex items-center justify-center`
  - 가능: `bg-white border-gray-200 hover:bg-gray-50`
  - 불가: `bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed`
  - 선택: `ring-2 ring-blue-600`
- 월 외 셀은 회색 톤만(테두리 X).

---

## Time Slot Panel (압축)
- 헤더(1줄): `text-sm font-medium` — 예: `2025년 8월 29일(금) · 시간대 선택`
- **세그먼트 컨트롤**로 변경(원형 칩 → 높이 절감)
  - 래퍼: `grid grid-cols-3 gap-1 rounded-lg border p-1 bg-white`
  - 버튼: `h-9 text-[13px] rounded-md border`
    - available: `bg-white border-gray-300`
    - selected: `bg-blue-600 text-white border-blue-600`
    - disabled: `bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed`
  - 라벨은 짧게: `오전 / 오후 / 저녁` (서브텍스트 제거)
- 선택 요약(1줄, 버튼 아래):
  - `text-xs text-emerald-600` 예: `선택됨 · 저녁(18:00–20:00)`
- 추가 옵션(예: 긴급 서비스)은 **접기**(기본 접힘).

---

## Accessibility
- 달력: `role="grid"`, 셀: `role="gridcell"`, `aria-selected`/`aria-disabled`
- 세그먼트: `role="radiogroup"`, 각 버튼: `role="radio" aria-checked`
- 선택 요약은 `aria-live="polite"`로 변경 사항 알림
- 터치 타겟 44×44 보장(버튼 `h-9`이라면 클릭 영역에 `py-2`로 확장)

---

## State & Flow
- 날짜 클릭 → 시간 패널의 세그먼트 갱신
- 시간 선택 시 하단 CTA 활성화 (미선택 시 숨김/비활성)
- CTA 클릭 → `{ date, slot }` emit

---

## Implementation Tasks
1) **중복 UI 제거**: “선택된 예약 일정” 카드 제거, 상태 라벨 텍스트 단일화
2) **SlotButtons → SegmentedControl**로 교체(모바일 공용)
3) **Mobile CTA 바 추가**: `ConfirmBar.tsx` (선택된 경우만 표시, safe-area 반영)
4) Tailwind 사이즈 다운스케일: `p-4→p-2/3`, `gap-3→gap-1/2`, `text-sm→text-xs`
5) iPhone 12/13 mini(375×812) 기준으로 첫 화면 진입 시 **달력 + 시간 세그먼트 + CTA**가 보이도록 여백 조정

---

## Acceptance Criteria
- 375×812에서 **스크롤 없이** 핵심 요소(달력, 시간 세그먼트, CTA) 노출
- 겹침/오버플로우 없음, 중복 문구 없음
- 선택 흐름: 날짜 → 시간 → CTA → `{date, slot}` 한 화면 내에서 명확
- 접근성 속성 및 키보드 내비 유지

---

## Optional (데스크톱)
- 데스크톱에서도 세그먼트 컴포넌트를 공용으로 사용해 디자인 일관성 확보(권장)
