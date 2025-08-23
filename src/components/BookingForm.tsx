import { useState } from 'react';
import type { BookingInput, PestType, TimeSlot } from '../types';
import { PEST_TYPE_LABELS, TIME_SLOT_LABELS } from '../types';
import { createBooking } from '../services/bookingService';

interface BookingFormProps {
  onSuccess?: (bookingNumber: string) => void;
  onError?: (error: string) => void;
}

export function BookingForm({ onSuccess, onError }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingInput>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceAddress: '',
    pestType: 'cockroach',
    pestDescription: '',
    preferredDate: '',
    timeSlot: 'morning',
    urgentService: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingInput, string>>>({});

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof BookingInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 메시지 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingInput, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '고객명을 입력해주세요.';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '연락처를 입력해주세요.';
    } else if (!/^[0-9-+().\s]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.serviceAddress.trim()) {
      newErrors.serviceAddress = '서비스 주소를 입력해주세요.';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = '희망 날짜를 선택해주세요.';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = '오늘 이후의 날짜를 선택해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const booking = await createBooking(formData);
      onSuccess?.(booking.bookingNumber);
      
      // 폼 초기화
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        serviceAddress: '',
        pestType: 'cockroach',
        pestDescription: '',
        preferredDate: '',
        timeSlot: 'morning',
        urgentService: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '예약 신청 중 오류가 발생했습니다.';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        해충방제 서비스 예약
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 고객명 */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            고객명 *
          </label>
          <input
            type="text"
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base text-sm sm:text-base ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="홍길동"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
            연락처 *
          </label>
          <input
            type="tel"
            id="customerPhone"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.customerPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="010-1234-5678"
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            이메일 *
          </label>
          <input
            type="email"
            id="customerEmail"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.customerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="hong@example.com"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
          )}
        </div>

        {/* 서비스 주소 */}
        <div>
          <label htmlFor="serviceAddress" className="block text-sm font-medium text-gray-700 mb-1">
            서비스 주소 *
          </label>
          <textarea
            id="serviceAddress"
            rows={3}
            value={formData.serviceAddress}
            onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.serviceAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="서울시 강남구 테헤란로 123, 456호"
          />
          {errors.serviceAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceAddress}</p>
          )}
        </div>

        {/* 해충 유형 */}
        <div>
          <label htmlFor="pestType" className="block text-sm font-medium text-gray-700 mb-1">
            해충 유형 *
          </label>
          <select
            id="pestType"
            value={formData.pestType}
            onChange={(e) => handleInputChange('pestType', e.target.value as PestType)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            {Object.entries(PEST_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 해충 상세 설명 */}
        <div>
          <label htmlFor="pestDescription" className="block text-sm font-medium text-gray-700 mb-1">
            해충 상황 상세 설명 (선택사항)
          </label>
          <textarea
            id="pestDescription"
            rows={3}
            value={formData.pestDescription}
            onChange={(e) => handleInputChange('pestDescription', e.target.value)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="발견 위치, 개수, 발견 시기 등을 자세히 적어주세요"
          />
        </div>

        {/* 희망 날짜 */}
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
            희망 서비스 날짜 *
          </label>
          <input
            type="date"
            id="preferredDate"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.preferredDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.preferredDate && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
          )}
        </div>

        {/* 시간대 */}
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
            희망 시간대 *
          </label>
          <select
            id="timeSlot"
            value={formData.timeSlot}
            onChange={(e) => handleInputChange('timeSlot', e.target.value as TimeSlot)}
            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            {Object.entries(TIME_SLOT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 긴급 서비스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="urgentService"
            checked={formData.urgentService}
            onChange={(e) => handleInputChange('urgentService', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="urgentService" className="ml-2 block text-sm text-gray-700">
            긴급 서비스 요청 (추가 요금 발생 가능)
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 sm:py-4 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              예약 신청 중...
            </div>
          ) : (
            '예약 신청하기'
          )}
        </button>
      </form>

      {/* 안내 문구 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">안내:</span> 예약 신청 후 담당자가 24시간 이내에 연락드려 일정을 확정합니다.
          긴급한 경우 전화로 직접 문의해주세요.
        </p>
      </div>
    </div>
  );
}