import type { ChatFlowPayload } from '../flows/homeChatFlow';
import { generateBookingNumber } from '../utils/generateId';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface ChatFlowBookingResponse {
  bookingNumber: string;
  id: string;
  timestamp: string;
}

/**
 * 챗봇형 플로우 예약 데이터를 Firestore에 저장
 */
export async function submitChatFlowBooking(payload: ChatFlowPayload): Promise<ChatFlowBookingResponse> {
  try {
    // 8자리 예약번호 생성
    const bookingNumber = generateBookingNumber();
    
    // Firestore 문서 데이터 구성
    const bookingDoc = {
      // 기본 정보
      bookingNumber,
      flowVersion: payload.flow_version,
      status: 'received', // 접수됨
      
      // 챗플로우 데이터
      issue: {
        code: payload.issue.code,
        text: payload.issue.text,
        label: getIssueLabel(payload.issue.code)
      },
      lastSeen: {
        code: payload.last_seen,
        label: getLastSeenLabel(payload.last_seen)
      },
      tenure: {
        code: payload.tenure,
        label: getTenureLabel(payload.tenure)
      },
      homeType: {
        code: payload.home_type.code,
        text: payload.home_type.text,
        label: getHomeTypeLabel(payload.home_type.code)
      },
      region: {
        macro: payload.region.macro,
        micro: payload.region.micro,
        text: payload.region.text,
        macroLabel: getRegionLabel(payload.region.macro),
        microLabel: payload.region.micro ? getSubRegionLabel(payload.region.micro) : null
      },
      
      // 일정 정보
      preferredDate: payload.schedule.date,
      timeSlot: payload.schedule.time_slot,
      timeSlotLabel: getTimeSlotLabel(payload.schedule.time_slot),
      
      // 메타데이터
      locale: payload.meta.locale,
      source: payload.meta.source,
      submittedAt: payload.meta.timestamp,
      
      // 기존 시스템과의 호환성을 위한 필드들
      customerName: '', // 추후 수집 예정
      customerPhone: '', // 추후 수집 예정
      customerEmail: '', // 추후 수집 예정
      serviceAddress: '', // 추후 수집 예정
      pestType: mapIssueToPestType(payload.issue.code),
      pestDescription: payload.issue.text || '',
      urgentService: false,
      
      // 관리용 필드
      adminNotes: '',
      estimatedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Firestore에 저장
    const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
    
    return {
      bookingNumber,
      id: docRef.id,
      timestamp: bookingDoc.createdAt
    };
    
  } catch (error) {
    console.error('예약 저장 실패:', error);
    throw new Error('예약 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 헬퍼 함수들
function getIssueLabel(code: string): string {
  const labels: Record<string, string> = {
    'ISSUE_ROACH': '바퀴벌레',
    'ISSUE_ANT': '개미',
    'ISSUE_FLY': '파리/모기',
    'ISSUE_MITE': '진드기/응애',
    'ISSUE_MOTH': '나방/좀벌레',
    'ISSUE_OTHER_TEXT': '기타'
  };
  return labels[code] || '알 수 없음';
}

function getLastSeenLabel(code: string): string {
  const labels: Record<string, string> = {
    'SEEN_TODAY': '오늘',
    'SEEN_3D': '2-3일 전',
    'SEEN_1W': '일주일 전',
    'SEEN_1M': '한달 전',
    'SEEN_LONG': '오래전'
  };
  return labels[code] || '알 수 없음';
}

function getTenureLabel(code: string): string {
  const labels: Record<string, string> = {
    'TENURE_1M': '1개월 미만',
    'TENURE_6M': '1-6개월',
    'TENURE_6_12M': '6-12개월',
    'TENURE_1Y': '1-3년',
    'TENURE_3Y': '3년 이상'
  };
  return labels[code] || '알 수 없음';
}

function getHomeTypeLabel(code: string): string {
  const labels: Record<string, string> = {
    'HOME_APT': '아파트',
    'HOME_VILLA': '빌라/연립',
    'HOME_HOUSE': '단독주택',
    'HOME_OFFICETEL': '오피스텔',
    'HOME_OTHER_TEXT': '기타'
  };
  return labels[code] || '알 수 없음';
}

function getRegionLabel(code: string): string {
  const labels: Record<string, string> = {
    'REGION_SEOUL': '서울',
    'REGION_GYEONGGI': '경기도',
    'REGION_INCHEON': '인천',
    'REGION_OTHER_TEXT': '기타 지역'
  };
  return labels[code] || '알 수 없음';
}

function getSubRegionLabel(code: string): string {
  const labels: Record<string, string> = {
    'SEOUL_GANGNAM': '강남구',
    'SEOUL_GANGDONG': '강동구',
    'SEOUL_GANGBUK': '강북구',
    'SEOUL_GANGSEO': '강서구',
    'SEOUL_GWANAK': '관악구',
    'SEOUL_GWANGJIN': '광진구',
    'SEOUL_GURO': '구로구',
    'SEOUL_GEUMCHEON': '금천구',
    'SEOUL_NOWON': '노원구',
    'SEOUL_DOBONG': '도봉구',
    'SEOUL_DONGDAEMUN': '동대문구',
    'SEOUL_DONGJAK': '동작구',
    'SEOUL_MAPO': '마포구',
    'SEOUL_SEODAEMUN': '서대문구',
    'SEOUL_SEOCHO': '서초구',
    'SEOUL_SEONGDONG': '성동구',
    'SEOUL_SEONGBUK': '성북구',
    'SEOUL_SONGPA': '송파구',
    'SEOUL_YANGCHEON': '양천구',
    'SEOUL_YEONGDEUNGPO': '영등포구',
    'SEOUL_YONGSAN': '용산구',
    'SEOUL_EUNPYEONG': '은평구',
    'SEOUL_JONGNO': '종로구',
    'SEOUL_JUNG': '중구',
    'SEOUL_JUNGNANG': '중랑구'
  };
  return labels[code] || '알 수 없음';
}

function getTimeSlotLabel(timeSlot: string): string {
  const labels: Record<string, string> = {
    '09:00': '오전 (09:00-12:00)',
    '14:00': '오후 (14:00-17:00)',
    '18:00': '저녁 (18:00-20:00)'
  };
  return labels[timeSlot] || '알 수 없음';
}

function mapIssueToPestType(issueCode: string): string {
  // 기존 PestType과 매핑
  const mapping: Record<string, string> = {
    'ISSUE_ROACH': 'cockroach',
    'ISSUE_ANT': 'ant',
    'ISSUE_FLY': 'fly',
    'ISSUE_MITE': 'mite',
    'ISSUE_MOTH': 'moth',
    'ISSUE_OTHER_TEXT': 'other'
  };
  return mapping[issueCode] || 'other';
}