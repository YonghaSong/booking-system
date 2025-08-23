import { useState } from 'react';
import type { Booking } from '../types';
import { getBookingByNumber } from '../services/bookingService';
import { isValidBookingNumber, formatBookingNumber } from '../utils/generateId';
import { Alert } from './Alert';

interface BookingSearchProps {
  onBookingFound: (booking: Booking) => void;
}

export function BookingSearch({ onBookingFound }: BookingSearchProps) {
  const [bookingNumber, setBookingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    // 영문자는 대문자로, 숫자만 허용
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // 8자리 제한
    const limited = formatted.slice(0, 8);
    
    setBookingNumber(limited);
    if (error) setError('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingNumber.trim()) {
      setError('예약번호를 입력해주세요.');
      return;
    }

    if (!isValidBookingNumber(bookingNumber)) {
      setError('올바른 예약번호 형식이 아닙니다. (예: AB123456)');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const booking = await getBookingByNumber(bookingNumber);
      
      if (booking) {
        onBookingFound(booking);
      } else {
        setError('해당 예약번호로 등록된 예약을 찾을 수 없습니다. 예약번호를 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('예약 조회 오류:', error);
      setError('예약 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        예약 조회
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* 예약번호 입력 */}
        <div>
          <label htmlFor="bookingNumber" className="block text-sm font-medium text-gray-700 mb-1">
            예약번호 *
          </label>
          <input
            type="text"
            id="bookingNumber"
            value={bookingNumber}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-base sm:text-lg font-mono tracking-wider ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="AB123456"
            maxLength={8}
          />
          {bookingNumber && isValidBookingNumber(bookingNumber) && (
            <p className="mt-1 text-sm text-green-600 text-center">
              {formatBookingNumber(bookingNumber)}
            </p>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* 검색 버튼 */}
        <button
          type="submit"
          disabled={isSearching || !isValidBookingNumber(bookingNumber)}
          className={`w-full py-3 sm:py-4 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${
            isSearching || !isValidBookingNumber(bookingNumber)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
        >
          {isSearching ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              검색 중...
            </div>
          ) : (
            '예약 조회하기'
          )}
        </button>
      </form>

      {/* 안내 사항 */}
      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">💡 예약번호 찾기</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• 예약 완료 시 발급받은 8자리 코드입니다</li>
            <li>• 문자 2개 + 숫자 6개 형태입니다 (예: AB123456)</li>
            <li>• 이메일이나 문자로 전송받으신 예약번호를 확인하세요</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-3 sm:p-4 rounded-md">
          <h3 className="font-medium text-amber-800 mb-2 text-sm sm:text-base">❓ 예약번호를 찾을 수 없나요?</h3>
          <p className="text-xs sm:text-sm text-amber-700">
            예약번호를 분실하셨거나 찾을 수 없는 경우, 고객센터 <span className="font-semibold">1588-0000</span>으로 
            연락 주시면 도움을 드리겠습니다.
          </p>
        </div>
      </div>
    </div>
  );
}