import { useState, useEffect } from 'react';
import type { TimeSlotPanelProps, SlotKey, SlotStatus } from '../types';
import { SegmentedControl } from './SegmentedControl';

export function TimeSlotPanel({
  selectedDate,
  fetchDaySlots,
  value,
  onChange,
  openInMobile = false,
  onCloseMobile,
  alwaysVisible = false,
  locale = "ko"
}: TimeSlotPanelProps) {
  const [slots, setSlots] = useState<Record<SlotKey, SlotStatus> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 날짜 변경 시 슬롯 데이터 로드
  useEffect(() => {
    if (!selectedDate) {
      setSlots(null);
      return;
    }

    const loadSlots = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const daySlots = await fetchDaySlots(selectedDate);
        setSlots(daySlots);
      } catch (err) {
        console.error('슬롯 데이터 로드 실패:', err);
        setError(locale === "ko" ? "시간대 정보를 불러올 수 없습니다." : "Failed to load time slots.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSlots();
  }, [selectedDate, fetchDaySlots, locale]);

  // 슬롯 선택 핸들러
  const handleSlotSelect = (slot: SlotKey) => {
    if (!selectedDate || !slots || slots[slot] !== 'available') return;
    onChange?.({ date: selectedDate, slot });
  };

  // 날짜 포맷팅 (한국어)
  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (locale === "ko") {
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[date.getDay()];
      return `${year}년 ${month}월 ${day}일(${weekday})`;
    } else {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekday = weekdays[date.getDay()];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[month - 1];
      return `${monthName} ${day}, ${year} (${weekday})`;
    }
  };

  // 패널 공통 내용
  const panelContent = (
    <div className="space-y-3">
      {/* 컴팩트 헤더 */}
      <div className={`flex items-center gap-2 ${alwaysVisible ? 'pb-2' : 'pb-2 border-b border-gray-200'}`}>
        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-sm font-medium text-gray-800 flex-1" aria-live="polite">
          {selectedDate ? 
            `${formatDateDisplay(selectedDate)} · 시간대 선택` : 
            "시간대 선택"
          }
        </h3>
        {openInMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
            aria-label={locale === "ko" ? "닫기" : "Close"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      {!selectedDate && alwaysVisible ? (
        <div className="text-center py-8 text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium mb-1">날짜를 선택해주세요</p>
          <p className="text-xs text-gray-400">위의 캘린더에서 원하는 날짜를 클릭하세요</p>
        </div>
      ) : !selectedDate ? (
        <div className="text-center py-6 text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">캘린더에서 날짜를 선택해주세요</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-700 text-xs">{error}</p>
          </div>
          <button
            onClick={() => selectedDate && fetchDaySlots(selectedDate).then(setSlots).catch(console.error)}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            {locale === "ko" ? "다시 시도" : "Retry"}
          </button>
        </div>
      ) : isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">시간대 로딩 중...</p>
        </div>
      ) : slots ? (
        <SegmentedControl
          slots={slots}
          selectedSlot={value?.date === selectedDate ? value.slot : undefined}
          onSlotSelect={handleSlotSelect}
          locale={locale}
        />
      ) : null}
    </div>
  );

  // 모바일 하단 패널
  if (openInMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t-2 border-gray-200 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-2xl md:hidden">
        {panelContent}
      </div>
    );
  }

  // 데스크톱 패널 (기본값이나 alwaysVisible일 때)
  return (
    <div className={`${alwaysVisible ? '' : 'bg-white rounded-lg shadow-lg p-6 sticky top-4 max-h-[70vh] overflow-y-auto'}`}>
      {panelContent}
    </div>
  );
}