import { useState } from 'react';
import { BookingSearch } from '../components/BookingSearch';
import { BookingDetail } from '../components/BookingDetail';
import type { Booking } from '../types';

export function SearchPage() {
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  const handleBookingFound = (booking: Booking) => {
    setFoundBooking(booking);
  };

  const handleBack = () => {
    setFoundBooking(null);
  };

  const handleNewSearch = () => {
    setFoundBooking(null);
  };

  return (
    <div>
      {foundBooking ? (
        <BookingDetail
          booking={foundBooking}
          onBack={handleBack}
          onNewSearch={handleNewSearch}
        />
      ) : (
        <BookingSearch onBookingFound={handleBookingFound} />
      )}
    </div>
  );
}