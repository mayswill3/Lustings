// components/booking/BookingInbox.tsx
'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getActiveRoute } from '@/utils/navigation';
import { routes } from '@/components/routes';
import Navbar from '@/components/navbar/NavbarAdmin';
import { BookingFilters } from '@/components/booking/BookingFilters';
import { BookingList } from '@/components/booking/BookingList';
import { UserContext, OpenContext } from '@/contexts/layout';
import { useBookings } from '../../components/hooks/useBookings';
import { Booking } from '@/types/booking';
import { Card } from '@/components/ui/card';

const supabase = createClient();

export const BookingInbox = () => {
    const [viewFilter, setViewFilter] = useState<'all' | 'sent' | 'received'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const {
        bookings,
        loading,
        error,
        user,
        handleStatusChange,
        handleEmailNotification
    } = useBookings();

    const getFilteredBookings = (bookings: Booking[]) => {
        if (!bookings || !user) return [];

        return bookings.filter(booking => {
            const isViewMatch = viewFilter === 'all' ? true :
                viewFilter === 'sent' ? booking.sender_id === user.id :
                    booking.recipient_id === user.id;

            const isStatusMatch = statusFilter === 'all' ? true :
                booking.status === statusFilter;

            return isViewMatch && isStatusMatch;
        });
    };

    if (!user) return <div>Please log in to view your bookings</div>;
    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    const filteredBookings = getFilteredBookings(bookings);

    return (
        <Card>
            <UserContext.Provider value={user}>
                <OpenContext.Provider value={{ open, setOpen }}>
                    <div className="flex h-full w-full flex-col dark:bg-zinc-900">
                        <Navbar
                            className="mb-24"
                            brandText={getActiveRoute(routes, pathname)}
                        />
                    </div>
                </OpenContext.Provider>
            </UserContext.Provider>

            <div className="max-w-7xl mx-auto mt-20 px-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Filters */}
                    <div className="hidden lg:block lg:w-64 flex-shrink-0">
                        <BookingFilters
                            viewFilter={viewFilter}
                            statusFilter={statusFilter}
                            setViewFilter={setViewFilter}
                            setStatusFilter={setStatusFilter}
                        />
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden">
                        <BookingFilters
                            viewFilter={viewFilter}
                            statusFilter={statusFilter}
                            setViewFilter={setViewFilter}
                            setStatusFilter={setStatusFilter}
                            isMobile
                            isOpen={open}
                            setIsOpen={setOpen}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <BookingList
                            bookings={filteredBookings}
                            user={user}
                            handleStatusChange={handleStatusChange}
                            handleEmailNotification={handleEmailNotification}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BookingInbox;