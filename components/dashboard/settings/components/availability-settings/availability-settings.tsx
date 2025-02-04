'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { checkAvailability } from '@/utils/availability';
import { AvailabilityStatus } from './availability-status';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function AvailabilitySettings(props: Props) {
    const [isAvailable, setIsAvailable] = useState(false);
    const [availabilityLoading, setAvailabilityLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<{
        preferences: any; id: string
    } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error('Error fetching user:', userError);
                    return;
                }

                const { data: userDetails, error: detailsError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user?.id)
                    .single();

                if (detailsError) {
                    console.error('Error fetching user details:', detailsError);
                    return;
                }

                setUserDetails(userDetails);

                // Check availability status
                if (userDetails?.member_type === 'Offering Services') {
                    try {
                        const available = await checkAvailability(userDetails.id);
                        setIsAvailable(available);
                    } catch (error) {
                        console.error('Error checking availability:', error);
                    } finally {
                        setAvailabilityLoading(false);
                    }
                }
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get the current user data to ensure we have the latest state
            const { data: currentUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userDetails?.id)
                .single();

            if (fetchError) throw fetchError;

            // Preserve existing preferences and only update the isAvailable field
            const updatedPreferences = {
                ...currentUser.preferences, // Preserve all existing preferences
                escorting: {
                    ...currentUser.preferences?.escorting, // Preserve existing escorting preferences
                    isAvailable, // Update only the isAvailable field
                },
            };

            // Update the database with the merged preferences
            const { error } = await supabase
                .from('users')
                .update({ preferences: updatedPreferences })
                .eq('id', userDetails?.id);

            if (error) throw error;

            toast.success('Availability updated successfully');
        } catch (error) {
            console.error('Error updating availability:', error);
            toast.error('Failed to update availability');
        }

        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-full sm:max-w-5xl mx-auto p-2 sm:p-6 space-y-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <AvailabilityStatus
                        isAvailable={isAvailable}
                        setIsAvailable={setIsAvailable}
                        availabilityLoading={availabilityLoading}
                        setAvailabilityLoading={setAvailabilityLoading}
                        userId={userDetails?.id}
                    />

                    {/* Save Buttons */}
                    {/* <div className="sticky bottom-4 z-10 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
                        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div> */}
                </div>
            </form>
        </div>
    );
}