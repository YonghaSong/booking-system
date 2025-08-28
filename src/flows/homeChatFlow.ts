// 가정집 전용 MECE 챗봇형 질문 플로우
export const HOME_CHAT_FLOW_VERSION = "home-1.0.0";

// 1단계: 문제 유형
export const ISSUE_TYPES = {
  ISSUE_ROACH: { code: "ISSUE_ROACH", label: "바퀴벌레", description: "바퀴벌레를 발견했어요" },
  ISSUE_ANT: { code: "ISSUE_ANT", label: "개미", description: "개미가 줄지어 다녀요" },
  ISSUE_FLY: { code: "ISSUE_FLY", label: "파리/모기", description: "파리나 모기가 많아요" },
  ISSUE_MITE: { code: "ISSUE_MITE", label: "진드기/응애", description: "진드기나 응애가 보여요" },
  ISSUE_MOTH: { code: "ISSUE_MOTH", label: "나방/좀벌레", description: "나방이나 좀벌레가 있어요" },
  ISSUE_OTHER_TEXT: { code: "ISSUE_OTHER_TEXT", label: "기타", description: "다른 해충이 있어요" }
} as const;

// 2단계: 마지막 목격
export const LAST_SEEN_OPTIONS = {
  SEEN_TODAY: { code: "SEEN_TODAY", label: "오늘", description: "오늘 봤어요" },
  SEEN_3D: { code: "SEEN_3D", label: "2-3일 전", description: "며칠 전에 봤어요" },
  SEEN_1W: { code: "SEEN_1W", label: "일주일 전", description: "일주일 정도 전에요" },
  SEEN_1M: { code: "SEEN_1M", label: "한달 전", description: "한달 전쯤 봤어요" },
  SEEN_LONG: { code: "SEEN_LONG", label: "오래전", description: "오래전부터 계속 보여요" }
} as const;

// 3단계: 거주 기간
export const TENURE_OPTIONS = {
  TENURE_1M: { code: "TENURE_1M", label: "1개월 미만", description: "이사 온지 얼마 안돼요" },
  TENURE_6M: { code: "TENURE_6M", label: "1-6개월", description: "반년 정도 살고 있어요" },
  TENURE_6_12M: { code: "TENURE_6_12M", label: "6-12개월", description: "1년 정도 살고 있어요" },
  TENURE_1Y: { code: "TENURE_1Y", label: "1-3년", description: "몇년 째 살고 있어요" },
  TENURE_3Y: { code: "TENURE_3Y", label: "3년 이상", description: "오래 살고 있어요" }
} as const;

// 4단계: 주거 형태
export const HOME_TYPE_OPTIONS = {
  HOME_APT: { code: "HOME_APT", label: "아파트", description: "아파트에 살아요" },
  HOME_VILLA: { code: "HOME_VILLA", label: "빌라/연립", description: "빌라나 연립주택이에요" },
  HOME_HOUSE: { code: "HOME_HOUSE", label: "단독주택", description: "단독주택이에요" },
  HOME_OFFICETEL: { code: "HOME_OFFICETEL", label: "오피스텔", description: "오피스텔이에요" },
  HOME_OTHER_TEXT: { code: "HOME_OTHER_TEXT", label: "기타", description: "다른 주거형태예요" }
} as const;

// 5단계: 지역 (서울 기준)
export const REGION_OPTIONS = {
  REGION_SEOUL: {
    code: "REGION_SEOUL",
    label: "서울",
    subRegions: {
      SEOUL_GANGNAM: { code: "SEOUL_GANGNAM", label: "강남구", description: "강남구" },
      SEOUL_GANGDONG: { code: "SEOUL_GANGDONG", label: "강동구", description: "강동구" },
      SEOUL_GANGBUK: { code: "SEOUL_GANGBUK", label: "강북구", description: "강북구" },
      SEOUL_GANGSEO: { code: "SEOUL_GANGSEO", label: "강서구", description: "강서구" },
      SEOUL_GWANAK: { code: "SEOUL_GWANAK", label: "관악구", description: "관악구" },
      SEOUL_GWANGJIN: { code: "SEOUL_GWANGJIN", label: "광진구", description: "광진구" },
      SEOUL_GURO: { code: "SEOUL_GURO", label: "구로구", description: "구로구" },
      SEOUL_GEUMCHEON: { code: "SEOUL_GEUMCHEON", label: "금천구", description: "금천구" },
      SEOUL_NOWON: { code: "SEOUL_NOWON", label: "노원구", description: "노원구" },
      SEOUL_DOBONG: { code: "SEOUL_DOBONG", label: "도봉구", description: "도봉구" },
      SEOUL_DONGDAEMUN: { code: "SEOUL_DONGDAEMUN", label: "동대문구", description: "동대문구" },
      SEOUL_DONGJAK: { code: "SEOUL_DONGJAK", label: "동작구", description: "동작구" },
      SEOUL_MAPO: { code: "SEOUL_MAPO", label: "마포구", description: "마포구" },
      SEOUL_SEODAEMUN: { code: "SEOUL_SEODAEMUN", label: "서대문구", description: "서대문구" },
      SEOUL_SEOCHO: { code: "SEOUL_SEOCHO", label: "서초구", description: "서초구" },
      SEOUL_SEONGDONG: { code: "SEOUL_SEONGDONG", label: "성동구", description: "성동구" },
      SEOUL_SEONGBUK: { code: "SEOUL_SEONGBUK", label: "성북구", description: "성북구" },
      SEOUL_SONGPA: { code: "SEOUL_SONGPA", label: "송파구", description: "송파구" },
      SEOUL_YANGCHEON: { code: "SEOUL_YANGCHEON", label: "양천구", description: "양천구" },
      SEOUL_YEONGDEUNGPO: { code: "SEOUL_YEONGDEUNGPO", label: "영등포구", description: "영등포구" },
      SEOUL_YONGSAN: { code: "SEOUL_YONGSAN", label: "용산구", description: "용산구" },
      SEOUL_EUNPYEONG: { code: "SEOUL_EUNPYEONG", label: "은평구", description: "은평구" },
      SEOUL_JONGNO: { code: "SEOUL_JONGNO", label: "종로구", description: "종로구" },
      SEOUL_JUNG: { code: "SEOUL_JUNG", label: "중구", description: "중구" },
      SEOUL_JUNGNANG: { code: "SEOUL_JUNGNANG", label: "중랑구", description: "중랑구" }
    }
  },
  REGION_GYEONGGI: { code: "REGION_GYEONGGI", label: "경기도", subRegions: {} },
  REGION_INCHEON: { code: "REGION_INCHEON", label: "인천", subRegions: {} },
  REGION_OTHER_TEXT: { code: "REGION_OTHER_TEXT", label: "기타 지역", subRegions: {} }
} as const;

