/**
 * 8자리 예약번호를 생성합니다.
 * 형식: 2개 문자 + 6개 숫자 (예: AB123456)
 * 고객이 쉽게 기억하고 입력할 수 있도록 설계되었습니다.
 */
export function generateBookingNumber(): string {
  // 사용할 문자 (읽기 어려운 문자 제외: I, O, L, 1, 0)
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const numbers = '23456789';
  
  // 2개 문자 생성
  let result = '';
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // 6개 숫자 생성
  for (let i = 0; i < 6; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
}

/**
 * 예약번호 형식이 유효한지 검사합니다.
 * @param bookingNumber 검사할 예약번호
 * @returns 유효하면 true, 아니면 false
 */
export function isValidBookingNumber(bookingNumber: string): boolean {
  // 8자리, 처음 2자리는 문자, 나머지 6자리는 숫자
  const pattern = /^[A-Z]{2}[0-9]{6}$/;
  return pattern.test(bookingNumber.toUpperCase());
}

/**
 * 예약번호를 표시용으로 포맷합니다.
 * @param bookingNumber 원본 예약번호
 * @returns 포맷된 예약번호 (예: AB-123456)
 */
export function formatBookingNumber(bookingNumber: string): string {
  if (!isValidBookingNumber(bookingNumber)) {
    return bookingNumber;
  }
  
  const upper = bookingNumber.toUpperCase();
  return `${upper.slice(0, 2)}-${upper.slice(2)}`;
}