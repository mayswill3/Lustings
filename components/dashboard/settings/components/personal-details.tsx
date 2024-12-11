/*eslint-disable*/
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tiptap } from '@/components/Tiptap';
import { createClient } from '@/utils/supabase/client';
import * as Switch from '@radix-ui/react-switch';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Calendar, Users, Heart, Activity, ChevronDown } from 'lucide-react';


const supabase = createClient();

interface ToggleProps {
    name: string;
    checked: boolean;
    onCheckedChange: (state: boolean) => void;
    label: string;
}

const Toggle = ({ name, checked, onCheckedChange, label }: ToggleProps) => {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
            <span className="text-sm font-medium">{label}</span>
            <Switch.Root
                name={name}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                checked={checked}
                onCheckedChange={onCheckedChange}
            >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-lg" />
            </Switch.Root>
        </div>
    );
};

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5 text-blue-600 dark:text-blue-400"
            })}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

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

    const [transStatus, setTransStatus] = useState(false);
    const [activities, setActivities] = useState<string[]>([]);
    const [withPreferences, setWithPreferences] = useState<string[]>([]);
    const options = ['bi-curious', 'bi-sexual', 'gay', 'straight'];

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

                // Set initial states
                setTransStatus(userDetails.personal_details?.trans || false);
                setActivities(userDetails.personal_details?.activities || []);
                setWithPreferences(userDetails.personal_details?.with || []);
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
        const orientation = formData.get('orientation')?.toString().trim();

        const personalDetails = {
            dob,
            gender,
            trans: transStatus,
            orientation,
            activities,
            with: withPreferences
        };
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

    const toggleActivity = (activity: string) => {
        setActivities(prev =>
            prev.includes(activity)
                ? prev.filter(a => a !== activity)
                : [...prev, activity]
        );
    };

    const toggleWithPreference = (preference: string) => {
        setWithPreferences(prev =>
            prev.includes(preference)
                ? prev.filter(p => p !== preference)
                : [...prev, preference]
        );
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }


    if (!userDetails) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    const personalDetails = userDetails.personal_details || {};


    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <form id="settingsForm" onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Card */}
                <Card className="p-6">
                    <SectionHeader
                        icon={<Users />}
                        title="Basic Information"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date of Birth
                            </label>
                            <Input
                                type="date"
                                name="dob"
                                defaultValue={personalDetails.dob || ''}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Gender
                            </label>
                            <select
                                name="gender"
                                defaultValue={personalDetails.gender || ''}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <Toggle
                                name="trans"
                                label="Trans"
                                checked={transStatus}
                                onCheckedChange={setTransStatus}
                            />
                        </div>
                    </div>
                </Card>

                {/* Orientation Card */}
                <Card className="p-6">
                    <SectionHeader
                        icon={<Heart />}
                        title="Orientation"
                    />
                    <RadioGroup.Root
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        name="orientation"
                        defaultValue={personalDetails.orientation || ''}
                    >
                        {options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroup.Item
                                    value={option}
                                    id={`orientation-${option}`}
                                    className="w-4 h-4 rounded-full border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                                >
                                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
                                </RadioGroup.Item>
                                <label
                                    htmlFor={`orientation-${option}`}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                                >
                                    {option.replace('-', ' ')}
                                </label>
                            </div>
                        ))}
                    </RadioGroup.Root>
                </Card>

                {/* Activities Card */}
                <Card className="p-6">
                    <SectionHeader
                        icon={<Activity />}
                        title="Activities"
                        subtitle="Please select the activities you're interested in"
                    />
                    <div className="relative">
                        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
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
                                    <Toggle
                                        key={activity}
                                        name="activities"
                                        label={activity}
                                        checked={activities.includes(activity)}
                                        onCheckedChange={() => toggleActivity(activity)}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Scroll Fade Effect */}
                        <div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-white dark:from-zinc-800 to-transparent pointer-events-none" />
                    </div>
                </Card>

                {/* Preferences Card */}
                <Card className="p-6">
                    <SectionHeader
                        icon={<Users />}
                        title="Partner Preferences"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Men', 'Women', 'Couples MF', 'Couples MM', 'Couples FF', 'Moresomes'].map(
                            (preference) => (
                                <Toggle
                                    key={preference}
                                    name="with"
                                    label={preference}
                                    checked={withPreferences.includes(preference)}
                                    onCheckedChange={() => toggleWithPreference(preference)}
                                />
                            )
                        )}
                    </div>
                </Card>

                {/* Description Card */}
                <Card className="p-6">
                    <SectionHeader
                        icon={<ChevronDown />}
                        title="Additional Details"
                    />
                    <div className="mt-4">
                        <Tiptap
                            ref={tiptapRef}
                            initialSummary={userDetails?.summary || ''}
                            initialDetails={userDetails?.details || ''}
                        />
                    </div>
                </Card>

                {/* Submit Button */}
                <div className="sticky bottom-4 z-10">
                    <Card className="p-4 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
                        <Button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving Changes...' : 'Save All Changes'}
                        </Button>
                    </Card>
                </div>
            </form>
        </div>
    );
}