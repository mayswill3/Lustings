/*eslint-disable*/
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { DeleteProfileDialog } from '@/components/ui/delete-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';
import { getURL, getStatusRedirect } from '@/utils/helpers';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { FormField } from '@/components/ui/form-field';
import { toast } from 'sonner';
import Toggle from '@/components/ui/toggle';
import { MapPin, User2, Lock, Settings2, Clock } from 'lucide-react';
import { NATIONALITIES, isValidNationality } from '@/constants/nationalities';
import LocationDetailsSection from './general-details/location-details';

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

const supabase = createClient();

// Will add 'Webcam Work', 'Phone Chat', 'SMS Chat', 'Content Creator' in the future
const SERVICE_TYPES = ['Escort Services',];

export default function GeneralDetails(props: Props) {
    // Input States
    const [nameError, setNameError] = useState<{
        status: boolean;
        message: string;
    }>();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [fullNameInput, setFullNameInput] = useState('');
    const [fullNameError, setFullNameError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const checkFullNameAvailability = async (fullName: string, userId: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('full_name', fullName)
            .neq('id', userId) // Exclude current user
            .single();

        return !data; // Returns true if name is available
    };

    const validateFullName = async (name: string) => {
        if (!name) {
            setFullNameError('Display name is required');
            return;
        }

        if (name === userDetails?.full_name) {
            setFullNameError(null);
            return;
        }

        const isAvailable = await checkFullNameAvailability(name, props.user?.id!);
        if (!isAvailable) {
            setFullNameError('This display name is already taken');
        } else {
            setFullNameError(null);
        }
    };

    useEffect(() => {
        if (userDetails?.full_name) {
            setFullNameInput(userDetails.full_name);
        }
    }, [userDetails]);

    // Fetch User and User Details on Load
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Fetch the logged-in user
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error('Error fetching user:', userError);
                    return;
                }
                setUser(user);

                // Fetch user details from the `users` table
                const { data: userDetails, error: detailsError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (detailsError) {
                    console.error('Error fetching user details:', detailsError);
                    return;
                }

                setUserDetails(userDetails);
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userDetails?.member_type === 'Offering Services') {
            setShowServices(true);
        }
    }, [userDetails]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get all form data
            const formData = new FormData(e.currentTarget);
            const newFullName = formData.get('fullName')?.toString();

            // Check if full name is provided
            if (!newFullName) {
                toast.error('Display name is required');
                setIsSubmitting(false);
                return;
            }

            // Check if full name is available
            const isNameAvailable = await checkFullNameAvailability(newFullName, props.user?.id!);
            if (!isNameAvailable) {
                toast.error('This display name is already taken. Please choose another.');
                setIsSubmitting(false);
                return;
            }

            // First, fetch current user data to get existing preferences
            const { data: currentUser, error: fetchError } = await supabase
                .from('users')
                .select('preferences')
                .eq('id', props.user?.id)
                .single();

            if (fetchError) throw fetchError;

            // Prepare new preferences while preserving existing ones
            const newPreferences = {
                ...currentUser?.preferences, // Keep all existing preferences (including escorting)
                allowSearch: formData.get('allowSearch') === 'on',
                interests: {
                    ...currentUser?.preferences?.interests, // Keep existing interests
                    escorts: {
                        ...currentUser?.preferences?.interests?.escorts, // Keep existing escort settings
                        inCalls: formData.get('escortsInCalls') === 'on',
                        outCalls: formData.get('escortsOutCalls') === 'on',
                    },
                    webcamDirectCam: formData.get('webcamDirectCam') === 'on',
                    phoneChatDirectChat: formData.get('phoneChatDirectChat') === 'on',
                    alternativePractices: {
                        ...currentUser?.preferences?.interests?.alternativePractices,
                        dominant: formData.get('dominant') === 'on',
                        submissive: formData.get('submissive') === 'on',
                    },
                },
            };

            // Update auth.users
            if (formData.get('fullName') || formData.get('newEmail') || formData.get('firstName') || formData.get('lastName')) {
                const { error } = await supabase.auth.updateUser({
                    email: formData.get('newEmail')?.toString(),
                    data: {
                        full_name: formData.get('fullName')?.toString(),
                        first_name: formData.get('firstName')?.toString(),
                        last_name: formData.get('lastName')?.toString(),
                        phone_number: formData.get('mobileNumber')?.toString(),
                        member_type: formData.get('memberType')?.toString(),
                        nationality: formData.get('nationality')?.toString(),
                    },
                });
                if (error) throw error;
            }

            // Update users table
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: formData.get('fullName')?.toString(),
                    phone_number: formData.get('mobileNumber')?.toString(),
                    member_type: formData.get('memberType')?.toString(),
                    services: formData.get('memberType')?.toString() === 'Offering Services'
                        ? userDetails?.services || []
                        : [],
                    nationality: formData.get('nationality')?.toString(),
                    location: {
                        country: formData.get('country')?.toString(),
                        region: formData.get('region')?.toString(),
                        county: formData.get('county')?.toString(),
                        town: formData.get('town')?.toString(),
                        postcode: formData.get('postcode')?.toString(),
                        nearest_station: formData.get('nearestStation')?.toString(),
                    },
                    privacy: {
                        hideProfilePictures: formData.get('hideProfilePictures') === 'on',
                    },
                    preferences: newPreferences, // Use the merged preferences
                })
                .eq('id', props.user?.id);

            if (error) throw error;

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }

        setIsSubmitting(false);
    };

    if (!userDetails) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    const handleDeleteProfile = async () => {
        try {
            setIsDeleting(true);
            const { data, error } = await supabase
                .rpc('delete_user_profile', {
                    target_user_id: user?.id
                });

            if (error) throw error;

            if (data) {
                // Sign out the user
                await supabase.auth.signOut();

                toast.success('Profile deleted successfully');
                router.push('/');
            } else {
                toast.error('Profile not found or already deleted');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            toast.error('Failed to delete profile');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form id="settingsForm" onSubmit={handleSubmit} className="space-y-8">
                {/* Account Details Section */}
                <Card className="p-6 shadow-sm">
                    <SectionHeader icon={<User2 size={24} />} title="Account Details" />

                    {/* Personal Information */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Display Name">
                                <Input
                                    type="text"
                                    name="fullName"
                                    value={fullNameInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFullNameInput(value);
                                        // Debounce the validation to avoid too many database queries
                                        const timeoutId = setTimeout(() => validateFullName(value), 500);
                                        return () => clearTimeout(timeoutId);
                                    }}
                                    placeholder="Enter display name"
                                    className={`w-full h-9 sm:h-10 ${fullNameError ? 'border-red-500' : ''}`}
                                />
                                {fullNameError && (
                                    <span className="text-sm text-red-500 mt-1">
                                        {fullNameError}
                                    </span>
                                )}
                            </FormField>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="First Name">
                                <Input
                                    type="text"
                                    name="firstName"
                                    defaultValue={props.user?.user_metadata?.first_name ?? ''}
                                    placeholder="Enter first name"
                                    className="w-full h-9 sm:h-10"
                                />
                            </FormField>
                            <FormField label="Last Name">
                                <Input
                                    type="text"
                                    name="lastName"
                                    defaultValue={props.user?.user_metadata?.last_name ?? ''}
                                    placeholder="Enter last name"
                                    className="w-full h-9 sm:h-10"
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Email">
                                <Input
                                    type="email"
                                    name="newEmail"
                                    defaultValue={props.user?.email ?? ''}
                                    placeholder="Enter email"
                                    className="w-full h-9 sm:h-10"
                                />
                            </FormField>
                            <FormField label="Mobile Number">
                                <Input
                                    type="tel"
                                    name="mobileNumber"
                                    defaultValue={props.user?.user_metadata?.phone_number ?? userDetails?.phone_number ?? ''}
                                    placeholder="Enter mobile number"
                                    className="w-full h-9 sm:h-10"
                                />
                            </FormField>
                        </div>

                        {/* Member Type and Services */}
                        <div className="border-t pt-4 mt-4">
                            <FormField label="Account Type">
                                <select
                                    name="memberType"
                                    value={userDetails?.member_type || ''}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setUserDetails(prev => ({
                                            ...prev,
                                            member_type: value,
                                            // Reset preferences if not seeking services
                                            preferences: value === 'Seeking Services'
                                                ? prev?.preferences
                                                : {
                                                    allowSearch: false,
                                                    interests: {
                                                        escorts: {
                                                            inCalls: false,
                                                            outCalls: false,
                                                        },
                                                        webcamDirectCam: false,
                                                        phoneChatDirectChat: false,
                                                        alternativePractices: {
                                                            dominant: false,
                                                            submissive: false,
                                                        },
                                                    },
                                                }
                                        }));
                                        setShowServices(value === 'Offering Services');
                                    }}
                                >
                                    <option value="">Select Member Type</option>
                                    <option value="Offering Services">Offering Services</option>
                                    <option value="Seeking Services">Seeking Services</option>
                                </select>
                            </FormField>

                            {/* Services Selection */}
                            {showServices && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SERVICE_TYPES.map((service) => (
                                        <Toggle
                                            key={service}
                                            name={service}
                                            label={service}
                                            checked={userDetails?.services?.includes(service) || false}
                                            onCheckedChange={(checked) => {
                                                const newServices = checked
                                                    ? [...(userDetails?.services || []), service]
                                                    : (userDetails?.services || []).filter((s) => s !== service);
                                                setUserDetails(prev => ({
                                                    ...prev,
                                                    services: newServices,
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <FormField label="Nationality">
                                <select
                                    name="nationality"
                                    defaultValue={userDetails?.nationality ?? ''}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                                >
                                    <option value="">Select Nationality</option>
                                    {NATIONALITIES.map(nationality => (
                                        <option key={nationality} value={nationality}>
                                            {nationality}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </div>
                </Card>

                {/* Location Details Section */}
                <LocationDetailsSection userDetails={userDetails} />


                {/* Privacy Settings Section */}
                {/* <Card className="p-6 shadow-sm">
                    <SectionHeader icon={<Lock size={24} />} title="Privacy Settings" />
                    <div className="space-y-4">
                        <Toggle
                            name="hideProfilePictures"
                            checked={userDetails?.privacy?.hideProfilePictures ?? false}
                            onCheckedChange={(state) =>
                                setUserDetails((prev) => ({
                                    ...prev,
                                    privacy: { ...prev?.privacy, hideProfilePictures: state },
                                }))
                            }
                            label="Hide my profile pictures"
                        />
                    </div>
                </Card> */}

                {/* Profile Preferences Section */}
                {userDetails?.member_type === 'Seeking Services' && (
                    <Card className="p-6 shadow-sm">
                        <SectionHeader icon={<Settings2 size={24} />} title="Profile Preferences" />
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Toggle
                                    name="allowSearch"
                                    checked={userDetails?.preferences?.allowSearch ?? false}
                                    onCheckedChange={(state) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            preferences: { ...prev?.preferences, allowSearch: state },
                                        }))
                                    }
                                    label="Allow service providers to search for me and view my profile"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Escort Services</h3>
                                <div className="ml-4 space-y-3">
                                    <Toggle
                                        name="escortsInCalls"
                                        checked={userDetails?.preferences?.interests?.escorts?.inCalls ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: {
                                                        ...prev?.preferences?.interests,
                                                        escorts: { ...prev?.preferences?.interests?.escorts, inCalls: state },
                                                    },
                                                },
                                            }))
                                        }
                                        label="In-Calls"
                                    />
                                    <Toggle
                                        name="escortsOutCalls"
                                        checked={userDetails?.preferences?.interests?.escorts?.outCalls ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: {
                                                        ...prev?.preferences?.interests,
                                                        escorts: { ...prev?.preferences?.interests?.escorts, outCalls: state },
                                                    },
                                                },
                                            }))
                                        }
                                        label="Out-Calls"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Communication Services</h3>
                                <div className="ml-4 space-y-3">
                                    <Toggle
                                        name="webcamDirectCam"
                                        checked={userDetails?.preferences?.interests?.webcamDirectCam ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: { ...prev?.preferences?.interests, webcamDirectCam: state },
                                                },
                                            }))
                                        }
                                        label="Webcam & DirectCam"
                                    />
                                    <Toggle
                                        name="phoneChatDirectChat"
                                        checked={userDetails?.preferences?.interests?.phoneChatDirectChat ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: { ...prev?.preferences?.interests, phoneChatDirectChat: state },
                                                },
                                            }))
                                        }
                                        label="Phone Chat & DirectChat"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alternative Practices</h3>
                                <div className="ml-4 space-y-3">
                                    <Toggle
                                        name="dominant"
                                        checked={userDetails?.preferences?.interests?.alternativePractices?.dominant ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: {
                                                        ...prev?.preferences?.interests,
                                                        alternativePractices: {
                                                            ...prev?.preferences?.interests?.alternativePractices,
                                                            dominant: state,
                                                        },
                                                    },
                                                },
                                            }))
                                        }
                                        label="Dominant"
                                    />
                                    <Toggle
                                        name="submissive"
                                        checked={userDetails?.preferences?.interests?.alternativePractices?.submissive ?? false}
                                        onCheckedChange={(state) =>
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev?.preferences,
                                                    interests: {
                                                        ...prev?.preferences?.interests,
                                                        alternativePractices: {
                                                            ...prev?.preferences?.interests?.alternativePractices,
                                                            submissive: state,
                                                        },
                                                    },
                                                },
                                            }))
                                        }
                                        label="Submissive"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="p-6 shadow-sm">
                    <SectionHeader
                        icon={<Settings2 size={24} />}
                        title="Advanced Options"
                    />
                    <div className="space-y-4">
                        <div className="pt-2">
                            <details className="group">
                                <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                                    <span className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 transition-transform group-open:rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </span>
                                    Account Status
                                </summary>
                                <div className="mt-4 pl-7">
                                    <DeleteProfileDialog
                                        onConfirmDelete={handleDeleteProfile}
                                        isDeleting={isDeleting}
                                    />
                                </div>
                            </details>
                        </div>
                    </div>
                </Card>

                <div className="sticky bottom-4 z-10 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            onClick={async () => {
                                setIsSubmitting(true);
                                const form = document.getElementById('settingsForm') as HTMLFormElement;
                                if (form) {
                                    form.requestSubmit();
                                }
                                setTimeout(() => {
                                    setIsSubmitting(false);
                                    window.location.href = `/profile/${encodeURIComponent(userDetails?.full_name ?? '')}`;
                                }, 1000);
                            }}
                            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
                            disabled={isSubmitting}
                        >
                            Save and View Profile
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
