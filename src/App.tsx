import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AdminPage } from './pages/AdminPage';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-blue-600">🏠</span>
            <span className="text-lg sm:text-xl font-bold text-gray-800">벌레없음</span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              예약 신청
            </Link>
            <Link
              to="/search"
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                location.pathname === '/search'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              예약 조회
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-800">주식회사 벌레없음</h3>
            <p className="text-sm text-gray-600">
              전화: 1588-0000 | 이메일: contact@bugfree.com
            </p>
            <p className="text-sm text-gray-600">
              주소: 경기도 하남시 미사강변동로 79, 11층 1103호-4
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">예약 신청</Link>
              <span>|</span>
              <Link to="/search" className="hover:text-gray-700">예약 조회</Link>
              <span>|</span>
              <a href="tel:1588-0000" className="hover:text-gray-700">고객센터</a>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 주식회사 벌레없음. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;