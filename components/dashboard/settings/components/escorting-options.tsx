'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { setAvailability, checkAvailability } from '@/utils/availability';
import * as Switch from '@radix-ui/react-switch';
import { MapPin, Clock, Settings, ArrowRight, Calendar, Star } from 'lucide-react';
import { AvailabilityList } from './escorting-options/availability-list';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { FeaturedProfileList } from './escorting-options/featured-list';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}


// Component Types
interface ToggleProps {
    id?: string;
    name?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
}

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    placeholder?: string;
}

// Reusable Components
const Toggle = ({ checked, onCheckedChange, name, id }: ToggleProps) => {
    return (
        <Switch.Root
            id={id}
            name={name}
            className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
            checked={checked}
            onCheckedChange={onCheckedChange}
        >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-lg" />
        </Switch.Root>
    );
};

const Label = ({ htmlFor, children }: LabelProps) => (
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {children}
    </span>
);

const Select = ({ value, onValueChange, children, placeholder }: SelectProps) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
        </select>
    </div>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
);

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


    const timeSlots = [
        { id: '15mins', label: '15m' },
        { id: '30mins', label: '30m' },
        { id: '45mins', label: '45m' },
        { id: '1hour', label: '1h' },
        { id: '1.5hours', label: '1.5h' },
        { id: '2hours', label: '2h' },
        { id: '3hours', label: '3h' },
        { id: '4hours', label: '4h' },
        { id: 'overnight', label: 'O/N' },
    ];

    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'inCall' | 'outCall', timeSlot: string) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setRates(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [timeSlot]: value
            }
        }));
    };

    return (
        <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Location Settings Section */}
                    <CollapsibleSection
                        title="Location Preferences"
                        icon={<MapPin />}
                        defaultOpen={true}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between space-x-4">
                                <Label htmlFor="accommodate">In-call Services</Label>
                                <Toggle
                                    id="accommodate"
                                    checked={locationInfo.canAccommodate}
                                    onCheckedChange={(checked) =>
                                        setLocationInfo(prev => ({ ...prev, canAccommodate: checked }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <Label htmlFor="travel">Out-call Services</Label>
                                <Toggle
                                    id="travel"
                                    checked={locationInfo.willTravel}
                                    onCheckedChange={(checked) =>
                                        setLocationInfo(prev => ({ ...prev, willTravel: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Rates Section */}
                    <CollapsibleSection
                        title="Rate Configuration"
                        icon={<Clock />}
                        defaultOpen={false}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left px-2 py-1 font-medium">Duration</th>
                                        {timeSlots.map(({ id, label }) => (
                                            <th key={id} className="px-2 py-1 font-medium">{label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-2 py-1">In-call</td>
                                        {timeSlots.map(({ id }) => (
                                            <td key={id} className="px-1 py-1">
                                                <Input
                                                    type="text"
                                                    value={rates.inCall[id]}
                                                    onChange={(e) => handleNumberInput(e, 'inCall', id)}
                                                    className="w-16 h-8 text-sm"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1">Out-call</td>
                                        {timeSlots.map(({ id }) => (
                                            <td key={id} className="px-1 py-1">
                                                <Input
                                                    type="text"
                                                    value={rates.outCall[id]}
                                                    onChange={(e) => handleNumberInput(e, 'outCall', id)}
                                                    className="w-16 h-8 text-sm"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Field Reports</Label>
                                <Select value={fieldReports} onValueChange={setFieldReports} placeholder="Select report">
                                    <SelectItem value="report1">Field Report 1</SelectItem>
                                    <SelectItem value="report2">Field Report 2</SelectItem>
                                </Select>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Availability Section */}
                    <CollapsibleSection
                        title="Availability Status"
                        icon={<Clock />}
                        defaultOpen={false}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between space-x-4">
                                <Label htmlFor="availableToday">Available Today (Until Midnight)</Label>
                                <Toggle
                                    id="availableToday"
                                    checked={isAvailable}
                                    onCheckedChange={async (state) => {
                                        try {
                                            setAvailabilityLoading(true);
                                            await setAvailability(userDetails?.id, state);
                                            setIsAvailable(state);
                                            toast.success(state ? 'You are now available until midnight' : 'You are now marked as unavailable');
                                        } catch (error) {
                                            console.error('Error updating availability:', error);
                                            toast.error('Failed to update availability status');
                                        } finally {
                                            setAvailabilityLoading(false);
                                        }
                                    }}
                                    disabled={availabilityLoading}
                                />
                            </div>
                            <div className="border-t pt-4">
                                <AvailabilityList userId={userDetails?.id} />
                            </div>
                        </div>
                    </CollapsibleSection>
                    <CollapsibleSection
                        title="Featured Profile"
                        icon={<Star />} // Import Star from lucide-react
                        defaultOpen={false}
                    >
                        <FeaturedProfileList userId={userDetails?.id} />
                    </CollapsibleSection>

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