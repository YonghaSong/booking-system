
# 📑 booking-calendar-spec.md

## Overview
This spec defines the **Booking Calendar UI** for the pest control booking system.  
The component must integrate with the existing **React 19 + TypeScript + Tailwind + Firebase Firestore** architecture.

### Goals
- Render a **calendar view** where only available dates can be selected.  
- Show **disabled (gray)** state for unavailable dates.  
- Display **3 round buttons (morning / afternoon / evening)** per date.  
- Handle both **desktop (inline slots)** and **mobile (bottom sheet slots)** layouts.

---

## Tech Stack Alignment
- **Frontend**: React 19 + TypeScript + Vite  
- **Styling**: Tailwind CSS v3 (mobile-first)  
- **Routing**: React Router v7 (SPA model)  
- **Backend**: Firebase Firestore for availability data  
- **Hosting**: Firebase Hosting (SPA config)  

---

## Component Architecture
```
src/
 ├─ components/
 │   ├─ BookingCalendar.tsx       # main calendar UI
 │   ├─ CalendarHeader.tsx        # month navigation
 │   ├─ SlotButtons.tsx           # time slot round buttons
 │
 ├─ lib/
 │   ├─ api.ts                    # fetchAvailability() implementation (Firestore or mock)
 │   ├─ date.ts                   # calendar matrix utils
 │
 ├─ types/
 │   └─ booking.ts                # SlotKey, Availability, MonthAvailability types
```

---

## Component API
```ts
type SlotKey = "morning" | "afternoon" | "evening";

type AvailabilityStatus = "available" | "full" | "closed";

type DayAvailability = {
  date: string; // "2025-09-10"
  slots: Record<SlotKey, AvailabilityStatus>;
  isBookable: boolean;
};

type MonthAvailability = {
  month: string; // "2025-09"
  days: DayAvailability[];
};

type BookingCalendarProps = {
  initialMonth?: string;
  value?: { date?: string; slot?: SlotKey };
  onChange?: (next: { date: string; slot: SlotKey }) => void;
  fetchAvailability: (month: string) => Promise<MonthAvailability>;
  locale?: "ko" | "en";
};
```

---

## UX / UI Rules
- **Available date**: white background, clickable.  
- **Unavailable date**: gray background, disabled.  
- **Selected date**: highlighted with brand color (`bg-blue-600 text-white`).  
- **Slot buttons**: round, with available/disabled/selected states.  

### Responsive behavior
- **Desktop (`md+`)**: Show slot buttons directly inside the cell.  
- **Mobile (`<md`)**: On day tap, open bottom sheet with 3 slot buttons.  

---

## Accessibility
- Calendar uses `role="grid"` and ARIA attributes (`aria-selected`, `aria-disabled`).  
- Slots grouped with `role="radiogroup"`.  
- Full keyboard navigation: arrow keys for day movement, Enter/Space for selection.  
- Screenreader text: `"YYYY년 MM월 DD일 (요일) - [가능/불가], 시간대 [오전/오후/저녁]"`.

---

## Data Contract
`GET /api/availability?month=2025-09` returns:
```json
{
  "month": "2025-09",
  "days": [
    { "date": "2025-09-01", "isBookable": false,
      "slots": { "morning":"closed","afternoon":"closed","evening":"closed" } },
    { "date": "2025-09-10", "isBookable": true,
      "slots": { "morning":"available","afternoon":"available","evening":"available" } }
  ]
}
```

---

## Firebase Integration
- **Firestore collection**: `availability`  
- Document format:
```json
{
  "date": "2025-09-10",
  "slots": { "morning":"available","afternoon":"full","evening":"closed" },
  "isBookable": true
}
```
- `fetchAvailability` queries Firestore for all days in a month.

---

## Development Commands
```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview build
npm run deploy    # Firebase Hosting deploy
```
