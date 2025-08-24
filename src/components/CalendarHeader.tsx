import { MONTHS_KO, MONTHS_EN } from '../utils/date';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  locale?: "ko" | "en";
  className?: string;
}

export function CalendarHeader({ 
  currentMonth, 
  onPrevMonth, 
  onNextMonth, 
  locale = "ko",
  className = "" 
}: CalendarHeaderProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const monthNames = locale === "ko" ? MONTHS_KO : MONTHS_EN;
  const monthLabel = locale === "ko" 
    ? `${year}년 ${monthNames[month]}`
    : `${monthNames[month]} ${year}`;

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      <button
        type="button"
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={locale === "ko" ? "이전 달" : "Previous month"}
      >
        <svg 
          className="w-5 h-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
      
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        {monthLabel}
      </h2>
      
      <button
        type="button"
        onClick={onNextMonth}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={locale === "ko" ? "다음 달" : "Next month"}
      >
        <svg 
          className="w-5 h-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  );
}