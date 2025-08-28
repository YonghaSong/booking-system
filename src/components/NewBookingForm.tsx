import { useState } from 'react';
import { ChatFlow } from './ChatFlow';
import { CalendarPicker } from './CalendarPicker';
import type { 
  ChatFlowState, 
  ChatFlowStep
} from '../flows/homeChatFlow';
import { 
  createChatFlowPayload,
  ISSUE_TYPES,
  LAST_SEEN_OPTIONS,
  TENURE_OPTIONS,
  HOME_TYPE_OPTIONS,
  REGION_OPTIONS
} from '../flows/homeChatFlow';
import { submitChatFlowBooking } from '../api/submitBooking';

interface NewBookingFormProps {
  onSuccess?: (bookingNumber: string) => void;
  onError?: (error: string) => void;
}

export function NewBookingForm({ onSuccess, onError }: NewBookingFormProps) {
  const [chatFlowState, setChatFlowState] = useState<ChatFlowState | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'calendar' | 'summary'>('chat');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ChatFlow 완료 핸들러
  const handleChatFlowComplete = (state: ChatFlowState) => {
    setChatFlowState(state);
    setCurrentView('calendar');
  };

  // ChatFlow 단계 변경 핸들러
  const handleChatFlowStepChange = (step: ChatFlowStep, state: ChatFlowState) => {
    if (step === 'calendar') {
      setChatFlowState(state);
      setCurrentView('calendar');
    }
  };

  // 캘린더 선택 완료 핸들러
  const handleCalendarComplete = (selection: { date: string; timeSlot: string }) => {
    if (chatFlowState) {
      const updatedState = {
        ...chatFlowState,
        currentStep: 'summary' as ChatFlowStep,
        schedule: {
          date: selection.date,
          time_slot: selection.timeSlot
        }
      };
      setChatFlowState(updatedState);
      setCurrentView('summary');
    }
  };

  // 최종 제출 핸들러
  const handleSubmit = async () => {
    if (!chatFlowState) return;

    setIsSubmitting(true);
    
    try {
      const payload = createChatFlowPayload(chatFlowState);
      
      // 실제 API 호출
      const response = await submitChatFlowBooking(payload);
      onSuccess?.(response.bookingNumber);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '예약 신청 중 오류가 발생했습니다.';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이전 단계로 돌아가기
  const handleGoBack = () => {
    if (currentView === 'calendar') {
      setCurrentView('chat');
    } else if (currentView === 'summary') {
      setCurrentView('calendar');
    }
  };

  // 요약 정보 렌더링
  const renderSummary = () => {
    if (!chatFlowState) return null;

    const issueInfo = chatFlowState.issue.code ? ISSUE_TYPES[chatFlowState.issue.code] : null;
    const lastSeenInfo = chatFlowState.lastSeen ? LAST_SEEN_OPTIONS[chatFlowState.lastSeen] : null;
    const tenureInfo = chatFlowState.tenure ? TENURE_OPTIONS[chatFlowState.tenure] : null;
    const homeTypeInfo = chatFlowState.homeType.code ? HOME_TYPE_OPTIONS[chatFlowState.homeType.code] : null;
    const regionInfo = chatFlowState.region.macro ? REGION_OPTIONS[chatFlowState.region.macro] : null;
    const subRegionInfo = chatFlowState.region.micro ? 
      REGION_OPTIONS.REGION_SEOUL.subRegions[chatFlowState.region.micro] : null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">예약 정보를 확인해주세요</h2>
          <p className="text-sm text-gray-600">정보가 정확한지 확인 후 예약을 신청하세요</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* 해충 정보 */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">해충 유형</span>
            <span className="text-sm text-gray-900">
              {issueInfo?.label}
              {chatFlowState.issue.text && ` (${chatFlowState.issue.text})`}
            </span>
          </div>

          {/* 마지막 목격 */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">마지막 목격</span>
            <span className="text-sm text-gray-900">{lastSeenInfo?.label}</span>
          </div>

          {/* 거주 기간 */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">거주 기간</span>
            <span className="text-sm text-gray-900">{tenureInfo?.label}</span>
          </div>

          {/* 주거 형태 */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">주거 형태</span>
            <span className="text-sm text-gray-900">
              {homeTypeInfo?.label}
              {chatFlowState.homeType.text && ` (${chatFlowState.homeType.text})`}
            </span>
          </div>

          {/* 지역 */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">지역</span>
            <span className="text-sm text-gray-900">
              {regionInfo?.label}
              {subRegionInfo && ` ${subRegionInfo.label}`}
              {chatFlowState.region.text && ` (${chatFlowState.region.text})`}
            </span>
          </div>

          {/* 방문 일정 */}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-700">방문 일정</span>
            <span className="text-sm text-gray-900">
              {chatFlowState.schedule.date && 
                new Date(chatFlowState.schedule.date + 'T00:00:00').toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              {chatFlowState.schedule.time_slot && (
                <span className="block text-blue-600 font-medium">
                  {chatFlowState.schedule.time_slot === '09:00' && '오전 (09:00-12:00)'}
                  {chatFlowState.schedule.time_slot === '14:00' && '오후 (14:00-17:00)'}
                  {chatFlowState.schedule.time_slot === '18:00' && '저녁 (18:00-20:00)'}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
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
          
          <button
            onClick={handleGoBack}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            일정 다시 선택
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">안내:</span> 예약 신청 후 담당자가 24시간 이내에 연락드려 
            정확한 견적과 일정을 확정합니다. 긴급한 경우 전화로 직접 문의해주세요.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      {currentView === 'chat' && (
        <ChatFlow 
          onComplete={handleChatFlowComplete}
          onStepChange={handleChatFlowStepChange}
        />
      )}

      {currentView === 'calendar' && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 text-sm mb-4 hover:text-blue-700"
          >
            ← 이전 단계
          </button>
          
          <CalendarPicker
            onComplete={handleCalendarComplete}
          />
        </div>
      )}

      {currentView === 'summary' && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {renderSummary()}
        </div>
      )}
    </div>
  );
}