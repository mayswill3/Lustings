import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveRoute } from '@/utils/navigation';
import { routes } from '@/components/routes';
import Navbar from '@/components/navbar/NavbarAdmin';
import { BookingFilters } from '@/components/booking/BookingFilters';
import { BookingList } from '@/components/booking/BookingList';
import { UserContext, OpenContext } from '@/contexts/layout';
import { useBookings } from '../../components/hooks/useBookings';
import { Booking } from '@/types/booking';
import { User } from '@supabase/supabase-js';

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

    const userWithMetadata: User | null = user ? {
        ...user,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
    } : null;

    const renderContent = () => {
        if (!user) {
            return <div className="flex-1 flex items-center justify-center">Please log in to view your bookings</div>;
        }
        if (loading) {
            return <div className="flex-1 flex items-center justify-center">Loading bookings...</div>;
        }
        if (error) {
            return <div className="flex-1 flex items-center justify-center">Error: {error}</div>;
        }

        return (
            <div className="max-w-7xl mx-auto px-4">
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
                            bookings={getFilteredBookings(bookings)}
                            user={user}
                            handleStatusChange={handleStatusChange}
                            handleEmailNotification={handleEmailNotification}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <OpenContext.Provider value={{ open, setOpen }}>
            <UserContext.Provider value={userWithMetadata}>
                <div className="flex h-full w-full flex-col dark:bg-zinc-900">
                    <Navbar
                        className="mb-24"
                        brandText={getActiveRoute(routes, pathname)}
                    />
                    <div className="flex-1 mt-20">
                        {renderContent()}
                    </div>
                </div>
            </UserContext.Provider>
        </OpenContext.Provider>
    );
};

export default BookingInbox;