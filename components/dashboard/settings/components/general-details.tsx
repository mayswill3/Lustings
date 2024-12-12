/*eslint-disable*/
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';
import { getURL, getStatusRedirect } from '@/utils/helpers';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Toggle from '@/components/ui/toggle';
import { MapPin, User2, Lock, Settings2 } from 'lucide-react';

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

const supabase = createClient();

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
        <span className="min-w-[180px] text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex-1">{children}</div>
    </label>
);

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

        // Get all form data
        const formData = new FormData(e.currentTarget);

        // Extract details for `auth.users`
        const fullName = formData.get('fullName')?.toString().trim();
        const firstName = formData.get('firstName')?.toString().trim();
        const lastName = formData.get('lastName')?.toString().trim();
        const newEmail = formData.get('newEmail')?.toString().trim();
        const mobileNumber = formData.get('mobileNumber')?.toString().trim(); // Add this line
        const nationality = formData.get('nationality')?.toString().trim();

        // Get member type and services
        // Get member type
        const memberType = formData.get('memberType')?.toString().trim();

        // Extract services from state instead of relying on FormData
        const services =
            memberType === 'Offering Services' ? userDetails?.services || [] : [];

        // Extract details for `users` table
        const location = {
            country: formData.get('country')?.toString().trim(),
            region: formData.get('region')?.toString().trim(),
            county: formData.get('county')?.toString().trim(),
            town: formData.get('town')?.toString().trim(),
            postcode: formData.get('postcode')?.toString().trim(),
            nearest_station: formData.get('nearestStation')?.toString().trim(),
        };
        const privacy = {
            hideProfilePictures: formData.get('hideProfilePictures') === 'on',
        };
        const preferences = {
            allowSearch: formData.get('allowSearch') === 'on',
            interests: {
                escorts: {
                    inCalls: formData.get('escortsInCalls') === 'on',
                    outCalls: formData.get('escortsOutCalls') === 'on',
                },
                webcamDirectCam: formData.get('webcamDirectCam') === 'on',
                phoneChatDirectChat: formData.get('phoneChatDirectChat') === 'on',
                alternativePractices: {
                    dominant: formData.get('dominant') === 'on',
                    submissive: formData.get('submissive') === 'on',
                },
            },
        };

        try {
            // Update `auth.users` for fullName, email, firstName, and lastName
            if (fullName || newEmail || firstName || lastName) {
                const { error } = await supabase.auth.updateUser({
                    email: newEmail,
                    data: {
                        full_name: fullName,
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: mobileNumber, // Add this line
                        member_type: memberType,
                        nationality,
                    },
                });
                if (error) throw error;
            }

            // Update `users` table for fullName and other fields
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: fullName,
                    phone_number: mobileNumber, // Add this line
                    member_type: memberType,
                    services, // Update services correctly
                    nationality,
                    location,
                    privacy,
                    preferences,
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
    console.log(userDetails)
    return (
        <div className="max-w-4xl mx-auto">
            <form id="settingsForm" onSubmit={handleSubmit} className="space-y-8">
                {/* Account Details Section */}
                <Card className="p-6 shadow-sm">
                    <SectionHeader icon={<User2 size={24} />} title="Account Details" />

                    {/* Personal Information */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="First Name">
                                <Input
                                    type="text"
                                    name="firstName"
                                    defaultValue={props.user?.user_metadata?.first_name ?? ''}
                                    placeholder="Enter first name"
                                />
                            </FormField>
                            <FormField label="Last Name">
                                <Input
                                    type="text"
                                    name="lastName"
                                    defaultValue={props.user?.user_metadata?.last_name ?? ''}
                                    placeholder="Enter last name"
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Email">
                                <Input
                                    type="email"
                                    name="newEmail"
                                    defaultValue={props.user?.email ?? ''}
                                    placeholder="Enter email"
                                />
                            </FormField>
                            <FormField label="Mobile Number">
                                <Input
                                    type="tel"
                                    name="mobileNumber"
                                    defaultValue={props.user?.user_metadata?.phone_number ?? userDetails?.phone_number ?? ''}
                                    placeholder="Enter mobile number"
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
                                <div className="mt-4 grid grid-cols-2 gap-4">
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
                                    {['United Kingdom', 'United States', 'Canada'].map(nationality => (
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
                <Card className="p-6 shadow-sm">
                    <SectionHeader icon={<MapPin size={24} />} title="Location Details" />
                    <div className="grid gap-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField label="Country">
                                <Input
                                    type="text"
                                    name="country"
                                    defaultValue={userDetails?.location?.country ?? ''}
                                    placeholder="Enter country"
                                />
                            </FormField>
                            <FormField label="Region">
                                <Input
                                    type="text"
                                    name="region"
                                    defaultValue={userDetails?.location?.region ?? ''}
                                    placeholder="Enter region"
                                />
                            </FormField>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField label="County">
                                <Input
                                    type="text"
                                    name="county"
                                    defaultValue={userDetails?.location?.county ?? ''}
                                    placeholder="Enter county"
                                />
                            </FormField>
                            <FormField label="Town">
                                <Input
                                    type="text"
                                    name="town"
                                    defaultValue={userDetails?.location?.town ?? ''}
                                    placeholder="Enter town"
                                />
                            </FormField>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField label="Postcode">
                                <Input
                                    type="text"
                                    name="postcode"
                                    defaultValue={userDetails?.location?.postcode ?? ''}
                                    placeholder="Enter postcode"
                                />
                            </FormField>
                            <FormField label="Nearest Station">
                                <Input
                                    type="text"
                                    name="nearestStation"
                                    defaultValue={userDetails?.location?.nearest_station ?? ''}
                                    placeholder="Enter nearest station"
                                />
                            </FormField>
                        </div>
                    </div>
                </Card>

                {/* Privacy Settings Section */}
                <Card className="p-6 shadow-sm">
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
                </Card>

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

                <div className="sticky bottom-4 z-10 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Save All Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
