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
  isBookable: boolean; // true if any slot is "available"
};

type MonthAvailability = {
  month: string; // "2025-09"
  days: DayAvailability[];
};
```