// 타입 정의
export type IssueCode = keyof typeof ISSUE_TYPES;
export type LastSeenCode = keyof typeof LAST_SEEN_OPTIONS;
export type TenureCode = keyof typeof TENURE_OPTIONS;
export type HomeTypeCode = keyof typeof HOME_TYPE_OPTIONS;
export type RegionCode = keyof typeof REGION_OPTIONS;
export type SubRegionCode = keyof typeof REGION_OPTIONS.REGION_SEOUL.subRegions;

export type ChatFlowStep = 'issue' | 'lastSeen' | 'tenure' | 'homeType' | 'region' | 'calendar' | 'summary';

export interface ChatFlowState {
  currentStep: ChatFlowStep;
  issue: {
    code: IssueCode | null;
    text: string | null;
  };
  lastSeen: LastSeenCode | null;
  tenure: TenureCode | null;
  homeType: {
    code: HomeTypeCode | null;
    text: string | null;
  };
  region: {
    macro: RegionCode | null;
    micro: SubRegionCode | null;
    text: string | null;
  };
  schedule: {
    date: string | null; // "2025-09-01"
    time_slot: string | null; // "14:00"
  };
}

export interface ChatFlowPayload {
  flow_version: string;
  issue: {
    code: IssueCode;
    text: string | null;
  };
  last_seen: LastSeenCode;
  tenure: TenureCode;
  home_type: {
    code: HomeTypeCode;
    text: string | null;
  };
  region: {
    macro: RegionCode;
    micro: SubRegionCode | null;
    text: string | null;
  };
  schedule: {
    date: string;
    time_slot: string;
  };
  meta: {
    locale: string;
    source: string;
    timestamp: string;
  };
}

// 초기 상태
export const createInitialChatFlowState = (): ChatFlowState => ({
  currentStep: 'issue',
  issue: {
    code: null,
    text: null
  },
  lastSeen: null,
  tenure: null,
  homeType: {
    code: null,
    text: null
  },
  region: {
    macro: null,
    micro: null,
    text: null
  },
  schedule: {
    date: null,
    time_slot: null
  }
});

// 검증 로직
export const validateStep = (step: ChatFlowStep, state: ChatFlowState): boolean => {
  switch (step) {
    case 'issue':
      return state.issue.code !== null;
    case 'lastSeen':
      return state.lastSeen !== null;
    case 'tenure':
      return state.tenure !== null;
    case 'homeType':
      return state.homeType.code !== null;
    case 'region':
      return state.region.macro !== null;
    case 'calendar':
      return state.schedule.date !== null && state.schedule.time_slot !== null;
    case 'summary':
      return true; // 마지막 단계는 항상 유효
    default:
      return false;
  }
};

// 다음 단계 결정
export const getNextStep = (currentStep: ChatFlowStep): ChatFlowStep | null => {
  const steps: ChatFlowStep[] = ['issue', 'lastSeen', 'tenure', 'homeType', 'region', 'calendar', 'summary'];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
};

// 이전 단계 결정
export const getPrevStep = (currentStep: ChatFlowStep): ChatFlowStep | null => {
  const steps: ChatFlowStep[] = ['issue', 'lastSeen', 'tenure', 'homeType', 'region', 'calendar', 'summary'];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
};

// 최종 페이로드 생성
export const createChatFlowPayload = (state: ChatFlowState): ChatFlowPayload => {
  if (!state.issue.code || !state.lastSeen || !state.tenure || 
      !state.homeType.code || !state.region.macro ||
      !state.schedule.date || !state.schedule.time_slot) {
    throw new Error('Incomplete chat flow state');
  }

  return {
    flow_version: HOME_CHAT_FLOW_VERSION,
    issue: {
      code: state.issue.code,
      text: state.issue.text
    },
    last_seen: state.lastSeen,
    tenure: state.tenure,
    home_type: {
      code: state.homeType.code,
      text: state.homeType.text
    },
    region: {
      macro: state.region.macro,
      micro: state.region.micro,
      text: state.region.text
    },
    schedule: {
      date: state.schedule.date,
      time_slot: state.schedule.time_slot
    },
    meta: {
      locale: 'ko-KR',
      source: 'web',
      timestamp: new Date().toISOString()
    }
  };
};