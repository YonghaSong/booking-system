import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  updateDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Booking, BookingInput, MonthAvailability, DayAvailability, SlotKey, SlotStatus } from '../types';
import { generateBookingNumber } from '../utils/generateId';

// Firestore 컬렉션 참조
const BOOKINGS_COLLECTION = 'bookings';
// const AVAILABILITY_COLLECTION = 'availability'; // 향후 실제 Firestore 구현 시 사용

/**
 * 새 예약을 생성합니다.
 * @param bookingData 예약 입력 데이터
 * @returns 생성된 예약 정보
 */
export async function createBooking(bookingData: BookingInput): Promise<Booking> {
  try {
    const bookingNumber = generateBookingNumber();
    const now = new Date();
    
    const booking: Omit<Booking, 'id'> = {
      ...bookingData,
      bookingNumber,
      status: 'received',
      createdAt: now,
      updatedAt: now
    };
    
    // Firestore에 문서 추가
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...booking,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    });
    
    return {
      ...booking,
      id: docRef.id
    };
  } catch (error) {
    console.error('예약 생성 중 오류:', error);
    throw new Error('예약 생성에 실패했습니다.');
  }
}

/**
 * 예약번호로 예약을 조회합니다.
 * @param bookingNumber 예약번호 (8자리)
 * @returns 예약 정보 또는 null
 */
export async function getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('bookingNumber', '==', bookingNumber.toUpperCase())
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Booking;
  } catch (error) {
    console.error('예약 조회 중 오류:', error);
    throw new Error('예약 조회에 실패했습니다.');
  }
}

/**
 * 문서 ID로 예약을 조회합니다.
 * @param bookingId Firestore 문서 ID
 * @returns 예약 정보 또는 null
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Booking;
  } catch (error) {
    console.error('예약 조회 중 오류:', error);
    throw new Error('예약 조회에 실패했습니다.');
  }
}

/**
 * 모든 예약을 조회합니다 (관리자용).
 * @returns 예약 목록
 */
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Booking;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('예약 목록 조회 중 오류:', error);
    throw new Error('예약 목록 조회에 실패했습니다.');
  }
}

/**
 * 예약 상태를 업데이트합니다.
 * @param bookingId 예약 ID
 * @param status 새 상태
 * @param adminNotes 관리자 노트 (선택사항)
 * @param estimatedPrice 예상 가격 (선택사항)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status'],
  adminNotes?: string,
  estimatedPrice?: number
): Promise<void> {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const updateData: Record<string, string | number | Date | Timestamp> = {
      status,
      updatedAt: Timestamp.now()
    };
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    if (estimatedPrice !== undefined) {
      updateData.estimatedPrice = estimatedPrice;
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('예약 업데이트 중 오류:', error);
    throw new Error('예약 업데이트에 실패했습니다.');
  }
}

/**
 * 특정 월의 가용성 데이터를 조회합니다. (v2 API)
 * @param month YYYY-MM 형식의 월 문자열
 * @returns 월별 가용성 데이터
 */
export async function fetchMonthAvailability(month: string): Promise<MonthAvailability> {
  try {
    // 실제 구현 시에는 Firestore에서 해당 월의 가용성 데이터를 조회
    // 지금은 목업 데이터를 반환
    return generateMockAvailability(month);
  } catch (error) {
    console.error('월별 가용성 데이터 조회 중 오류:', error);
    throw new Error('월별 가용성 데이터 조회에 실패했습니다.');
  }
}

/**
 * 특정 날짜의 시간대별 슬롯 상태를 조회합니다. (v2 API)
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 * @returns 시간대별 슬롯 상태
 */
export async function fetchDaySlots(date: string): Promise<Record<SlotKey, SlotStatus>> {
  try {
    // 실제 구현 시에는 Firestore에서 해당 날짜의 슬롯 데이터를 조회
    // 지금은 목업 데이터에서 추출하여 반환
    const [year, monthStr] = date.split('-');
    const month = `${year}-${monthStr}`;
    const monthData = generateMockAvailability(month);
    
    const dayData = monthData.days.find(day => day.date === date);
    if (!dayData) {
      // 해당 날짜가 없으면 모든 슬롯을 closed로 반환
      return {
        morning: 'closed',
        afternoon: 'closed',
        evening: 'closed'
      };
    }
    
    return dayData.slots;
  } catch (error) {
    console.error('일별 슬롯 데이터 조회 중 오류:', error);
    throw new Error('일별 슬롯 데이터 조회에 실패했습니다.');
  }
}

/**
 * 이전 버전 호환성을 위한 래퍼 함수
 * @deprecated v2에서는 fetchMonthAvailability 사용 권장
 */
export async function fetchAvailability(month: string): Promise<MonthAvailability> {
  return fetchMonthAvailability(month);
}

/**
 * 목업 가용성 데이터 생성 (개발용)
 */
function generateMockAvailability(month: string): MonthAvailability {
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const today = new Date();
  
  const days: DayAvailability[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum - 1, day);
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 과거 날짜는 예약 불가
    const isPast = date < today;
    
    // 주말과 일부 날짜는 다른 가용성 패턴 적용
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // 임의로 일부 날짜를 만석이나 휴무로 설정
    const randomFactor = Math.random();
    
    let morningStatus: SlotStatus = "available";
    let afternoonStatus: SlotStatus = "available";
    let eveningStatus: SlotStatus = "available";
    
    if (isPast) {
      morningStatus = afternoonStatus = eveningStatus = "closed";
    } else if (isWeekend) {
      // 주말은 제한적 운영
      if (randomFactor < 0.3) {
        morningStatus = afternoonStatus = eveningStatus = "closed";
      } else {
        eveningStatus = "closed"; // 주말 저녁은 휴무
      }
    } else {
      // 평일은 다양한 패턴
      if (randomFactor < 0.1) {
        morningStatus = afternoonStatus = eveningStatus = "closed"; // 10% 확률로 휴무
      } else if (randomFactor < 0.3) {
        // 20% 확률로 일부 시간대 만석
        if (Math.random() < 0.5) morningStatus = "full";
        if (Math.random() < 0.5) afternoonStatus = "full";
        if (Math.random() < 0.3) eveningStatus = "full";
      }
    }
    
    const isBookable = !isPast && (
      morningStatus === "available" || 
      afternoonStatus === "available" || 
      eveningStatus === "available"
    );
    
    days.push({
      date: dateStr,
      slots: {
        morning: morningStatus,
        afternoon: afternoonStatus,
        evening: eveningStatus
      },
      isBookable
    });
  }
  
  return {
    month,
    days
  };
}