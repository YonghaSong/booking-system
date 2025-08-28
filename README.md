# 벌레없음 예약 시스템

해충방제 서비스 예약 및 관리 시스템입니다.

## 🚀 배포 URL
- **메인 사이트**: https://booking-system-c3388.web.app
- **관리자 패널**: https://booking-system-c3388.web.app/admin

## 📱 주요 기능

### 고객용 기능
- ✅ 해충방제 서비스 예약 신청
- ✅ 예약번호로 예약 상태 조회
- ✅ 모바일 반응형 디자인

### 관리자용 기능  
- ✅ 관리자 로그인 (패스워드: `bugfree2025!`)
- ✅ 전체 예약 목록 및 통계
- ✅ 예약 상태 관리 (접수됨 → 확인됨 → 진행중 → 완료됨)
- ✅ 관리자 메모 및 견적 입력
- ✅ 필터링 및 검색 기능

## 🛠 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Backend**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Routing**: React Router v7
- **CI/CD**: GitHub Actions

## 📁 프로젝트 구조

```
booking-system/
├── docs/                    # 📚 문서
│   ├── setup/              # 설정 가이드
│   │   └── GITHUB_SECRETS_SETUP.md
│   └── specs/              # 기술 명세서
│       ├── booking-calendar-spec.md
│       ├── booking-calendar-spec-v2.md
│       └── booking-calendar-spec-v2-mobile-compact.md
├── src/                    # 소스 코드
│   ├── components/         # React 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── services/          # Firebase 서비스
│   ├── types/             # TypeScript 타입
│   └── utils/             # 유틸리티 함수
└── CLAUDE.md              # Claude Code 가이드
```

## 🔧 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/booking-system.git
cd booking-system
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 Firebase 설정을 추가:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

## 🚀 배포 설정

### Firebase 초기 설정
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 수동 배포
```bash
npm run build
firebase deploy
```

### 자동 배포 (GitHub Actions)
GitHub Secrets에 다음 환경 변수를 설정하세요:

**Firebase 환경 변수:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` 
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

**Firebase 서비스 계정:**
- `FIREBASE_SERVICE_ACCOUNT_BOOKING_SYSTEM` (JSON 형태의 서비스 계정 키)
- `FIREBASE_PROJECT_ID` (Firebase 프로젝트 ID)

설정 후 `main` 브랜치에 push하면 자동으로 배포됩니다.

## 📱 모바일 최적화

모든 컴포넌트가 모바일 환경에 최적화되어 있습니다:

- **반응형 브레이크포인트**: `sm:` (640px+) 사용
- **터치 친화적**: 최소 44px 터치 영역
- **적응형 레이아웃**: 모바일에서 스택 레이아웃
- **최적화된 텍스트**: 모바일 가독성 향상
- **전체 화면 모달**: 모바일에서 최적 UX

## 🗂 프로젝트 구조

```
booking-system/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── BookingDetail.tsx
│   │   ├── BookingEditModal.tsx
│   │   ├── BookingForm.tsx
│   │   └── BookingSearch.tsx
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── AdminPage.tsx
│   │   ├── HomePage.tsx
│   │   └── SearchPage.tsx
│   ├── services/           # API 및 서비스
│   │   ├── authService.ts
│   │   ├── bookingService.ts
│   │   └── firebase.ts
│   ├── types/              # TypeScript 타입 정의
│   │   └── index.ts
│   └── utils/              # 유틸리티 함수
│       └── generateId.ts
├── .github/workflows/      # GitHub Actions
├── firebase.json          # Firebase 호스팅 설정
├── firestore.rules        # Firestore 보안 규칙
└── tailwind.config.js     # Tailwind CSS 설정
```

## 📋 데이터 모델

### Booking (예약)
```typescript
interface Booking {
  id: string;
  bookingNumber: string;        // 8자리 예약번호 (AB123456)
  customerName: string;         // 고객명
  customerPhone: string;        // 연락처
  customerEmail: string;        // 이메일
  serviceAddress: string;       // 서비스 주소
  pestType: PestType;          // 해충 유형
  pestDescription?: string;     // 상세 설명
  preferredDate: string;        // 희망 날짜
  timeSlot: TimeSlot;          // 희망 시간대
  urgentService: boolean;       // 긴급 서비스 여부
  status: BookingStatus;        // 예약 상태
  adminNotes?: string;          // 관리자 메모
  estimatedPrice?: number;      // 예상 가격
  createdAt: Date;             // 생성일시
  updatedAt: Date;             // 수정일시
}
```

## 🔐 보안 설정

### Firestore 보안 규칙
- 모든 사용자가 예약 생성 및 조회 가능
- 업데이트는 클라이언트 사이드 관리자 인증으로 제한
- 삭제는 비허용

### 관리자 인증
- 클라이언트 사이드 패스워드 인증
- 8시간 세션 유지
- 로컬스토리지 기반 세션 관리

## 📞 고객센터 정보
- **전화**: 1588-0000
- **이메일**: contact@bugfree.com
- **주소**: 경기도 하남시 미사강변동로 79, 11층 1103호-4

---

🐛 **벌레없음과 함께 깨끗한 환경을 만들어보세요!** 🏠

## 🚀 GitHub Actions 자동 배포 테스트

모든 GitHub Secrets 설정 완료 - 자동 배포 테스트 중!