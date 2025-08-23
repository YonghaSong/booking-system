import { useState } from 'react';
import { BookingForm } from '../components/BookingForm';
import { BookingSuccess } from '../components/BookingSuccess';
import { Alert } from '../components/Alert';

export function HomePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleBookingSuccess = (newBookingNumber: string) => {
    setBookingNumber(newBookingNumber);
    setShowSuccess(true);
    setError('');
  };

  const handleBookingError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleNewBooking = () => {
    setShowSuccess(false);
    setBookingNumber('');
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div>
      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="예약 신청 실패"
            message={error}
            onClose={clearError}
          />
        </div>
      )}

      {/* 컨텐츠 영역 */}
      {showSuccess ? (
        <BookingSuccess
          bookingNumber={bookingNumber}
          onNewBooking={handleNewBooking}
        />
      ) : (
        <BookingForm
          onSuccess={handleBookingSuccess}
          onError={handleBookingError}
        />
      )}
    </div>
  );
}