# booking-system GitHub 연동 및 자동 배포 설정 완료 ✅

## 📋 완료된 작업

✅ **Git 저장소 초기화**
✅ **GitHub Actions 워크플로우 설정** (Firebase 자동 배포)
✅ **환경 변수 설정 파일 준비** (.env.example)
✅ **.gitignore 설정** (보안 파일 제외)
✅ **README.md 업데이트** (배포 가이드 포함)
✅ **package.json 스크립트 추가** (배포 관련)
✅ **상세 배포 설정 가이드 작성** (DEPLOYMENT_SETUP.md)

## 🚀 다음 단계 (수동으로 진행해야 함)

### 1. GitHub 저장소 생성
```bash
# GitHub에서 새 저장소 생성: https://github.com/new
# Repository name: booking-system
# Private/Public 선택
# README, .gitignore, license 추가하지 말것 (이미 있음)
```

### 2. 원격 저장소 연결
```bash
cd "C:\Users\sayto\Desktop\booking-system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/booking-system.git
git push -u origin main
```

### 3. Firebase 프로젝트 설정
**DEPLOYMENT_SETUP.md 파일을 참고하여 진행**

1. Firebase 콘솔에서 프로젝트 생성
2. Firestore Database 설정
3. Firebase Hosting 설정
4. 서비스 계정 키 생성

### 4. GitHub Secrets 설정
**Repository Settings → Secrets and variables → Actions**

필수 Secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_PASSWORD`
- `FIREBASE_SERVICE_ACCOUNT_BOOKING_SYSTEM`
- `FIREBASE_PROJECT_ID`

### 5. 로컬 개발 환경 설정
```bash
# .env 파일 생성
cp .env.example .env
# .env 파일에 실제 Firebase 설정값 입력

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 6. 자동 배포 테스트
```bash
# main 브랜치에 변경사항 푸시하면 자동 배포됨
git add .
git commit -m "테스트 배포"
git push origin main
```

## 🔧 로컬 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행
npm run deploy       # 빌드 + Firebase 배포
npm run serve        # 로컬 Firebase 호스팅 서버
```

## 🌐 배포 후 확인사항

1. **웹사이트 접속**: `https://YOUR_PROJECT_ID.web.app`
2. **예약 폼 테스트**: 새 예약 생성
3. **예약 조회 테스트**: 예약번호로 조회
4. **관리자 패널 테스트**: `/admin` 경로
5. **모바일 반응형 확인**: 다양한 화면 크기에서 테스트

## 🔍 트러블슈팅

### GitHub Actions 실패시
1. GitHub Actions 탭에서 로그 확인
2. Secrets 설정 재확인
3. Firebase 프로젝트 권한 확인

### Firebase 연결 실패시
1. `.env` 파일의 설정값 확인
2. Firebase 콘솔에서 프로젝트 상태 확인
3. 브라우저 개발자 도구에서 네트워크 오류 확인

### 빌드 실패시
1. `npm ci` 실행하여 의존성 재설치
2. TypeScript 오류 확인 및 수정
3. ESLint 오류 확인 및 수정

## 📞 추가 지원

더 자세한 설정 방법은 `DEPLOYMENT_SETUP.md` 파일을 참고하세요.

---

🎉 **eopseumtest와 동일한 GitHub Actions 자동 배포 구조가 완성되었습니다!**