# 📱 Booking Calendar — Mobile Compact Redesign (v2.1)

You are a senior front-end engineer. Refactor the existing Booking Calendar UI for **compact mobile layout**. Remove duplicated information, reduce vertical footprint, and keep touch targets accessible.

## Goals
- **달력 + 시간 선택**이 모바일 첫 화면(375×812 기준)에서 **스크롤 없이** 거의 보이도록 압축.
- **중복 정보 제거**로 텍스트 밀도 축소.
- **터치 최소 44×44**는 유지하되, 여백/글자/테두리를 줄여 전체 높이를 최소화.
- 데스크톱은 기존 레이아웃 유지(좌 달력 / 우 시간 패널).

---

## Remove / Merge (중복 제거)
1) **"선택된 예약 일정" 카드 삭제.**  
   - 시간대 패널 헤더 아래 한 줄 요약만 남김:  
     `선택됨 · 2025-08-29(금) · 저녁(18:00–20:00)`
2) 시간대 선택 아래 **상태 안내 문구("예약 가능 시간대입니다") 제거**. 선택되면 요약 라인에만 반영.
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

- **Desktop (`md+`)**
  - 기존 그리드 레이아웃 유지: `md:grid md:grid-cols-[360px,1fr] md:gap-6`