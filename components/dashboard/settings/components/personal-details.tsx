/*eslint-disable*/
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tiptap } from '@/components/Tiptap';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function PersonalDetails() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [userDetails, setUserDetails] = useState<{
        personal_details?: {
            dob?: string;
            gender?: string;
            trans?: boolean;
            orientation?: string;
            activities?: string[];
            with?: string[];
        };
        summary?: string;
        details?: string;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tiptapRef = useRef<{
        getSummary: () => string;
        getDetails: () => string;
    }>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) {
                    console.error('Error fetching user:', userError);
                    return;
                }

                setUser(user);

                // Fetch userDetails
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
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        // Extract form data
        const dob = formData.get('dob')?.toString().trim();
        const gender = formData.get('gender')?.toString().trim();
        const trans = formData.get('trans') === 'on';
        const orientation = formData.get('orientation')?.toString().trim();
        const activities = Array.from(formData.getAll('activities')) as string[];
        const withPreferences = Array.from(formData.getAll('with')) as string[];

        const personalDetails = { dob, gender, trans, orientation, activities, with: withPreferences };
        const summary = tiptapRef.current?.getSummary() || '';
        const details = tiptapRef.current?.getDetails() || '';

        try {
            const { error } = await supabase
                .from('users')
                .update({ personal_details: personalDetails, summary, details })
                .eq('id', user?.id);

            if (error) throw error;

            console.log('Personal details updated successfully');
        } catch (error) {
            console.error('Error updating personal details:', error);
        }

        setIsSubmitting(false);
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    const personalDetails = userDetails.personal_details || {};

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
                            defaultValue={personalDetails.dob || ''}
                        />
                    </label>

                    {/* Gender */}
                    <label className="flex flex-col">
                        Gender
                        <select
                            name="gender"
                            defaultValue={personalDetails.gender || ''}
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
                            defaultChecked={personalDetails.trans || false}
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
                        {['bi-curious', 'bi-sexual', 'gay', 'straight'].map((option) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    name="orientation"
                                    value={option}
                                    defaultChecked={personalDetails.orientation === option}
                                />
                                <span className="ml-2">{option.replace('-', ' ')}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-4">
                    I Enjoy the Following
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    This list of activities is user-generated and is neither factual nor a
                    commitment to offer any specific service.
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
                                    defaultChecked={personalDetails.activities?.includes(activity) || false}
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
                                        defaultChecked={personalDetails.with?.includes(preference) || false}
                                    />
                                    <span className="ml-2">{preference}</span>
                                </label>
                            )
                        )}
                    </div>
                </div>

                {/* Tiptap Component */}
                <Tiptap
                    ref={tiptapRef}
                    initialSummary={userDetails?.summary || ''}
                    initialDetails={userDetails?.details || ''}
                />

                <Button
                    type="submit"
                    className="w-full mt-4 flex justify-center rounded-lg px-4 py-2 text-base font-medium"
                >
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                </Button>
            </form>
        </div>
    );
}
