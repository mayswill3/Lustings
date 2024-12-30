'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LocationPreferences } from './escorting-options/LocationPreferences';
import { RatesConfiguration } from './escorting-options/RatesConfiguration';
import { AvailabilityStatus } from './escorting-options/AvailabilityStatus';
import { checkAvailability } from '@/utils/availability';
import VerificationUploader from './escorting-options/verification-upload';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

// Main Component
export default function EscortingOptions(props: Props) {
    const [isAvailable, setIsAvailable] = useState(false);
    const [availabilityLoading, setAvailabilityLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [locationInfo, setLocationInfo] = useState({
        canAccommodate: false,
        willTravel: false,
    });
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [userDetails, setUserDetails] = useState<{
        preferences?: {
            escorting?: {
                locationInfo?: {
                    canAccommodate: boolean;
                    willTravel: boolean;
                };
                rates?: {
                    inCall: { [key: string]: string };
                    outCall: { [key: string]: string };
                };
                currency?: string;
                fieldReports?: string;
            };
        };
    } | null>(null);

    const [rates, setRates] = useState({
        inCall: {
            "15mins": '',
            "30mins": '',
            "45mins": '',
            "1hour": '',
            "1.5hours": '',
            "2hours": '',
            "3hours": '',
            "4hours": '',
            "overnight": '',
        },
        outCall: {
            "15mins": '',
            "30mins": '',
            "45mins": '',
            "1hour": '',
            "1.5hours": '',
            "2hours": '',
            "3hours": '',
            "4hours": '',
            "overnight": '',
        },
    });

    const [currency, setCurrency] = useState('GBP');
    const [fieldReports, setFieldReports] = useState('');

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

                setUser(user);

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

                // Set initial states from escorting preferences
                if (userDetails?.preferences?.escorting) {
                    const escortingData = userDetails.preferences.escorting;
                    setLocationInfo(escortingData.locationInfo || {
                        canAccommodate: false,
                        willTravel: false
                    });

                    // Properly initialize rates with default values if not present
                    const defaultRates = {
                        inCall: {
                            "15mins": '', "30mins": '', "45mins": '',
                            "1hour": '', "1.5hours": '', "2hours": '',
                            "3hours": '', "4hours": '', "overnight": '',
                        },
                        outCall: {
                            "15mins": '', "30mins": '', "45mins": '',
                            "1hour": '', "1.5hours": '', "2hours": '',
                            "3hours": '', "4hours": '', "overnight": '',
                        }
                    };

                    // Merge existing rates with defaults to ensure all fields exist
                    const savedRates = escortingData.rates || {};
                    setRates({
                        inCall: { ...defaultRates.inCall, ...savedRates.inCall },
                        outCall: { ...defaultRates.outCall, ...savedRates.outCall }
                    });

                    setCurrency(escortingData.currency || 'GBP');
                    setFieldReports(escortingData.fieldReports || '');
                }
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Update handleSubmit to ensure rates are properly structured
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Clean up rates data by removing empty values
            const cleanRates = {
                inCall: Object.fromEntries(
                    Object.entries(rates.inCall).filter(([_, value]) => value !== '')
                ),
                outCall: Object.fromEntries(
                    Object.entries(rates.outCall).filter(([_, value]) => value !== '')
                ),
            };

            // Prepare the escorting data
            const escortingData = {
                locationInfo,
                rates: cleanRates,
                currency,
                fieldReports,
            };

            // Combine with existing preferences
            const updatedPreferences = {
                ...userDetails?.preferences,
                escorting: escortingData,
            };

            // Update the database with new preferences
            const { error } = await supabase
                .from('users')
                .update({ preferences: updatedPreferences })
                .eq('id', user?.id);

            if (error) throw error;

            toast.success('Escorting options updated successfully');
        } catch (error) {
            console.error('Error updating escorting options:', error);
            toast.error('Failed to update escorting options');
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
        <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <LocationPreferences
                        locationInfo={locationInfo}
                        setLocationInfo={setLocationInfo}
                    />

                    <RatesConfiguration
                        rates={rates}
                        setRates={setRates}
                        currency={currency}
                        setCurrency={setCurrency}
                        fieldReports={fieldReports}
                        setFieldReports={setFieldReports}
                    />

                    <AvailabilityStatus
                        isAvailable={isAvailable}
                        setIsAvailable={setIsAvailable}
                        availabilityLoading={availabilityLoading}
                        setAvailabilityLoading={setAvailabilityLoading}
                        userId={userDetails?.id}
                    />
                    <VerificationUploader
                        user={user}
                    />

                    {/* Save Buttons */}
                    <div className="sticky bottom-4 z-10 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
                        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                onClick={async () => {
                                    setIsSubmitting(true);
                                    await handleSubmit(new Event('submit'));
                                    const { data: userDetails, error } = await supabase
                                        .from('users')
                                        .select('full_name')
                                        .eq('id', user?.id)
                                        .single();

                                    setIsSubmitting(false);

                                    if (error || !userDetails?.full_name) {
                                        console.error('Error fetching full_name:', error);
                                        toast.error('Failed to redirect: full_name not found');
                                        return;
                                    }

                                    window.location.href = `/profile/${encodeURIComponent(userDetails.full_name)}`;
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving and Redirecting...' : 'Save and View Profile'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}