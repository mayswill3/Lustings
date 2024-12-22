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

interface Booking {
    id: string;
    created_at: string;
    sender_id: string;
    recipient_id: string;
    nickname: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    contactDate: string;
    timeStart: string;
    timeEnd: string;
    duration: string;
    overnight: boolean;
    meetingType: 'in-call' | 'out-call';
    proposedFee: string;
    status: 'pending' | 'accepted' | 'declined';
    comments?: string;
}

export const BookingInbox = () => {
    const supabase = createClient();
    const [bookings, setBookings] = React.useState<Booking[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<{ id: string } | null>(null);
    const [view, setView] = React.useState<'all' | 'sent' | 'received'>('all');
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
            console.error('Error fetching bookings:', err);
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
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId)
                .eq('recipient_id', user.id);

            if (error) throw error;
            fetchBookings();
        } catch (err) {
            setError('Failed to update booking status');
            console.error('Error updating booking:', err);
        }
    };

    const isSentBooking = (booking: Booking) => booking.sender_id === user?.id;

    const getFilteredBookings = (status?: Booking['status']) => {
        let filtered = bookings;

        // Filter by sent/received if view is not 'all'
        if (view === 'sent') {
            filtered = filtered.filter(b => isSentBooking(b));
        } else if (view === 'received') {
            filtered = filtered.filter(b => !isSentBooking(b));
        }

        // Filter by status if provided
        if (status) {
            filtered = filtered.filter(b => b.status === status);
        }

        return filtered;
    };

    const BookingCard = ({ booking }: { booking: Booking }) => {
        const sent = isSentBooking(booking);

        return (
            <Card className="mb-4">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    {booking.firstName} {booking.lastName}
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
                            <p className="text-sm">{booking.contactNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Meeting Type</p>
                            <p className="text-sm capitalize">{booking.meetingType}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date & Time</p>
                            <p className="text-sm">
                                {new Date(booking.contactDate).toLocaleDateString()},
                                {booking.timeStart} - {booking.timeEnd}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Duration</p>
                            <p className="text-sm">
                                {booking.duration} hours {booking.overnight && '(Overnight)'}
                            </p>
                        </div>
                    </div>

                    {booking.comments && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500">Comments</p>
                            <p className="text-sm mt-1">{booking.comments}</p>
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

    // At the end of your BookingInbox component
    const pathname = usePathname();
    console.log(user)
    return (
        <div>
            <UserContext.Provider value={user}>
                {/* <UserDetailsContext.Provider value={props.userDetails}> */}
                <OpenContext.Provider value={{ open, setOpen }}>
                    <div className="flex h-full w-full flex-col dark:bg-zinc-950">
                        <Navbar className="mb-24" brandText={getActiveRoute(routes, pathname)} />
                    </div>
                </OpenContext.Provider>
                {/* </UserDetailsContext.Provider> */}
            </UserContext.Provider>
            <div className="max-w-4xl mx-auto mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Inbox</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={view} onValueChange={(value: 'all' | 'sent' | 'received') => setView(value)} className="mb-6">
                            <TabsList>
                                <TabsTrigger value="all">All Bookings</TabsTrigger>
                                <TabsTrigger value="sent">Sent</TabsTrigger>
                                <TabsTrigger value="received">Received</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Tabs defaultValue="pending" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                                <TabsTrigger value="declined">Declined</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                {getFilteredBookings().length === 0 ? (
                                    <p className="text-gray-500">No bookings found</p>
                                ) : (
                                    getFilteredBookings().map(booking => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="pending">
                                {getFilteredBookings('pending').map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </TabsContent>

                            <TabsContent value="accepted">
                                {getFilteredBookings('accepted').map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </TabsContent>

                            <TabsContent value="declined">
                                {getFilteredBookings('declined').map(booking => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BookingInbox;