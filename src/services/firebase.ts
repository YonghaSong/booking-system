import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 설정 (환경 변수 사용)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스
export const db = getFirestore(app);

// 개발 환경에서 Firestore 에뮬레이터 사용 (선택사항)
if (import.meta.env.DEV && !import.meta.env.VITE_USE_FIREBASE_PROD) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firestore emulator already connected or unavailable:', error);
  }
}

export default app;