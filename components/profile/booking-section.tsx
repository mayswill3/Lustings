import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { PersonalDetails } from './booking-section/PersonalDetails';
import { BookingDetails } from './booking-section/BookingDetails';
import { Comments } from './booking-section/Comments';
import { FormStatus } from './booking-section/FormStatus';
import { FormActions } from './booking-section/FormActions';
import { AvailabilityModal } from './booking-section/AvailabilityModal';
import { createClient } from '@/utils/supabase/client';
import { CalendarRange } from 'lucide-react';

const supabase = createClient();

interface BookingFormProps {
    userDetails: any; // Profile owner's details (recipient)
    user: any;
}

const BookingForm: React.FC<BookingFormProps> = ({ userDetails, user }) => {
    const [formData, setFormData] = React.useState({
        nickname: '',
        first_name: '',
        last_name: '',
        contact_number: '',
        contact_date: '',
        time_start: '',
        time_end: '',
        duration: '',
        overnight: false,
        meeting_type: 'out-call',
        proposed_fee: '',
        address1: '',
        address2: '',
        town: '',
        county: '',
        post_code: '',
        comments: ''
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const [showAvailability, setShowAvailability] = React.useState(false);

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First insert the booking
            const { data, error: submitError } = await supabase
                .from('bookings')
                .insert([{
                    user_id: user.id,
                    sender_id: user.id,
                    sender_email: user.email,
                    recipient_id: userDetails.id,
                    recipient_email: userDetails.email,
                    recipient_nickname: userDetails.full_name,
                    ...formData,
                    status: 'pending'
                }])
                .select();

            if (submitError) throw submitError;

            if (userDetails?.email) {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipientEmail: userDetails.email,
                        bookingDetails: data[0],
                        type: 'new'
                    }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    console.error('Email notification failed:', responseData.error);
                    throw new Error(responseData.error || 'Failed to send email');
                }

                if (!response.ok) {
                    console.error('Failed to send email notification');
                }
            }

            setSuccess(true);
            // Reset form...
        } catch (err) {
            console.error('Booking error:', err);
            setError('Failed to submit booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card >
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <CalendarRange className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Make a Booking
                    </h2>
                </div>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                    Fill in your details below to request a booking
                </CardDescription>
            </div>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PersonalDetails
                            formData={formData}
                            setFormData={setFormData}
                            timeSlots={timeSlots}
                            user={user}
                        />
                        <BookingDetails
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>

                    <Comments
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <FormStatus error={error} success={success} />
                    <FormActions
                        loading={loading}
                        setShowAvailability={setShowAvailability}
                    />
                </form>

                <AvailabilityModal
                    show={showAvailability}
                    onClose={() => setShowAvailability(false)}
                />
            </CardContent>
        </Card>
    );
};

export default BookingForm;