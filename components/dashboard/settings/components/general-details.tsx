/*eslint-disable*/
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';
import { getURL, getStatusRedirect } from '@/utils/helpers';
import { Input } from '@/components/ui/input';

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

const supabase = createClient();
export default function GeneralDetails(props: Props) {
    // Input States
    const [nameError, setNameError] = useState<{
        status: boolean;
        message: string;
    }>();
    console.log(props.user);
    console.log(props.userDetails);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Get all form data
        const formData = new FormData(e.currentTarget);

        // Extract details from the form
        const fullName = formData.get('fullName')?.toString().trim();
        const firstName = formData.get('firstName')?.toString().trim();
        const lastName = formData.get('lastName')?.toString().trim();
        const newEmail = formData.get('newEmail')?.toString().trim();
        const country = formData.get('country')?.toString().trim();
        const region = formData.get('region')?.toString().trim();
        const county = formData.get('county')?.toString().trim();
        const town = formData.get('town')?.toString().trim();
        const postcode = formData.get('postcode')?.toString().trim();
        const nearestStation = formData.get('nearestStation')?.toString().trim();
        const hideProfilePictures = formData.get('hideProfilePictures') === 'on';
        const allowSearch = formData.get('allowSearch') === 'on';
        const escortsInCalls = formData.get('escortsInCalls') === 'on';
        const escortsOutCalls = formData.get('escortsOutCalls') === 'on';
        const webcamDirectCam = formData.get('webcamDirectCam') === 'on';
        const phoneChatDirectChat = formData.get('phoneChatDirectChat') === 'on';
        const dominant = formData.get('dominant') === 'on';
        const submissive = formData.get('submissive') === 'on';

        // Combine all data to update user metadata
        const { error } = await supabase.auth.updateUser({
            email: newEmail,
            data: {
                full_name: fullName,
                first_name: firstName,
                last_name: lastName,
                location: {
                    country,
                    region,
                    county,
                    town,
                    postcode,
                    nearest_station: nearestStation,
                },
                privacy: {
                    hideProfilePictures,
                },
                preferences: {
                    allowSearch,
                    interests: {
                        escorts: {
                            inCalls: escortsInCalls,
                            outCalls: escortsOutCalls,
                        },
                        webcamDirectCam,
                        phoneChatDirectChat,
                        alternativePractices: {
                            dominant,
                            submissive,
                        },
                    },
                },
            },
        });

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            console.log('Profile updated successfully');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="relative mx-auto max-w-screen-lg flex flex-col lg:pt-[100px] lg:pb-[100px]">
            <div className="flex items-center mb-8">
                <Avatar className="min-h-[68px] min-w-[68px]">
                    <AvatarImage src={props.user?.user_metadata.avatar_url} />
                    <AvatarFallback className="text-2xl font-bold dark:text-zinc-950">
                        {props.user.user_metadata.full_name
                            ? `${props.user.user_metadata.full_name[0]}`
                            : `${props.user?.user_metadata.email[0].toUpperCase()}`}
                    </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                    <p className="text-2xl font-extrabold text-zinc-950 dark:text-white">
                        {props.user.user_metadata.full_name}
                    </p>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        CEO and Founder
                    </p>
                </div>
            </div>

            <form id="settingsForm" onSubmit={handleSubmit}>
                {/* Account Details */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                        Account Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            Full Name
                            <Input
                                type="text"
                                name="fullName"
                                defaultValue={props.user?.user_metadata?.full_name ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            First Name
                            <Input
                                type="text"
                                name="firstName"
                                defaultValue={props.user?.user_metadata?.first_name ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Last Name
                            <Input
                                type="text"
                                name="lastName"
                                defaultValue={props.user?.user_metadata?.last_name ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Email
                            <Input
                                type="email"
                                name="newEmail"
                                defaultValue={props.user?.email ?? ''}
                            />
                        </label>
                    </div>
                </div>

                {/* Location Details */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                        Location Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            Country
                            <Input
                                type="text"
                                name="country"
                                defaultValue={props.user?.user_metadata?.location?.country ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Region
                            <Input
                                type="text"
                                name="region"
                                defaultValue={props.user?.user_metadata?.location?.region ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            County
                            <Input
                                type="text"
                                name="county"
                                defaultValue={props.user?.user_metadata?.location?.county ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Town
                            <Input
                                type="text"
                                name="town"
                                defaultValue={props.user?.user_metadata?.location?.town ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Postcode
                            <Input
                                type="text"
                                name="postcode"
                                defaultValue={props.user?.user_metadata?.location?.postcode ?? ''}
                            />
                        </label>
                        <label className="flex flex-col">
                            Nearest Rail/Tube Station
                            <Input
                                type="text"
                                name="nearestStation"
                                defaultValue={
                                    props.user?.user_metadata?.location?.nearest_station ?? ''
                                }
                            />
                        </label>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                        Privacy Settings
                    </h2>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="hideProfilePictures"
                            defaultChecked={
                                props.user?.user_metadata?.privacy?.hideProfilePictures ?? false
                            }
                        />
                        <span className="ml-2">Hide my profile pictures</span>
                    </label>
                </div>

                {/* Profile Preferences */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                        Profile Preferences
                    </h2>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="allowSearch"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.allowSearch ?? false
                            }
                        />
                        <span className="ml-2">Allow service providers to search for me and view my profile</span>
                    </label>
                    <p className="font-semibold mt-4">I am interested in Escorts:</p>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="escortsInCalls"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.escorts?.inCalls ?? false
                            }
                        />
                        <span className="ml-2">In-Calls</span>
                    </label>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="escortsOutCalls"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.escorts?.outCalls ?? false
                            }
                        />
                        <span className="ml-2">Out-Calls</span>
                    </label>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="webcamDirectCam"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.webcamDirectCam ?? false
                            }
                        />
                        <span className="ml-2">I am interested in Webcam & DirectCam</span>
                    </label>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="phoneChatDirectChat"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.phoneChatDirectChat ?? false
                            }
                        />
                        <span className="ml-2">I am interested in Phone Chat & DirectChat</span>
                    </label>
                    <p className="font-semibold mt-4">I am interested in Alternative Practices:</p>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="dominant"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.alternativePractices?.dominant ?? false
                            }
                        />
                        <span className="ml-2">Dominant</span>
                    </label>
                    <label className="flex items-center my-2">
                        <input
                            type="checkbox"
                            name="submissive"
                            defaultChecked={
                                props.user?.user_metadata?.preferences?.interests?.alternativePractices?.submissive ?? false
                            }
                        />
                        <span className="ml-2">Submissive</span>
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 flex justify-center rounded-lg px-4 py-2 text-base font-medium"
                >
                    Save All Changes
                </Button>
            </form>
        </div>
    );
}