import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import FeedbackModal from '@/components/modals/FeedbackModal';
import { StatusBadge } from './StatusBadge';

const supabase = createClient();

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
    recipient_nickname: string;
    sender_id: string;
}

interface BookingListProps {
    bookings: Booking[];
    user: any;
    handleStatusChange: (id: string, status: 'accepted' | 'declined') => void;
}

interface BookingCardProps {
    booking: Booking;
    user: any;
    isSent: boolean;
    onStatusChange: (id: string, status: 'accepted' | 'declined') => void;
}

interface BookingActionsProps {
    booking: Booking;
    isSent: boolean;
    hasFeedback: boolean;
    onStatusChange: (id: string, status: 'accepted' | 'declined') => void;
    onFeedback: () => void;
}

// Helper Components
const BookingBadge = ({ isSent }: { isSent: boolean }) => (
    <Badge
        variant={isSent ? "secondary" : "outline"}
        className="flex items-center gap-1 dark:bg-zinc-700 dark:text-zinc-200"
    >
        {isSent ? (
            <><ArrowUpRight className="h-3 w-3" /> Sent</>
        ) : (
            <><ArrowDownLeft className="h-3 w-3" /> Received</>
        )}
    </Badge>
);

const UserLink = ({ booking, isSent }: { booking: Booking; isSent: boolean }) => (
    <Badge
        variant="outline"
        className="text-sm dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
    >
        <Link
            href={`/profile/${encodeURIComponent(
                isSent ? booking.recipient_nickname : booking.nickname
            )}`}
            className="hover:text-blue-600 dark:hover:text-blue-400"
        >
            {isSent ? booking.recipient_nickname : booking.nickname}
        </Link>
    </Badge>
);

const BookingTimestamp = ({ date }: { date: string }) => (
    <p className="text-sm text-gray-500 dark:text-gray-400">
        {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </p>
);

const BookingDetails = ({ booking }: { booking: Booking }) => (
    <>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Details</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">{booking.contact_number}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meeting Type</p>
                <p className="text-sm capitalize text-gray-700 dark:text-gray-200">{booking.meeting_type}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                    {new Date(booking.contact_date).toLocaleDateString()},{' '}
                    {booking.time_start} - {booking.time_end}
                </p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration & Fee</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                    {booking.duration} hours {booking.overnight && '(Overnight)'} • £{booking.proposed_fee}
                </p>
            </div>
        </div>

        {booking.comments && (
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</p>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-200">{booking.comments}</p>
            </div>
        )}

        {booking.meeting_type === 'out-call' && booking.address1 && (
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-200">
                    {booking.address1}
                    {booking.address2 && <>, {booking.address2}</>}
                    {booking.town && <>, {booking.town}</>}
                    {booking.county && <>, {booking.county}</>}
                    {booking.post_code && <>, {booking.post_code}</>}
                </p>
            </div>
        )}
    </>
);

const BookingActions = ({
    booking,
    isSent,
    hasFeedback,
    onStatusChange,
    onFeedback
}: BookingActionsProps) => {
    if (booking.status === 'accepted') {
        if (hasFeedback) {
            return (
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-3 py-2 rounded-md">
                    ✓ Feedback submitted
                </div>
            );
        }
        return (
            <Button
                variant="outline"
                onClick={onFeedback}
                className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
                {isSent ? "Leave Feedback as Sender" : "Leave Feedback as Receiver"}
            </Button>
        );
    }

    if (!isSent && booking.status === 'pending') {
        return (
            <>
                <Button
                    variant="outline"
                    onClick={() => onStatusChange(booking.id, 'declined')}
                    className="text-red-600
              border-red-200 dark:border-red-900/50
              hover:bg-red-100/50 hover:text-red-700 
              dark:hover:bg-red-900/50 dark:hover:text-red-300
              transition-colors duration-200"
                >
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                </Button>
                <Button
                    onClick={() => onStatusChange(booking.id, 'accepted')}
                    className="bg-green-600 text-white dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                </Button>
            </>
        );
    }

    return null;
};

const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    user,
    isSent,
    onStatusChange
}) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [hasFeedback, setHasFeedback] = useState(false);

    const checkFeedback = async () => {
        try {
            const { data } = await supabase
                .from('feedbacks')
                .select('id')
                .eq('booking_id', booking.id)
                .eq('sender_id', user?.id)
                .single();

            setHasFeedback(!!data);
        } catch (error) {
            setHasFeedback(false);
        }
    };

    React.useEffect(() => {
        if (booking.status === 'accepted') {
            checkFeedback();
        }
    }, [booking.id, showFeedbackModal]);

    return (
        <Card className="mb-4 bg-white dark:bg-zinc-900 border dark:border-zinc-700">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {booking.first_name} {booking.last_name}
                            </h3>
                            <BookingBadge isSent={isSent} />
                            <UserLink booking={booking} isSent={isSent} />
                        </div>
                        <BookingTimestamp date={booking.created_at} />
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <BookingDetails booking={booking} />

                <div className="flex justify-end space-x-3">
                    <BookingActions
                        booking={booking}
                        isSent={isSent}
                        hasFeedback={hasFeedback}
                        onStatusChange={onStatusChange}
                        onFeedback={() => setShowFeedbackModal(true)}
                    />
                </div>

                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                    booking={booking}
                    user={user}
                />
            </CardContent>
        </Card>
    );
};

export const BookingList: React.FC<BookingListProps> = ({
    bookings,
    user,
    handleStatusChange
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
                                    isSent={isSentBooking(booking)}
                                    onStatusChange={handleStatusChange}
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