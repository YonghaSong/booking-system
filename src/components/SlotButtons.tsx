import type { SlotKey, SlotStatus } from '../types';
import { TIME_SLOT_LABELS } from '../types';

interface SlotButtonsProps {
  slots: Record<SlotKey, SlotStatus>;
  selectedSlot?: SlotKey;
  onSlotSelect: (slot: SlotKey) => void;
  locale?: "ko" | "en";
  className?: string;
}

const SLOT_COLORS: Record<SlotStatus, string> = {
  available: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
  full: 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed',
  closed: 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed'
};

const SELECTED_COLORS: Record<SlotStatus, string> = {
  available: 'bg-blue-700 border-blue-700 text-white ring-2 ring-blue-300',
  full: 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed',
  closed: 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed'
};

export function SlotButtons({ 
  slots, 
  selectedSlot, 
  onSlotSelect, 
  locale = "ko",
  className = "" 
}: SlotButtonsProps) {
  const slotKeys: SlotKey[] = ['morning', 'afternoon', 'evening'];

  const getSlotLabel = (slot: SlotKey): string => {
    if (locale === "en") {
      const englishLabels = {
        morning: 'Morning',
        afternoon: 'Afternoon', 
        evening: 'Evening'
      };
      return englishLabels[slot];
    }
    return TIME_SLOT_LABELS[slot];
  };

  const getStatusLabel = (status: SlotStatus): string => {
    if (locale === "en") {
      const englishStatus = {
        available: 'Available',
        full: 'Full',
        closed: 'Closed'
      };
      return englishStatus[status];
    }
    
    const koreanStatus = {
      available: '예약가능',
      full: '만석',
      closed: '휴무'
    };
    return koreanStatus[status];
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`} role="radiogroup" aria-label="시간대 선택">
      {slotKeys.map((slot) => {
        const status = slots[slot];
        const isSelected = selectedSlot === slot;
        const isDisabled = status !== 'available';
        
        const colorClasses = isSelected && !isDisabled 
          ? SELECTED_COLORS[status]
          : SLOT_COLORS[status];

        return (
          <button
            key={slot}
            type="button"
            onClick={() => !isDisabled && onSlotSelect(slot)}
            disabled={isDisabled}
            className={`
              flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-full border font-medium text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
              min-h-[44px] touch-manipulation
              ${colorClasses}
              ${isDisabled ? '' : 'active:scale-95'}
            `}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            aria-describedby={`slot-${slot}-status`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold">
                {getSlotLabel(slot)}
              </span>
              <span 
                id={`slot-${slot}-status`}
                className="text-xs opacity-90"
              >
                {getStatusLabel(status)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}