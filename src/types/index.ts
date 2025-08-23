// 해충 유형
export type PestType = 'cockroach' | 'ant' | 'termite' | 'mouse' | 'other';

// 시간대
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

// 예약 상태
export type BookingStatus = 'received' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// 예약 데이터 인터페이스 (CLAUDE.md 데이터 모델 기준)
export interface Booking {
  id: string;                    // Firestore 문서 ID
  bookingNumber: string;         // 8자리 고객 참조번호
  
  // 고객 정보
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceAddress: string;
  
  // 서비스 상세
  pestType: PestType;
  pestDescription?: string;
  preferredDate: string;         // YYYY-MM-DD 형식
  timeSlot: TimeSlot;
  urgentService: boolean;
  
  // 상태 추적
  status: BookingStatus;
  adminNotes?: string;
  estimatedPrice?: number;
  
  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;
}

// 예약 생성 시 사용할 입력 데이터 (ID와 타임스탬프 제외)
export interface BookingInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceAddress: string;
  pestType: PestType;
  pestDescription?: string;
  preferredDate: string;
  timeSlot: TimeSlot;
  urgentService: boolean;
}

// 해충 유형 라벨 (한국어)
export const PEST_TYPE_LABELS: Record<PestType, string> = {
  cockroach: '바퀴벌레',
  ant: '개미',
  termite: '흰개미',
  mouse: '쥐',
  other: '기타'
};

// 시간대 라벨 (한국어)
export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '오전 (09:00-12:00)',
  afternoon: '오후 (13:00-17:00)',
  evening: '저녁 (18:00-20:00)'
};

// 예약 상태 라벨 (한국어)
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  received: '접수됨',
  confirmed: '확인됨',
  in_progress: '진행중',
  completed: '완료',
  cancelled: '취소됨'
};