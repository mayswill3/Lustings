'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import * as Switch from '@radix-ui/react-switch';
import { MapPin, Clock, Settings, ArrowRight, Calendar } from 'lucide-react';

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

const Separator = () => (
    <div className="h-px bg-gray-200 dark:bg-gray-700 my-6" />
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

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h2>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
);

// Main Component
export default function EscortingOptions(props: Props) {
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
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Service Options</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Location Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Location Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <Separator />

                        {/* Rates Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Rate Configuration
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-2 py-1 text-sm font-medium">Duration</th>
                                            {timeSlots.map(({ id, label }) => (
                                                <th key={id} className="px-2 py-1 text-sm font-medium">{label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-2 py-1 text-sm">In-call</td>
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
                                            <td className="px-2 py-1 text-sm">Out-call</td>
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
                        </div>

                        <Separator />

                        {/* Currency and Reports */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* <Separator /> */}

                        {/* Platform Settings */}
                        {/* <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Platform Settings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button variant="outline" className="justify-between">
                                Setup Featuring <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-between">
                                Local Search Options <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-between">
                                Availability Settings <Calendar className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="justify-between">
                                Tour Management <MapPin className="w-4 h-4" />
                            </Button>
                        </div>
                    </div> */}
                    </CardContent>

                    <CardFooter className="flex justify-end space-x-4 pt-6">
                        <Button variant="outline" type="button">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}