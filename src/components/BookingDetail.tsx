import type { Booking } from '../types';
import { PEST_TYPE_LABELS, TIME_SLOT_LABELS, BOOKING_STATUS_LABELS } from '../types';
import { formatBookingNumber } from '../utils/generateId';

interface BookingDetailProps {
  booking: Booking;
  onBack: () => void;
  onNewSearch: () => void;
}

export function BookingDetail({ booking, onBack, onNewSearch }: BookingDetailProps) {
  const formattedBookingNumber = formatBookingNumber(booking.bookingNumber);
  const formattedDate = new Date(booking.preferredDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'received':
        return '예약이 접수되었습니다. 담당자가 24시간 이내에 연락드릴 예정입니다.';
      case 'confirmed':
        return '예약이 확인되었습니다. 예정된 날짜에 서비스를 진행할 예정입니다.';
      case 'in_progress':
        return '현재 해충방제 서비스를 진행 중입니다.';
      case 'completed':
        return '해충방제 서비스가 완료되었습니다. 서비스 이용해 주셔서 감사합니다.';
      case 'cancelled':
        return '예약이 취소되었습니다. 문의사항이 있으시면 고객센터로 연락주세요.';
      default:
        return '예약 상태를 확인하는 중입니다.';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold">예약 정보</h2>
            <p className="text-blue-100 mt-1 text-sm sm:text-base break-all">예약번호: {formattedBookingNumber}</p>
          </div>
          <div className={`px-3 py-2 sm:px-4 rounded-full border text-center ${getStatusColor(booking.status)}`}>
            <span className="font-medium text-xs sm:text-sm">{BOOKING_STATUS_LABELS[booking.status]}</span>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* 상태 메시지 */}
        <div className={`p-3 sm:p-4 rounded-lg border ${getStatusColor(booking.status)}`}>
          <p className="text-xs sm:text-sm">{getStatusMessage(booking.status)}</p>
        </div>

        {/* 고객 정보 */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">👤 고객 정보</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">이름:</span>
              <span className="text-sm sm:text-base break-words">{booking.customerName}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">연락처:</span>
              <span className="text-sm sm:text-base break-all">{booking.customerPhone}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">이메일:</span>
              <span className="text-sm sm:text-base break-all">{booking.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* 서비스 정보 */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">🏠 서비스 정보</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">주소:</span>
              <span className="text-sm sm:text-base break-words">{booking.serviceAddress}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">해충 유형:</span>
              <span className="text-sm sm:text-base">{PEST_TYPE_LABELS[booking.pestType]}</span>
            </div>
            {booking.pestDescription && (
              <div>
                <span className="font-medium text-gray-600">상세 설명:</span>
                <p className="mt-1 text-sm text-gray-700 bg-white p-3 rounded border">
                  {booking.pestDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 예약 일정 */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">📅 예약 일정</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">날짜:</span>
              <span className="text-sm sm:text-base">{formattedDate}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium text-gray-600 text-xs sm:text-sm w-full sm:w-20">시간:</span>
              <span className="text-sm sm:text-base">{TIME_SLOT_LABELS[booking.timeSlot]}</span>
            </div>
            {booking.urgentService && (
              <div className="flex">
                <span className="font-medium text-gray-600 w-20">긴급:</span>
                <span className="text-red-600 font-medium">긴급 서비스 요청됨</span>
              </div>
            )}
          </div>
        </div>

        {/* 관리자 노트 & 가격 정보 */}
        {(booking.adminNotes || booking.estimatedPrice) && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">📋 추가 정보</h3>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg space-y-2">
              {booking.estimatedPrice && (
                <div className="flex">
                  <span className="font-medium text-blue-800 w-20">견적:</span>
                  <span className="text-blue-900 font-semibold">
                    {booking.estimatedPrice.toLocaleString()}원
                  </span>
                </div>
              )}
              {booking.adminNotes && (
                <div>
                  <span className="font-medium text-blue-800">담당자 메모:</span>
                  <p className="mt-1 text-sm text-blue-700 bg-white p-3 rounded border">
                    {booking.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 예약 일시 */}
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          예약 신청일: {booking.createdAt.toLocaleDateString('ko-KR')} {booking.createdAt.toLocaleTimeString('ko-KR')}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-800 py-3 sm:py-4 px-4 rounded-md font-medium hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm sm:text-base"
        >
          ← 뒤로가기
        </button>
        <button
          onClick={onNewSearch}
          className="flex-1 bg-blue-600 text-white py-3 sm:py-4 px-4 rounded-md font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
        >
          다른 예약 조회
        </button>
      </div>

      {/* 고객센터 안내 */}
      <div className="bg-amber-50 border-t border-amber-200 p-4">
        <div className="text-center">
          <p className="text-sm text-amber-800">
            <span className="font-medium">문의사항이나 변경 요청이 있으시면</span><br/>
            고객센터 <span className="font-bold">1588-0000</span> 또는 
            이메일 <span className="font-bold">contact@bugfree.com</span>으로 연락주세요.
          </p>
        </div>
      </div>
    </div>
  );
}