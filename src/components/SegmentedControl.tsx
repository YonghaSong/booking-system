import type { SlotKey, SlotStatus } from '../types';
import { TIME_SLOT_LABELS } from '../types';

interface SegmentedControlProps {
  slots: Record<SlotKey, SlotStatus>;
  selectedSlot?: SlotKey;
  onSlotSelect: (slot: SlotKey) => void;
  locale?: "ko" | "en";
}

const SLOT_LABELS_SHORT = {
  morning: '오전',
  afternoon: '오후',
  evening: '저녁'
};

export function SegmentedControl({ 
  slots, 
  selectedSlot, 
  onSlotSelect, 
  locale = "ko" 
}: SegmentedControlProps) {
  const slotKeys: SlotKey[] = ['morning', 'afternoon', 'evening'];

  const getSlotLabel = (slot: SlotKey): string => {
    if (locale === "en") {
      const englishLabels = {
        morning: 'AM',
        afternoon: 'PM',
        evening: 'Eve'
      };
      return englishLabels[slot];
    }
    return SLOT_LABELS_SHORT[slot];
  };

  const getButtonStyle = (slot: SlotKey, status: SlotStatus): string => {
    const isSelected = selectedSlot === slot;
    const isDisabled = status !== 'available';
    
    let classes = "h-9 text-[13px] rounded-md border transition-all duration-200 font-medium";
    
    if (isDisabled) {
      classes += " bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed";
    } else if (isSelected) {
      classes += " bg-blue-600 text-white border-blue-600";
    } else {
      classes += " bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer";
    }
    
    return classes;
  };

  return (
    <div className="space-y-2">
      {/* 세그먼트 컨트롤 */}
      <div 
        className="grid grid-cols-3 gap-1 rounded-lg border p-1 bg-white"
        role="radiogroup"
        aria-label={locale === "ko" ? "시간대 선택" : "Time slot selection"}
      >
        {slotKeys.map((slot) => {
          const status = slots[slot];
          const isDisabled = status !== 'available';
          
          return (
            <button
              key={slot}
              type="button"
              onClick={() => !isDisabled && onSlotSelect(slot)}
              disabled={isDisabled}
              className={getButtonStyle(slot, status)}
              role="radio"
              aria-checked={selectedSlot === slot}
              aria-disabled={isDisabled}
              aria-label={`${getSlotLabel(slot)} ${status === 'available' ? '예약가능' : status === 'full' ? '만석' : '휴무'}`}
            >
              {getSlotLabel(slot)}
            </button>
          );
        })}
      </div>
      
      {/* 선택 요약 라인 */}
      {selectedSlot && (
        <div 
          className="text-xs text-emerald-600 text-center"
          aria-live="polite"
        >
          선택됨 · {TIME_SLOT_LABELS[selectedSlot]}
        </div>
      )}
    </div>
  );
}