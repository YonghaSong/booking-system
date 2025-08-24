import { useState, useEffect, useCallback } from 'react';
import type { BookingCalendarProps, MonthAvailability } from '../types';
import { CalendarHeader } from './CalendarHeader';
import { 
  generateCalendarMatrix, 
  formatDateString, 
  formatMonthString, 
  parseMonthString,
  WEEKDAYS_KO,
  WEEKDAYS_EN,
  isSameDate,
  isPastDate 
} from '../utils/date';

export function BookingCalendar({ 
  initialMonth, 
  selectedDate,
  onDateSelect,
  fetchMonthAvailability,
  locale = "ko" 
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return initialMonth ? parseMonthString(initialMonth) : new Date();
  });
  
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const weekdays = locale === "ko" ? WEEKDAYS_KO : WEEKDAYS_EN;

  // 가용성 데이터 로드
  const loadAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthStr = formatMonthString(currentMonth);
      const availability = await fetchMonthAvailability(monthStr);
      setMonthAvailability(availability);
    } catch (error) {
      console.error('가용성 데이터 로드 실패:', error);
      setMonthAvailability({ month: formatMonthString(currentMonth), days: [] });
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, fetchMonthAvailability]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // 월 변경 시 선택된 날짜가 범위를 벗어나면 초기화
  useEffect(() => {
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate + 'T00:00:00');
      const currentYear = currentMonth.getFullYear();
      const currentMonthNum = currentMonth.getMonth();
      
      if (selectedDateObj.getFullYear() !== currentYear || 
          selectedDateObj.getMonth() !== currentMonthNum) {
        onDateSelect?.(undefined); // 선택 해제
      }
    }
  }, [currentMonth, selectedDate, onDateSelect]);

  // 월 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 날짜의 예약 가능 여부 확인
  const isDateBookable = (date: Date): boolean => {
    if (isPastDate(date) || !monthAvailability) return false;
    
    const dateStr = formatDateString(date);
    const dayAvailability = monthAvailability.days.find(day => day.date === dateStr);
    
    return dayAvailability?.isBookable ?? false;
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    if (!isDateBookable(date)) return;
    
    const dateStr = formatDateString(date);
    onDateSelect?.(dateStr);
  };

  // 캘린더 매트릭스 생성
  const calendarMatrix = generateCalendarMatrix(
    currentMonth.getFullYear(), 
    currentMonth.getMonth()
  );

  // 날짜 셀 렌더링 (슬롯 버튼 완전 제거)
  const renderDateCell = (date: Date | null, index: number) => {
    if (!date) {
      return <div key={index} className="aspect-square p-1" />;
    }

    const dateStr = formatDateString(date);
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const isSelected = selectedDate === dateStr;
    // const isPast = isPastDate(date); // 사용하지 않음
    const isBookable = isDateBookable(date);
    const isToday = isSameDate(date, new Date());

    let cellClasses = `
      relative size-11 md:size-12 rounded-lg border flex items-center justify-center transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
    `;

    if (!isCurrentMonth) {
      cellClasses += ' bg-gray-50 text-gray-400 cursor-default';
    } else if (isSelected) {
      cellClasses += ' ring-2 ring-blue-600 bg-blue-50';
    } else if (!isBookable) {
      cellClasses += ' bg-gray-100 text-gray-400 cursor-not-allowed opacity-60';
    } else {
      cellClasses += ' bg-white hover:bg-gray-50 cursor-pointer border-gray-200';
    }

    if (isToday && isCurrentMonth) {
      cellClasses += ' ring-1 ring-blue-300';
    }

    return (
      <div
        key={index}
        className={cellClasses}
        onClick={() => isCurrentMonth && isBookable && handleDateSelect(date)}
        role="gridcell"
        aria-selected={isSelected}
        aria-disabled={!isBookable}
        tabIndex={isCurrentMonth && isBookable ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && isCurrentMonth && isBookable) {
            e.preventDefault();
            handleDateSelect(date);
          }
        }}
        aria-label={`${formatDateString(date)} ${isBookable ? (locale === "ko" ? "예약 가능" : "Available") : (locale === "ko" ? "예약 불가" : "Unavailable")}`}
      >
        <span 
          className={`text-sm md:text-base font-medium ${
            isSelected ? 'text-blue-600 font-bold' : 
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {date.getDate()}
        </span>
        
        {/* 오늘 날짜 표시 */}
        {isToday && isCurrentMonth && !isSelected && (
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 md:p-4">
      {/* 캘린더 헤더 */}
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        locale={locale}
      />

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="text-center text-[10px] md:text-sm font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 md:h-96">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 text-sm">
            {locale === "ko" ? "로딩 중..." : "Loading..."}
          </span>
        </div>
      ) : (
        <div 
          className="grid grid-cols-7 gap-1" 
          role="grid"
          aria-label={locale === "ko" ? "캘린더" : "Calendar"}
        >
          {calendarMatrix.map((date, index) => renderDateCell(date, index))}
        </div>
      )}

      {/* 범례 숨김 (모바일 컴팩트용) - 데스크톱에서만 표시 */}
      <div className="mt-4 pt-4 border-t border-gray-200 hidden md:block">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>{locale === "ko" ? "선택됨" : "Selected"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
            <span>{locale === "ko" ? "예약가능" : "Available"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded opacity-60"></div>
            <span>{locale === "ko" ? "예약불가" : "Unavailable"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}