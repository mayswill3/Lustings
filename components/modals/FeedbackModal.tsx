import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from '@/utils/supabase/client';
import { Booking } from '@/types/booking';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    user: any;
}

const FeedbackModal = ({ isOpen, onClose, booking, user }: FeedbackModalProps) => {
    const supabase = createClient();
    const [type, setType] = React.useState<'positive' | 'neutral' | 'negative' | null>(null);
    const [comment, setComment] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isSender = booking.sender_id === user?.id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type) return;

        // Check if booking is completed before allowing feedback
        if (booking.status !== 'completed') {
            console.error('Cannot leave feedback until booking is completed');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('feedbacks')
                .insert([{
                    booking_id: booking.id,
                    sender_id: user.id,
                    recipient_id: isSender ? booking.recipient_id : booking.sender_id,
                    feedback_type: type,
                    comment
                }]);

            if (error) throw error;
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Leave Feedback</DialogTitle>
                    <DialogDescription>
                        Share your experience with {isSender ? booking.recipient_nickname : booking.nickname}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: 'positive', label: 'Positive', color: 'bg-green-100 hover:bg-green-200 text-green-700' },
                            { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
                            { value: 'negative', label: 'Negative', color: 'bg-red-100 hover:bg-red-200 text-red-700' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setType(option.value as typeof type)}
                                className={`p-4 rounded-lg transition-colors ${option.color} ${type === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Comment
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            required
                            className="h-32"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !type}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackModal;