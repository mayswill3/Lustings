/*eslint-disable*/
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';
import { getURL, getStatusRedirect } from '@/utils/helpers';
import { Input } from '@/components/ui/input';
import { Tiptap } from '@/components/Tiptap';

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

const supabase = createClient();
export default function PersonalDetails(props: Props) {
    // Input States
    const [nameError, setNameError] = useState<{
        status: boolean;
        message: string;
    }>();
    console.log(props.user);
    console.log(props.userDetails);
    const router = useRouter();
    const [userMetadata, setUserMetadata] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tiptapRef = useRef<{
        getSummary: () => string;
        getDetails: () => string;
    }>(null);

    // Fetch user metadata on load
    useEffect(() => {
        const fetchUserData = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUserMetadata(user?.user_metadata || {});
            }
        };

        fetchUserData();
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Get all form data
        const formData = new FormData(e.currentTarget);

        // Extract Personal Details
        const dob = formData.get('dob')?.toString().trim();
        const gender = formData.get('gender')?.toString();
        const trans = formData.get('trans') === 'on';
        const orientation = formData.get('orientation')?.toString();
        const activities = Array.from(formData.getAll('activities')).map((activity) =>
            activity.toString()
        );
        const withPreferences = Array.from(formData.getAll('with')).map((preference) =>
            preference.toString()
        );
        // Get data from Tiptap
        const summary = tiptapRef.current?.getSummary() || '';
        const details = tiptapRef.current?.getDetails() || '';

        // Include Personal Details in Metadata
        const { error } = await supabase.auth.updateUser({
            data: {
                personalDetails: {
                    dob,
                    gender,
                    trans,
                    orientation,
                    activities,
                    with: withPreferences, // Add "With" preferences
                },
                summary,
                details,
                // ...other metadata updates
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
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                Personal Details
            </h2>
            <form id="settingsForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date of Birth */}
                    <label className="flex flex-col">
                        Date of Birth
                        <Input
                            type="text"
                            name="dob"
                            placeholder="dd/mm/yyyy"
                            defaultValue={props.user?.user_metadata?.personalDetails?.dob ?? ''}
                        />
                    </label>

                    {/* Gender */}
                    <label className="flex flex-col">
                        Gender
                        <select
                            name="gender"
                            defaultValue={props.user?.user_metadata?.personalDetails?.gender ?? ''}
                            className="border border-gray-300 rounded-lg px-4 py-2 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>

                    {/* Trans */}
                    <label className="flex items-center mt-4 md:mt-0">
                        <input
                            type="checkbox"
                            name="trans"
                            defaultChecked={props.user?.user_metadata?.personalDetails?.trans ?? false}
                        />
                        <span className="ml-2">Trans</span>
                    </label>
                </div>

                {/* Orientation */}
                <div className="mt-8">
                    <h3 className="text-lg font-extrabold text-zinc-950 dark:text-white mb-2">
                        Orientation
                    </h3>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="orientation"
                                value="bi-curious"
                                defaultChecked={
                                    props.user?.user_metadata?.personalDetails?.orientation === 'bi-curious'
                                }
                            />
                            <span className="ml-2">Bi-curious</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="orientation"
                                value="bi-sexual"
                                defaultChecked={
                                    props.user?.user_metadata?.personalDetails?.orientation === 'bi-sexual'
                                }
                            />
                            <span className="ml-2">Bi-sexual</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="orientation"
                                value="gay"
                                defaultChecked={
                                    props.user?.user_metadata?.personalDetails?.orientation === 'gay'
                                }
                            />
                            <span className="ml-2">Gay</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="orientation"
                                value="straight"
                                defaultChecked={
                                    props.user?.user_metadata?.personalDetails?.orientation === 'straight'
                                }
                            />
                            <span className="ml-2">Straight</span>
                        </label>
                    </div>
                </div>
                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                    I Enjoy the Following
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    This list of activities is user-generated and is neither factual nor a
                    commitment to offer any specific service.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Note: There are rules regarding the use of words and depictions of activities marked with an asterisk.{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 underline">
                        Click here for an overview
                    </a>.
                </p>
                <div
                    className="max-h-96 overflow-y-scroll border border-gray-300 rounded-lg p-4 dark:bg-zinc-800 dark:border-zinc-700"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            '"A" Levels',
                            '"A" Levels (at discretion)',
                            '15 Mins "quickie"',
                            'Anal Play',
                            'Bareback*',
                            'BDSM*',
                            'BDSM (giving)*',
                            'BDSM (receiving)*',
                            'Being Filmed',
                            'Bukkake',
                            'Car Meets',
                            'CIM',
                            'CIM (at discretion)',
                            'Cross Dressing',
                            'Deep Throat',
                            'Depilation',
                            'Dinner Dates',
                            'Disabled Clients',
                            'Dogging',
                            'Domination*',
                            'Domination (giving)*',
                            'Domination (receiving)*',
                            'Double Penetration',
                            'Enema',
                            'Exhibitionism',
                            'Face Sitting',
                            'Facials',
                            'Female Ejaculation',
                            'Fetish',
                            'FFM 3Somes',
                            'Fingering/Finger Play',
                            'Food Sex/Sploshing',
                            'Foot Worship',
                            'French Kissing',
                            'French Kissing (discretion)',
                            'Gang Bangs',
                            'Hand Relief',
                            'Humiliation',
                            'Humiliation (giving)',
                            'Humiliation (receiving)',
                            'Lapdancing',
                            'Massage',
                            'Milking/Lactating',
                            'MMF 3Somes',
                            'Modeling',
                            'Moresomes',
                            'Naturism/Nudism',
                            'Oral',
                            'Oral without (at discretion)',
                            'Oral without Protection',
                            'Parties',
                            'Penetration (Protected)',
                            'Pole Dancing',
                            'Pregnant',
                            'Prostate Massage',
                            'Pussy Pumping',
                            'Receiving Oral',
                            'Rimming',
                            'Rimming (giving)',
                            'Rimming (receiving)',
                            'Role Play & Fantasy*',
                            'Sauna / Bath Houses',
                            'Silent Caller (Phone Chat)',
                            'Smoking (Fetish)',
                            'Snowballing',
                            'Spanking*',
                            'Spanking (giving)*',
                            'Spanking (receiving)*',
                            'Strap On',
                            'Striptease',
                            'Sub games*',
                            'Swallow',
                            'Swallow (at discretion)',
                            'Swinging',
                            'Sybian & Machine Sex',
                            'Tantric',
                            'Tie & Tease*',
                            'Toys',
                            'Travel Companion',
                            'Uniforms',
                            'Unprotected Sex*',
                            'Voyeurism',
                            'Watersports*',
                        ].map((activity) => (
                            <label key={activity} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="activities"
                                    value={activity}
                                    defaultChecked={
                                        props.user?.user_metadata?.personalDetails?.activities?.includes(activity) ?? false
                                    }
                                />
                                <span className="ml-2">{activity}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* With */}
                <div className="mt-8">
                    <h3 className="text-lg font-extrabold text-zinc-950 dark:text-white mb-2">
                        With
                    </h3>
                    <div className="flex flex-col gap-2">
                        {['Men', 'Women', 'Couples MF', 'Couples MM', 'Couples FF', 'Moresomes'].map(
                            (preference) => (
                                <label key={preference} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="with"
                                        value={preference}
                                        defaultChecked={
                                            props.user?.user_metadata?.personalDetails?.with?.includes(preference) ?? false
                                        }
                                    />
                                    <span className="ml-2">{preference}</span>
                                </label>
                            )
                        )}
                    </div>
                </div>
                <Tiptap ref={tiptapRef} initialSummary={userMetadata?.summary || ''}
                    initialDetails={userMetadata?.details || ''} />
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
