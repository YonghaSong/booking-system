/**
 * 캘린더 날짜 유틸리티 함수들
 */

/**
 * 주어진 월의 캘린더 매트릭스를 생성합니다 (7x6 = 42칸)
 * @param year 년도
 * @param month 월 (0-11)
 * @returns 날짜 매트릭스 배열 (42개)
 */
export function generateCalendarMatrix(year: number, month: number): Array<Date | null> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay(); // 0=일요일
  const daysInMonth = lastDay.getDate();
  
  const matrix: Array<Date | null> = [];
  
  // 이전 달 날짜들로 채우기
  for (let i = 0; i < firstDayOfWeek; i++) {
    matrix.push(null);
  }
  
  // 현재 달 날짜들 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    matrix.push(new Date(year, month, day));
  }
  
  // 다음 달 날짜들로 나머지 채우기 (총 42칸 맞추기)
  const remaining = 42 - matrix.length;
  for (let i = 0; i < remaining; i++) {
    matrix.push(null);
  }
  
  return matrix;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM 형식 문자열을 Date 객체로 변환
 */
export function parseMonthString(monthStr: string): Date {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * YYYY-MM 형식으로 월 문자열 생성
 */
export function formatMonthString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * 한국어 요일명 배열
 */
export const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 영어 요일명 배열
 */
export const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * 한국어 월명 배열
 */
export const MONTHS_KO = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

/**
 * 영어 월명 배열
 */
export const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * 두 날짜가 같은지 비교 (년월일만)
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return formatDateString(date1) === formatDateString(date2);
}

/**
 * 오늘 날짜 이전인지 확인
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * 이번 달로부터 N개월 후의 월 문자열 생성
 */
export function getMonthOffset(offset: number): string {
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return formatMonthString(targetDate);
}