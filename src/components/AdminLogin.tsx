import { useState } from 'react';
import { authenticateAdmin } from '../services/authService';
import { Alert } from './Alert';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('패스워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    // 실제 인증 전에 약간의 지연 (브루트포스 공격 방지)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (authenticateAdmin(password)) {
      onLoginSuccess();
    } else {
      setError('잘못된 패스워드입니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-xl sm:text-2xl">🔒</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 px-2">
            예약 관리 시스템에 액세스하려면 인증이 필요합니다
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              패스워드
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-3 sm:py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm sm:text-base"
              placeholder="관리자 패스워드"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">인증 중...</span>
                </div>
              ) : (
                '로그인'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 sm:mt-6 bg-amber-50 border border-amber-200 rounded-md p-3 sm:p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-amber-400 text-sm sm:text-base">⚠️</span>
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-amber-800">
                보안 알림
              </h3>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-700">
                <p>
                  이 시스템은 고객 정보를 포함하고 있습니다. 
                  승인된 관리자만 접근할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}