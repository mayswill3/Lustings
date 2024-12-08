'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout';

const supabase = createClient();

interface UserDetails {
    full_name: string;
    avatar_url: string | null;
    summary: string | null;
    profile_pictures: (string | null)[];
    personal_details: {
        dob?: string;
        gender?: string;
        activities?: string[];
    };
    preferences: {
        allowSearch?: boolean;
        interests?: {
            escorts?: {
                inCalls?: boolean;
                outCalls?: boolean;
            };
        };
    };
}

interface ProfilePageProps {
    params: {
        full_name: string;
    };
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function ProfilePage({ params, user, userDetails }: ProfilePageProps) {
    const { full_name } = params;
    const [fetchedUserDetails, setFetchedUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('full_name', full_name)
                .single();

            if (!error) {
                setFetchedUserDetails(data);
            }
            setLoading(false);
        };

        fetchUserDetails();
    }, [full_name]);

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (!fetchedUserDetails) {
        return <div className="container mx-auto p-4">User not found</div>;
    }

    return (
        <DashboardLayout
            user={user}
            userDetails={userDetails}
            title="Profile Page"
            description="View user details"
        >
            <div className="container mx-auto p-4">
                <div className="flex items-center mb-8">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={fetchedUserDetails?.avatar_url || fetchedUserDetails?.profile_pictures?.[0] || ''}
                        />
                        <AvatarFallback>
                            {fetchedUserDetails?.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">
                            {fetchedUserDetails?.full_name || 'Unknown User'}
                        </h1>
                        <p className="text-gray-600">
                            {fetchedUserDetails?.summary || 'No summary available'}
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold">Personal Details</h2>
                    <ul>
                        <li>
                            Date of Birth: {fetchedUserDetails?.personal_details?.dob || 'Not provided'}
                        </li>
                        <li>Gender: {fetchedUserDetails?.personal_details?.gender || 'Not provided'}</li>
                        <li>
                            Activities:{' '}
                            {fetchedUserDetails?.personal_details?.activities?.join(', ') || 'Not provided'}
                        </li>
                    </ul>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold">Preferences</h2>
                    <ul>
                        <li>
                            Allow Search: {fetchedUserDetails?.preferences?.allowSearch ? 'Yes' : 'No'}
                        </li>
                        <li>
                            Interests:
                            <ul>
                                <li>
                                    Escorts (In-Calls):{' '}
                                    {fetchedUserDetails?.preferences?.interests?.escorts?.inCalls
                                        ? 'Yes'
                                        : 'No'}
                                </li>
                                <li>
                                    Escorts (Out-Calls):{' '}
                                    {fetchedUserDetails?.preferences?.interests?.escorts?.outCalls
                                        ? 'Yes'
                                        : 'No'}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-bold">Gallery</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {fetchedUserDetails?.profile_pictures?.map((pic, index) =>
                            pic ? (
                                <img
                                    key={index}
                                    src={pic}
                                    alt={`Profile picture ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                            ) : (
                                <div
                                    key={index}
                                    className="w-32 h-32 bg-gray-200 flex items-center justify-center border rounded-md"
                                >
                                    No Image
                                </div>
                            )
                        ) || (
                                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center border rounded-md">
                                    No Images Available
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
