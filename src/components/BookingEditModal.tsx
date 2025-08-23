import { useState } from 'react';
import type { Booking } from '../types';
import { BOOKING_STATUS_LABELS } from '../types';
import { updateBookingStatus } from '../services/bookingService';
import { formatBookingNumber } from '../utils/generateId';
import { Alert } from './Alert';

interface BookingEditModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: () => void;
}

export function BookingEditModal({ booking, onClose, onUpdate }: BookingEditModalProps) {
  const [status, setStatus] = useState(booking.status);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '');
  const [estimatedPrice, setEstimatedPrice] = useState(booking.estimatedPrice?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const priceNumber = estimatedPrice ? parseInt(estimatedPrice) : undefined;
      
      await updateBookingStatus(
        booking.id,
        status,
        adminNotes || undefined,
        priceNumber
      );
      
      setSuccess('예약 정보가 성공적으로 업데이트되었습니다.');
      setTimeout(() => {
        onUpdate();
      }, 1000);
    } catch (error) {
      console.error('예약 업데이트 오류:', error);
      setError('예약 정보 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'text-yellow-800';
      case 'confirmed': return 'text-blue-800';
      case 'in_progress': return 'text-purple-800';
      case 'completed': return 'text-green-800';
      case 'cancelled': return 'text-red-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4 sm:p-0">
      <div className="relative top-4 sm:top-20 mx-auto border w-full max-w-4xl shadow-lg rounded-md bg-white min-h-[calc(100vh-2rem)] sm:min-h-0 flex flex-col">
        <div className="flex-1 p-4 sm:p-5 sm:mt-3 overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4 sm:mb-6 sticky top-0 bg-white pb-2 sm:pb-0 sm:static">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                예약 관리 - {formatBookingNumber(booking.bookingNumber)}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {booking.customerName} | {booking.customerPhone}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0 p-1"
            >
              <span className="text-xl sm:text-2xl">&times;</span>
            </button>
          </div>

          {/* 기존 예약 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">📋 예약 정보</h4>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 text-xs sm:text-sm">
              <div>
                <span className="font-medium text-gray-600 block">서비스 주소:</span>
                <p className="mt-1 break-words">{booking.serviceAddress}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 block">해충 유형:</span>
                <p className="mt-1">{booking.pestType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 block">희망 날짜:</span>
                <p className="mt-1">{new Date(booking.preferredDate).toLocaleDateString('ko-KR')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 block">희망 시간:</span>
                <p className="mt-1">{booking.timeSlot}</p>
              </div>
              {booking.pestDescription && (
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-600 block">상세 설명:</span>
                  <p className="mt-1 break-words">{booking.pestDescription}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600 block">신청일:</span>
                <p className="mt-1">{booking.createdAt.toLocaleDateString('ko-KR')} {booking.createdAt.toLocaleTimeString('ko-KR')}</p>
              </div>
              {booking.urgentService && (
                <div>
                  <span className="font-medium text-gray-600 block">긴급 서비스:</span>
                  <p className="text-red-600 font-medium mt-1">요청됨</p>
                </div>
              )}
            </div>
          </div>

          {/* 메시지 */}
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}
          
          {success && (
            <div className="mb-4">
              <Alert type="success" message={success} onClose={() => setSuccess('')} />
            </div>
          )}

          {/* 편집 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
            <div className="flex-1 space-y-4 sm:space-y-6">
              {/* 상태 변경 */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  예약 상태 *
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Booking['status'])}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                >
                  <option value="received">접수됨</option>
                  <option value="confirmed">확인됨</option>
                  <option value="in_progress">진행중</option>
                  <option value="completed">완료됨</option>
                  <option value="cancelled">취소됨</option>
                </select>
                <p className={`mt-1 text-xs sm:text-sm ${getStatusColor(status)}`}>
                  현재 상태: {BOOKING_STATUS_LABELS[status]}
                </p>
              </div>

              {/* 예상 가격 */}
              <div>
                <label htmlFor="estimatedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  예상 가격 (원)
                </label>
                <input
                  type="number"
                  id="estimatedPrice"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="예: 150000"
                  min="0"
                  step="1000"
                />
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  고객에게 표시될 서비스 예상 가격입니다.
                </p>
              </div>

              {/* 관리자 노트 */}
              <div className="flex-1 flex flex-col">
                <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  관리자 메모
                </label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="flex-1 w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none min-h-[100px] sm:min-h-[120px]"
                  placeholder="서비스 진행 상황, 특이사항, 고객과의 대화 내용 등을 기록하세요..."
                />
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  이 메모는 고객에게도 표시됩니다. 서비스 관련 중요한 정보를 기록하세요.
                </p>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="sticky bottom-0 bg-white border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full sm:w-auto px-4 py-3 sm:py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>저장 중...</span>
                    </div>
                  ) : (
                    '변경사항 저장'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}