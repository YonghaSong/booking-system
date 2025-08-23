# GitHub Secrets 설정 가이드

## 🔐 필수 GitHub Secrets 설정

**GitHub 저장소** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. Firebase 환경 변수 (프론트엔드용)

Firebase 콘솔 → 프로젝트 설정 → 일반 탭 → "내 앱" 섹션에서 확인

```
VITE_FIREBASE_API_KEY
값: AIzaSyC... (Firebase 콘솔에서 확인)

VITE_FIREBASE_AUTH_DOMAIN  
값: booking-system-c3388.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
값: booking-system-c3388

VITE_FIREBASE_STORAGE_BUCKET
값: booking-system-c3388.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID
값: 1031450086866 (Firebase 콘솔에서 확인)

VITE_FIREBASE_APP_ID
값: 1:1031450086866:web:... (Firebase 콘솔에서 확인)

VITE_ADMIN_PASSWORD
값: bugfree2025! (또는 원하는 관리자 비밀번호)
```

### 2. Firebase 서비스 계정 (CI/CD용)

#### 서비스 계정 키 생성:
1. **Firebase 콘솔** → **프로젝트 설정** → **서비스 계정** 탭
2. **"새 비공개 키 생성"** 버튼 클릭
3. **JSON 파일 다운로드** 
4. JSON 파일 내용 전체를 복사

#### GitHub Secrets 설정:
```
FIREBASE_SERVICE_ACCOUNT_BOOKING_SYSTEM
값: {
  "type": "service_account",
  "project_id": "booking-system-c3388",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@booking-system-c3388.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}

FIREBASE_PROJECT_ID
값: booking-system-c3388
```

## 🚀 자동 배포 테스트

모든 Secrets 설정 완료 후:

```bash
# 테스트 변경사항 추가
echo "# 자동 배포 테스트" >> README.md
git add .
git commit -m "GitHub Actions 자동 배포 테스트"
git push origin main
```

## ✅ 확인사항

1. **GitHub Actions 탭**에서 워크플로우 실행 상태 확인
2. **배포 완료 후 웹사이트 접속**: https://booking-system-c3388.web.app
3. **기능 테스트**:
   - 예약 생성
   - 예약 조회  
   - 관리자 패널 (/admin)

## 🔧 트러블슈팅

### Actions 실패시
- **Secrets 이름 정확히 확인** (대소문자, 언더스코어 등)
- **JSON 형식 검증** (trailing comma, 줄바꿈 등)
- **Firebase 프로젝트 권한** 확인

### 웹사이트 오류시
- **브라우저 개발자 도구** → Console 탭에서 오류 확인
- **Firebase 콘솔** → Functions, Firestore 상태 확인