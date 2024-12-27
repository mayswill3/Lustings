import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BookingListProps, Booking } from '@/types/booking';
import BookingCard from './BookingCard';

export const BookingList: React.FC<BookingListProps> = ({
    bookings,
    user,
    handleStatusChange,
    handleEmailNotification
}) => {
    const isSentBooking = (booking: Booking) => booking.sender_id === user?.id;

    return (
        <div className="flex-1">
            <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        Booking Inbox
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    No bookings found
                                </p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    user={user}
                                    isSentBooking={isSentBooking(booking)}
                                    handleStatusChange={handleStatusChange}
                                    handleEmailNotification={handleEmailNotification}
                                />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingList;