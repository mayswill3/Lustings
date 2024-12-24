// components/booking/BookingCard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { StatusBadge } from './StatusBadge';
import FeedbackModal from '@/components/modals/FeedbackModal';

const supabase = createClient();

interface BookingCardProps {
    booking: {
        id: string;
        first_name: string;
        last_name: string;
        nickname: string;
        recipient_nickname: string;
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
        sender_id: string;
        recipient_id: string;
    };
    user: { id: string };
    handleStatusChange: (bookingId: string, status: 'accepted' | 'declined') => void;
}

export const BookingCard = ({ booking, user, handleStatusChange }: BookingCardProps) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [hasFeedback, setHasFeedback] = useState(false);
    const isSent = booking.sender_id === user.id;

    const checkFeedback = async () => {
        try {
            const { data } = await supabase
                .from('feedbacks')
                .select('id')
                .eq('booking_id', booking.id)
                .eq('sender_id', user.id)
                .single();

            setHasFeedback(!!data);
        } catch (error) {
            setHasFeedback(false);
        }
    };

    useEffect(() => {
        if (booking.status === 'accepted') {
            checkFeedback();
        }
    }, [booking.id, showFeedbackModal]);

    const renderFeedbackButton = () => {
        if (booking.status !== 'accepted') return null;

        if (hasFeedback) {
            return (
                <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                    ✓ Feedback submitted
                </div>
            );
        }

        return (
            <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(true)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
                {isSent ? "Leave Feedback as Sender" : "Leave Feedback as Receiver"}
            </Button>
        );
    };

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
                                variant={isSent ? "secondary" : "outline"}
                                className="flex items-center gap-1"
                            >
                                {isSent ? (
                                    <><ArrowUpRight className="h-3 w-3" /> Sent</>
                                ) : (
                                    <><ArrowDownLeft className="h-3 w-3" /> Received</>
                                )}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                <Link
                                    href={`/profile/${encodeURIComponent(
                                        isSent ? booking.recipient_nickname : booking.nickname
                                    )}`}
                                >
                                    {isSent ? booking.recipient_nickname : booking.nickname}
                                </Link>
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

                <div className="flex justify-end space-x-3">
                    {!isSent && booking.status === 'pending' && (
                        <>
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
                        </>
                    )}
                    {renderFeedbackButton()}
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

export default BookingCard;