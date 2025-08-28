import { useState } from 'react';
import { BookingCalendar } from './BookingCalendar';
import { TimeSlotPanel } from './TimeSlotPanel';
import type { TimeSlot } from '../types';
import { fetchMonthAvailability, fetchDaySlots } from '../services/bookingService';

interface CalendarPickerProps {
  selectedDate?: string;
  selectedTimeSlot?: string;
  onSelectionChange?: (selection: { date: string; timeSlot: string }) => void;
  onComplete?: (selection: { date: string; timeSlot: string }) => void;
}

export function CalendarPicker({ 
  selectedDate, 
  selectedTimeSlot, 
  onSelectionChange,
  onComplete 
}: CalendarPickerProps) {
  const [currentSelectedDate, setCurrentSelectedDate] = useState<string | undefined>(selectedDate);
  const [currentTimeSlot, setCurrentTimeSlot] = useState<string | undefined>(selectedTimeSlot);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: string | undefined) => {
    setCurrentSelectedDate(date);
    // 날짜가 변경되면 시간 슬롯 초기화
    if (date !== currentSelectedDate) {
      setCurrentTimeSlot(undefined);
    }
    
    if (date && currentTimeSlot) {
      onSelectionChange?.({ date, timeSlot: currentTimeSlot });
    }
  };

  // 시간대 선택 핸들러
  const handleTimeSlotChange = (selection: { date: string; slot: TimeSlot }) => {
    const timeSlotMapping: Record<TimeSlot, string> = {
      'morning': '09:00',
      'afternoon': '14:00',
      'evening': '18:00'
    };
    
    const timeSlot = timeSlotMapping[selection.slot];
    setCurrentSelectedDate(selection.date);
    setCurrentTimeSlot(timeSlot);
    
    onSelectionChange?.({ date: selection.date, timeSlot });
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (currentSelectedDate && currentTimeSlot) {
      onComplete?.({ date: currentSelectedDate, timeSlot: currentTimeSlot });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">언제 방문할까요?</h2>
        <p className="text-sm text-gray-600">희망하시는 날짜와 시간을 선택해주세요</p>
      </div>

      {/* 캘린더와 시간 선택 영역 */}
      <div className="space-y-4 md:space-y-6">
        {/* 캘린더 */}
        <div>
          <BookingCalendar
            selectedDate={currentSelectedDate}
            onDateSelect={handleDateSelect}
            fetchMonthAvailability={fetchMonthAvailability}
            locale="ko"
          />
        </div>

        {/* 시간대 패널 */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-blue-100 md:p-6">
            <TimeSlotPanel
              selectedDate={currentSelectedDate}
              fetchDaySlots={fetchDaySlots}
              value={{
                date: currentSelectedDate,
                slot: currentTimeSlot === '09:00' ? 'morning' : 
                      currentTimeSlot === '14:00' ? 'afternoon' : 
                      currentTimeSlot === '18:00' ? 'evening' : undefined
              }}
              onChange={handleTimeSlotChange}
              locale="ko"
              alwaysVisible={true}
            />
          </div>
        </div>
      </div>

      {/* 확인 버튼 */}
      {currentSelectedDate && currentTimeSlot && (
        <div className="pt-4">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            선택 완료
          </button>
        </div>
      )}

      {/* 선택 상황 요약 */}
      {(currentSelectedDate || currentTimeSlot) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">선택된 일정:</span>
            {currentSelectedDate && (
              <span className="ml-2">
                {new Date(currentSelectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </span>
            )}
            {currentTimeSlot && (
              <span className="ml-2">
                {currentTimeSlot === '09:00' && '오전 (09:00-12:00)'}
                {currentTimeSlot === '14:00' && '오후 (14:00-17:00)'}
                {currentTimeSlot === '18:00' && '저녁 (18:00-20:00)'}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}