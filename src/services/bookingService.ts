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
import type { Booking, BookingInput } from '../types';
import { generateBookingNumber } from '../utils/generateId';

// Firestore 컬렉션 참조
const BOOKINGS_COLLECTION = 'bookings';

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
    const updateData: any = {
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