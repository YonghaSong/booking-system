# 배포 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `booking-system-[random]` (예: booking-system-c3388)
4. Google 애널리틱스 비활성화 (선택사항)

## 2. Firebase 설정

### 웹 앱 등록
1. Firebase 콘솔 → 프로젝트 설정 → 앱
2. "웹 앱" 추가
3. 앱 닉네임: `booking-system-web`
4. Firebase 호스팅 설정 체크
5. Firebase SDK 설정 정보 복사 (나중에 사용)

### Firestore Database 생성
1. Firebase 콘솔 → Firestore Database
2. "데이터베이스 만들기"
3. 프로덕션 모드로 시작
4. 위치: asia-northeast3 (서울)

### Firebase 호스팅 설정
1. Firebase 콘솔 → Hosting
2. "시작하기" 클릭
3. Firebase CLI로 설정 (로컬에서 실행)

## 3. 로컬 Firebase 설정

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (booking-system 폴더에서 실행)
firebase init

# 선택사항:
# - Firestore: Configure security rules and indexes files
# - Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

# Firestore 설정:
# - 기본 rules 파일 사용: firestore.rules
# - 기본 indexes 파일 사용: firestore.indexes.json

# Hosting 설정:
# - Public directory: dist
# - Single-page app: Yes
# - 기존 index.html 덮어쓰기: No
# - GitHub Actions 자동 배포 설정: No (수동으로 설정할 예정)
```

## 4. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret

### Firebase 환경 변수 (프론트엔드용)
```
VITE_FIREBASE_API_KEY = "your-api-key"
VITE_FIREBASE_AUTH_DOMAIN = "your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID = "your-project-id"
VITE_FIREBASE_STORAGE_BUCKET = "your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID = "123456789"
VITE_FIREBASE_APP_ID = "1:123456789:web:abcdef"
VITE_ADMIN_PASSWORD = "your-admin-password"
```

### Firebase 서비스 계정 (CI/CD용)
1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드
4. JSON 파일 내용을 복사하여 GitHub Secrets에 추가:

```
FIREBASE_SERVICE_ACCOUNT_BOOKING_SYSTEM = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 프로젝트 ID
```
FIREBASE_PROJECT_ID = "your-project-id"
```

## 5. 로컬 환경 변수 설정

`.env` 파일 생성 (`.env.example` 참고):
```bash
cp .env.example .env
# .env 파일을 편집하여 실제 값으로 변경
```

## 6. Firestore 보안 규칙 설정

`firestore.rules` 파일이 다음과 같이 설정되어 있는지 확인:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 예약 컬렉션: 모든 사용자가 생성 및 조회 가능, 업데이트 가능
    match /bookings/{document} {
      allow read, create, update: if true;
      allow delete: if false;
    }
  }
}
```

## 7. 첫 배포 테스트

### 로컬 테스트
```bash
npm run dev
# http://localhost:5173 에서 테스트
```

### 수동 배포 테스트
```bash
npm run build
firebase deploy
```

### GitHub Actions 자동 배포
1. 모든 설정 완료 후 GitHub에 푸시:
```bash
git add .
git commit -m "Initial setup with Firebase integration"
git push origin main
```

2. GitHub Actions 탭에서 배포 진행 상황 확인

## 8. 도메인 설정 (선택사항)

Firebase 콘솔 → Hosting → 사용자 정의 도메인에서 설정

## 트러블슈팅

### 일반적인 오류들

1. **Firebase 프로젝트 ID 불일치**
   - `.firebaserc` 파일의 프로젝트 ID 확인
   - GitHub Secrets의 `FIREBASE_PROJECT_ID` 확인

2. **서비스 계정 권한 오류**
   - 서비스 계정에 "Firebase Hosting Admin" 역할 부여
   - IAM 설정에서 권한 확인

3. **환경 변수 오류**
   - GitHub Secrets 이름과 workflow 파일의 변수명 일치 확인
   - Vite 환경 변수는 `VITE_` 접두사 필요

4. **Build 오류**
   - `npm ci` 대신 `npm install` 시도
   - Node.js 버전 확인 (현재 설정: Node.js 20)

### 유용한 명령어

```bash
# Firebase 프로젝트 확인
firebase projects:list

# 현재 프로젝트 확인  
firebase use

# 프로젝트 전환
firebase use your-project-id

# 로컬 호스팅 서버 실행
firebase serve --only hosting

# 로그 확인
firebase functions:log
```