# 벌레없음 예약 — 챗봇형 질문 + 캘린더(날짜/시간) 선택 통합 업데이트 지시서

**목표**  
1) 기존 페이지에서 불필요한 섹션 제거  
2) **버튼형 질문 플로우**(가정집 전용 MECE) → **캘린더 날짜/시간 선택** → **제출** 구조로 단순화  
3) 현재는 **캘린더로만 선택** (드롭다운 일반 시간 선택 없음)  
4) 결과 페이로드를 한 번에 제출하도록 정리

---

## 0. 변경 요약 (한눈에)
- 상단: 챗봇형 질문 5단계 (문제 유형 → 마지막 목격 → 거주 기간 → 주거 형태 → 지역)  
- 중단: **캘린더 날짜 선택 + 그 날짜의 가능한 시간 슬롯** 버튼(또는 리스트)  
- 하단: 요약 카드 + 제출 버튼  
- 기존의 기타 고객 정보 입력 폼/불필요 섹션은 **임시로 주석 처리** 또는 **컴포넌트 제거**

---

## 1. 파일/폴더 작업 지시

> 프론트엔드가 React 기준인 것으로 가정. 파일 경로명은 상황에 따라 맞춰 수정. (Vite/CRA 상관 없음)

- 생성/수정:
  - `src/flows/homeChatFlow.ts` : **코드값 상수 + 검증 로직 + 초기 상태**
  - `src/components/ChatFlow.tsx` : **버튼형 질문 UI** (단계별)
  - `src/components/CalendarPicker.tsx` : **캘린더 + 시간 슬롯 선택 UI**
  - `src/pages/BookingPage.tsx` : 기존 페이지 정리 및 **ChatFlow + CalendarPicker + Summary** 조립
  - `src/api/submitBooking.ts` : 제출 API 훅/함수 (현재 백엔드 없으면 mock 처리)

- 제거/주석:
  - 기존 `BookingPage` 내 “나머지 정보” 섹션(주소/메모/부가 필드 등)은 **주석 처리**
  - 기존 시간 일반선택 드롭다운/셀렉트 UI는 **삭제** (캘린더만 사용)

---

## 2. 데이터 스키마 (제출 Payload)

```json
{
  "flow_version": "home-1.0.0",
  "issue": { "code": "ISSUE_ROACH", "text": null },
  "last_seen": "SEEN_3D",
  "tenure": "TENURE_6_12M",
  "home_type": { "code": "HOME_APT", "text": null },
  "region": { "macro": "REGION_SEOUL", "micro": "SEOUL_SONGPA", "text": null },
  "schedule": {
    "date": "2025-09-01",
    "time_slot": "14:00"
  },
  "meta": {
    "locale": "ko-KR",
    "source": "web",
    "timestamp": "ISO8601"
  }
}
```

규칙  
- `…_OTHER_TEXT` 선택 시에만 `text` 채움  
- 지역은 `macro`(광역) + `micro`(세부) 또는 `text`(기타)  
- 날짜/시간은 캘린더 기반. 시간 슬롯은 **해당 날짜 선택 시 동적 생성**

---

(이하 전체 지시 내용 포함됨 — ChatFlow.tsx, CalendarPicker.tsx, BookingPage.tsx, submitBooking.ts 예시 코드 등)
