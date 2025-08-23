import { formatBookingNumber } from '../utils/generateId';

interface BookingSuccessProps {
  bookingNumber: string;
  onNewBooking: () => void;
}

export function BookingSuccess({ bookingNumber, onNewBooking }: BookingSuccessProps) {
  const formattedNumber = formatBookingNumber(bookingNumber);

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(bookingNumber);
    // 간단한 알림 표시 (실제 앱에서는 토스트 메시지 사용)
    alert('예약번호가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
      {/* 성공 아이콘 */}
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* 성공 메시지 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        예약 신청 완료!
      </h2>
      
      <p className="text-gray-600 mb-6">
        해충방제 서비스 예약이 성공적으로 접수되었습니다.
      </p>

      {/* 예약번호 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 font-medium mb-2">
          예약번호
        </p>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-blue-900 tracking-wider">
            {formattedNumber}
          </span>
          <button
            onClick={handleCopyBookingNumber}
            className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            title="예약번호 복사"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          예약번호를 메모해 두세요. 예약 조회 시 필요합니다.
        </p>
      </div>

      {/* 안내사항 */}
      <div className="space-y-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 mb-2">
            📞 담당자 연락 예정
          </h3>
          <p className="text-sm text-amber-700">
            24시간 이내에 담당자가 연락드려 정확한 일정과 견적을 안내해드립니다.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2">
            🔍 예약 조회 방법
          </h3>
          <p className="text-sm text-gray-600">
            예약번호로 언제든지 예약 상태를 확인할 수 있습니다.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">
            🚨 긴급한 경우
          </h3>
          <p className="text-sm text-red-700">
            즉시 도움이 필요한 경우 <span className="font-semibold">1588-0000</span>으로 연락주세요.
          </p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={onNewBooking}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          새 예약 신청하기
        </button>
        
        <button
          onClick={() => {
            // 예약 조회 페이지로 이동 (추후 React Router 구현 시)
            window.location.hash = '#search';
          }}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          예약 조회하기
        </button>
      </div>

      {/* 고객센터 정보 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          문의사항이 있으시면 언제든지 연락주세요<br/>
          <span className="font-medium">고객센터: 1588-0000</span> | 
          <span className="font-medium">이메일: contact@bugfree.com</span>
        </p>
      </div>
    </div>
  );
}