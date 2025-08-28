import { useState } from 'react';
import type {
  ChatFlowState,
  ChatFlowStep,
  IssueCode,
  LastSeenCode,
  TenureCode,
  HomeTypeCode,
  RegionCode,
  SubRegionCode
} from '../flows/homeChatFlow';
import {
  createInitialChatFlowState,
  validateStep,
  getNextStep,
  getPrevStep,
  ISSUE_TYPES,
  LAST_SEEN_OPTIONS,
  TENURE_OPTIONS,
  HOME_TYPE_OPTIONS,
  REGION_OPTIONS
} from '../flows/homeChatFlow';

interface ChatFlowProps {
  onComplete: (state: ChatFlowState) => void;
  onStepChange?: (step: ChatFlowStep, state: ChatFlowState) => void;
}

export function ChatFlow({ onComplete, onStepChange }: ChatFlowProps) {
  const [state, setState] = useState<ChatFlowState>(createInitialChatFlowState);
  const [showSubRegions, setShowSubRegions] = useState(false);

  const updateState = (updates: Partial<ChatFlowState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    onStepChange?.(newState.currentStep, newState);
  };

  const goToNextStep = () => {
    if (!validateStep(state.currentStep, state)) return;
    
    const nextStep = getNextStep(state.currentStep);
    if (nextStep) {
      updateState({ currentStep: nextStep });
    } else {
      onComplete(state);
    }
  };

  const goToPrevStep = () => {
    const prevStep = getPrevStep(state.currentStep);
    if (prevStep) {
      updateState({ currentStep: prevStep });
    }
  };

  // 1단계: 문제 유형
  const renderIssueStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">어떤 해충 때문에 고민이신가요?</h2>
        <p className="text-sm text-gray-600">발견하신 해충을 선택해주세요</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(ISSUE_TYPES).map(([key, option]) => {
          const isSelected = state.issue.code === key;
          const isOther = key === 'ISSUE_OTHER_TEXT';
          
          return (
            <div key={key} className="space-y-2">
              <button
                onClick={() => {
                  updateState({
                    issue: { code: key as IssueCode, text: null }
                  });
                  if (!isOther) {
                    setTimeout(goToNextStep, 300);
                  }
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
              
              {isOther && isSelected && (
                <input
                  type="text"
                  placeholder="어떤 해충인지 알려주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => updateState({
                    issue: { code: key as IssueCode, text: e.target.value }
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && state.issue.text?.trim()) {
                      goToNextStep();
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // 2단계: 마지막 목격
  const renderLastSeenStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">언제 마지막으로 보셨나요?</h2>
        <p className="text-sm text-gray-600">해충을 언제 발견했는지 알려주세요</p>
      </div>
      
      <div className="space-y-3">
        {Object.entries(LAST_SEEN_OPTIONS).map(([key, option]) => {
          const isSelected = state.lastSeen === key;
          
          return (
            <button
              key={key}
              onClick={() => {
                updateState({ lastSeen: key as LastSeenCode });
                setTimeout(goToNextStep, 300);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // 3단계: 거주 기간
  const renderTenureStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">현재 거주지에서 얼마나 거주하셨나요?</h2>
        <p className="text-sm text-gray-600">거주 기간을 선택해주세요</p>
      </div>
      
      <div className="space-y-3">
        {Object.entries(TENURE_OPTIONS).map(([key, option]) => {
          const isSelected = state.tenure === key;
          
          return (
            <button
              key={key}
              onClick={() => {
                updateState({ tenure: key as TenureCode });
                setTimeout(goToNextStep, 300);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // 4단계: 주거 형태
  const renderHomeTypeStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">어떤 주거형태인가요?</h2>
        <p className="text-sm text-gray-600">거주하시는 곳의 형태를 선택해주세요</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(HOME_TYPE_OPTIONS).map(([key, option]) => {
          const isSelected = state.homeType.code === key;
          const isOther = key === 'HOME_OTHER_TEXT';
          
          return (
            <div key={key} className="space-y-2">
              <button
                onClick={() => {
                  updateState({
                    homeType: { code: key as HomeTypeCode, text: null }
                  });
                  if (!isOther) {
                    setTimeout(goToNextStep, 300);
                  }
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
              
              {isOther && isSelected && (
                <input
                  type="text"
                  placeholder="주거형태를 알려주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => updateState({
                    homeType: { code: key as HomeTypeCode, text: e.target.value }
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && state.homeType.text?.trim()) {
                      goToNextStep();
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // 5단계: 지역
  const renderRegionStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">어느 지역인가요?</h2>
        <p className="text-sm text-gray-600">서비스 지역을 선택해주세요</p>
      </div>
      
      {!showSubRegions ? (
        // 광역 지역 선택
        <div className="space-y-3">
          {Object.entries(REGION_OPTIONS).map(([key, option]) => {
            const isSelected = state.region.macro === key;
            const isOther = key === 'REGION_OTHER_TEXT';
            
            return (
              <div key={key} className="space-y-2">
                <button
                  onClick={() => {
                    if (key === 'REGION_SEOUL') {
                      updateState({
                        region: { macro: key as RegionCode, micro: null, text: null }
                      });
                      setShowSubRegions(true);
                    } else {
                      updateState({
                        region: { macro: key as RegionCode, micro: null, text: null }
                      });
                      if (!isOther) {
                        setTimeout(goToNextStep, 300);
                      }
                    }
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
                
                {isOther && isSelected && (
                  <input
                    type="text"
                    placeholder="지역을 알려주세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onChange={(e) => updateState({
                      region: { macro: key as RegionCode, micro: null, text: e.target.value }
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && state.region.text?.trim()) {
                        goToNextStep();
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // 서울 세부 지역 선택
        <div className="space-y-4">
          <button
            onClick={() => setShowSubRegions(false)}
            className="flex items-center text-blue-600 text-sm mb-2"
          >
            ← 뒤로 가기
          </button>
          
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {Object.entries(REGION_OPTIONS.REGION_SEOUL.subRegions).map(([key, option]) => {
              const isSelected = state.region.micro === key;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    updateState({
                      region: { ...state.region, micro: key as SubRegionCode }
                    });
                    setTimeout(goToNextStep, 300);
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgressBar = () => {
    const steps = ['issue', 'lastSeen', 'tenure', 'homeType', 'region'];
    const currentIndex = steps.indexOf(state.currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;
    
    return (
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>단계 {currentIndex + 1}/{steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const getCurrentStepContent = () => {
    switch (state.currentStep) {
      case 'issue':
        return renderIssueStep();
      case 'lastSeen':
        return renderLastSeenStep();
      case 'tenure':
        return renderTenureStep();
      case 'homeType':
        return renderHomeTypeStep();
      case 'region':
        return renderRegionStep();
      default:
        return null;
    }
  };

  // calendar 단계는 부모 컴포넌트에서 처리
  if (state.currentStep === 'calendar' || state.currentStep === 'summary') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      {renderProgressBar()}
      
      <div className="mb-6">
        {getCurrentStepContent()}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={goToPrevStep}
          disabled={!getPrevStep(state.currentStep)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          이전
        </button>
        
        <button
          onClick={goToNextStep}
          disabled={!validateStep(state.currentStep, state)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          다음
        </button>
      </div>
    </div>
  );
}