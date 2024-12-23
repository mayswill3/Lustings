'use client'

// components/booking/BookingInbox.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Clock, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Navbar from '@/components/navbar/NavbarAdmin';
import { createClient } from '@/utils/supabase/client';
import { routes } from '@/components/routes';
import { getActiveRoute } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import {
    OpenContext,
    UserContext,
    UserDetailsContext
} from '@/contexts/layout';
import Link from 'next/link';

interface Booking {
    id: string;
    user_id: string | null;
    nickname: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    contact_date: string;
    time_start: string;
    time_end: string;
    duration: number;
    overnight: boolean;
    meeting_type: 'in-call' | 'out-call';
    proposed_fee: number;
    address1: string;
    address2: string;
    town: string;
    county: string;
    post_code: string;
    comments: string;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
    recipient_id: string;
    sender_id: string;
}

export const BookingInbox = () => {
    const supabase = createClient();
    const [bookings, setBookings] = React.useState<Booking[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<{ id: string } | null>(null);
    const [viewFilter, setViewFilter] = React.useState<'all' | 'sent' | 'received'>('all');
    const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
    const [open, setOpen] = React.useState(false);

    // Fetch current user
    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };

        fetchUser();
    }, []);

    // Fetch all bookings for the current user
    const fetchBookings = async () => {
        if (!user?.id) return;

        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user?.id) {
            fetchBookings();
        }
    }, [user]);

    // Real-time subscription for both sent and received bookings
    React.useEffect(() => {
        if (!user?.id) return;

        const subscription = supabase
            .channel('bookings')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookings',
                    filter: `or(recipient_id.eq.${user.id},sender_id.eq.${user.id})`
                },
                () => {
                    fetchBookings();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const handleStatusChange = async (bookingId: string, newStatus: 'accepted' | 'declined') => {
        if (!user?.id) return;

        try {
            // Update booking status
            const { data, error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId)
                .eq('recipient_id', user.id)
                .select();

            if (error) throw error;

            if (data[0].sender_email) {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipientEmail: data[0].sender_email,
                        bookingDetails: data[0],
                        type: 'update'
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to send email notification');
                }
            }

            fetchBookings();
        } catch (err) {
            setError('Failed to update booking status');
        }
    };

    const getFilteredBookings = () => {
        if (!bookings || !user) return [];

        return bookings.filter(booking => {
            // Check if booking matches the view filter (sent/received)
            const isViewMatch = viewFilter === 'all' ? true :
                viewFilter === 'sent' ? booking.sender_id === user.id :
                    booking.recipient_id === user.id;

            // Check if booking matches the status filter
            const isStatusMatch = statusFilter === 'all' ? true :
                booking.status === statusFilter;

            return isViewMatch && isStatusMatch;
        });
    };


    const isSentBooking = (booking: Booking) => booking.sender_id === user?.id;

    const BookingCard = ({ booking }: { booking: Booking }) => {
        const sent = isSentBooking(booking);

        return (
            <Card className="mb-4">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    {booking.first_name} {booking.last_name}
                                </h3>
                                <Badge
                                    variant={sent ? "secondary" : "outline"}
                                    className="flex items-center gap-1"
                                >
                                    {sent ? (
                                        <><ArrowUpRight className="h-3 w-3" /> Sent</>
                                    ) : (
                                        <><ArrowDownLeft className="h-3 w-3" /> Received</>
                                    )}
                                </Badge>
                                <Badge variant="outline" className="text-sm">
                                    <Link href={`/profile/${encodeURIComponent(booking.nickname)}`}>{booking.nickname}</Link>
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                            </p>
                        </div>
                        <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Contact Details</p>
                            <p className="text-sm">{booking.contact_number}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Meeting Type</p>
                            <p className="text-sm capitalize">{booking.meeting_type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date & Time</p>
                            <p className="text-sm">
                                {new Date(booking.contact_date).toLocaleDateString()},{' '}
                                {booking.time_start} - {booking.time_end}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Duration & Fee</p>
                            <p className="text-sm">
                                {booking.duration} hours {booking.overnight && '(Overnight)'} • £{booking.proposed_fee}
                            </p>
                        </div>
                    </div>

                    {booking.comments && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500">Comments</p>
                            <p className="text-sm mt-1">{booking.comments}</p>
                        </div>
                    )}

                    {booking.meeting_type === 'out-call' && booking.address1 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-sm mt-1">
                                {booking.address1}
                                {booking.address2 && <>, {booking.address2}</>}
                                {booking.town && <>, {booking.town}</>}
                                {booking.county && <>, {booking.county}</>}
                                {booking.post_code && <>, {booking.post_code}</>}
                            </p>
                        </div>
                    )}

                    {!sent && booking.status === 'pending' && (
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => handleStatusChange(booking.id, 'declined')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Decline
                            </Button>
                            <Button
                                onClick={() => handleStatusChange(booking.id, 'accepted')}
                                className="bg-green-600 text-white hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const StatusBadge = ({ status }: { status: Booking['status'] }) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            accepted: 'bg-green-100 text-green-800 border-green-200',
            declined: 'bg-red-100 text-red-800 border-red-200'
        };

        const icons = {
            pending: <Clock className="w-4 h-4 mr-1" />,
            accepted: <CheckCircle className="w-4 h-4 mr-1" />,
            declined: <XCircle className="w-4 h-4 mr-1" />
        };

        return (
            <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}>
                {icons[status]}
                <span className="capitalize">{status}</span>
            </div>
        );
    };

    if (!user) return <div>Please log in to view your bookings</div>;
    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    const pathname = usePathname();
    return (
        <div>
            <UserContext.Provider value={user}>
                <OpenContext.Provider value={{ open, setOpen }}>
                    <div className="flex h-full w-full flex-col dark:bg-zinc-950">
                        <Navbar className="mb-24" brandText={getActiveRoute(routes, pathname)} />
                    </div>
                </OpenContext.Provider>
            </UserContext.Provider>
            <div className="max-w-7xl mx-auto mt-20 px-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block lg:w-64 flex-shrink-0">
                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-6">
                                    {/* View Filter */}
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 mb-3">View</h3>
                                        <div className="space-y-2">
                                            {[
                                                { value: 'all', label: 'All Bookings' },
                                                { value: 'sent', label: 'Sent' },
                                                { value: 'received', label: 'Received' }
                                            ].map((item) => (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setViewFilter(item.value as typeof viewFilter)}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                        ${viewFilter === item.value
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 mb-3">Status</h3>
                                        <div className="space-y-2">
                                            {[
                                                { value: 'all', label: 'All Status', color: 'blue' },
                                                { value: 'pending', label: 'Pending', color: 'yellow' },
                                                { value: 'accepted', label: 'Accepted', color: 'green' },
                                                { value: 'declined', label: 'Declined', color: 'red' }
                                            ].map((item) => (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setStatusFilter(item.value as typeof statusFilter)}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                        ${statusFilter === item.value
                                                            ? `bg-${item.color}-50 text-${item.color}-700 dark:bg-${item.color}-900 dark:text-${item.color}-100`
                                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(!open)}
                            className="w-full"
                        >
                            {open ? 'Hide Filters' : 'Show Filters'}
                        </Button>

                        {open && (
                            <Card className="mt-4">
                                <CardContent className="p-4">
                                    <div className="space-y-6">
                                        {/* View Filter */}
                                        <div>
                                            <h3 className="font-medium text-sm text-gray-500 mb-3">View</h3>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'all', label: 'All Bookings' },
                                                    { value: 'sent', label: 'Sent' },
                                                    { value: 'received', label: 'Received' }
                                                ].map((item) => (
                                                    <button
                                                        key={item.value}
                                                        onClick={() => setViewFilter(item.value as typeof viewFilter)}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                            ${viewFilter === item.value
                                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Filter */}
                                        <div>
                                            <h3 className="font-medium text-sm text-gray-500 mb-3">Status</h3>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'all', label: 'All Status', color: 'blue' },
                                                    { value: 'pending', label: 'Pending', color: 'yellow' },
                                                    { value: 'accepted', label: 'Accepted', color: 'green' },
                                                    { value: 'declined', label: 'Declined', color: 'red' }
                                                ].map((item) => (
                                                    <button
                                                        key={item.value}
                                                        onClick={() => setStatusFilter(item.value as typeof statusFilter)}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                            ${statusFilter === item.value
                                                                ? `bg-${item.color}-50 text-${item.color}-700 dark:bg-${item.color}-900 dark:text-${item.color}-100`
                                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Booking Inbox</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {getFilteredBookings().length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No bookings found</p>
                                    ) : (
                                        getFilteredBookings().map(booking => (
                                            <BookingCard key={booking.id} booking={booking} />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookingInbox;