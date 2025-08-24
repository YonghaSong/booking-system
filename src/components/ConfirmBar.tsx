interface ConfirmBarProps {
  onConfirm: () => void;
  disabled?: boolean;
  text?: string;
  locale?: "ko" | "en";
}

export function ConfirmBar({ 
  onConfirm, 
  disabled = false, 
  text, 
  locale = "ko" 
}: ConfirmBarProps) {
  const buttonText = text || (locale === "ko" ? "다음" : "Next");
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t p-2 pb-[calc(8px+env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className={`
          h-11 rounded-lg w-full font-medium text-base transition-colors duration-200
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        {buttonText}
      </button>
    </div>
  );
}