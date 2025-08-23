import { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { PEST_TYPE_LABELS, TIME_SLOT_LABELS, BOOKING_STATUS_LABELS } from '../types';
import { getAllBookings } from '../services/bookingService';
import { logoutAdmin, extendAdminSession } from '../services/authService';
import { formatBookingNumber } from '../utils/generateId';
import { BookingEditModal } from './BookingEditModal';
import { Alert } from './Alert';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const allBookings = await getAllBookings();
      setBookings(allBookings);
      setError('');
    } catch (error) {
      console.error('예약 목록 조회 오류:', error);
      setError('예약 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // 세션 연장
    extendAdminSession();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const handleBookingUpdate = () => {
    setSelectedBooking(null);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: string) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                총 {bookings.length}개의 예약이 등록되어 있습니다
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors w-full sm:w-auto"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 sm:mb-6">
            <Alert
              type="error"
              title="오류"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">전체 예약</div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{getStatusCount('received')}</div>
            <div className="text-xs sm:text-sm text-gray-600">접수됨</div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{getStatusCount('confirmed')}</div>
            <div className="text-xs sm:text-sm text-gray-600">확인됨</div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{getStatusCount('in_progress')}</div>
            <div className="text-xs sm:text-sm text-gray-600">진행중</div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{getStatusCount('completed')}</div>
            <div className="text-xs sm:text-sm text-gray-600">완료됨</div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                상태 필터
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="all">모든 상태</option>
                <option value="received">접수됨</option>
                <option value="confirmed">확인됨</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료됨</option>
                <option value="cancelled">취소됨</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                검색 (예약번호, 고객명, 전화번호)
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="검색어를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 예약 목록 */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm sm:text-base text-gray-600">로딩 중...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">조건에 맞는 예약이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {BOOKING_STATUS_LABELS[booking.status]}
                            </span>
                            <div className="font-mono text-sm font-medium text-gray-900">
                              {formatBookingNumber(booking.bookingNumber)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 sm:ml-4">
                            {booking.customerName} | {booking.customerPhone}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <span>🏠 {booking.serviceAddress}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                            <span>🐛 {PEST_TYPE_LABELS[booking.pestType]}</span>
                            <span>📅 {new Date(booking.preferredDate).toLocaleDateString('ko-KR')}</span>
                            <span>{TIME_SLOT_LABELS[booking.timeSlot]}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            신청: {booking.createdAt.toLocaleDateString('ko-KR')} {booking.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end sm:ml-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto justify-center"
                        >
                          관리
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 예약 편집 모달 */}
      {selectedBooking && (
        <BookingEditModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleBookingUpdate}
        />
      )}
    </div>
  );
}