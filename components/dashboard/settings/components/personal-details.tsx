/*eslint-disable*/
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Toggle from '@/components/ui/toggle';
import { SectionHeader } from '@/components/ui/section-header';
import { Tiptap } from '@/components/Tiptap';
import { createClient } from '@/utils/supabase/client';
import * as Switch from '@radix-ui/react-switch';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Calendar, Users, Heart, Activity, ChevronDown } from 'lucide-react';
import { ACTIVITIES } from '@/constants/activities';
import GENDERS from '@/constants/gender';
import { User } from '@supabase/supabase-js';


const supabase = createClient();

interface PersonalDetailsProps {
    user: User;
    userDetails: {
        full_name?: string;
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
        [key: string]: any;
    };
}

export default function PersonalDetails({ user, userDetails }: PersonalDetailsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tiptapRef = useRef<{
        getSummary: () => string;
        getDetails: () => string;
    }>(null);

    const [activities, setActivities] = useState(userDetails?.personal_details?.activities || []);
    const [withPreferences, setWithPreferences] = useState(userDetails?.personal_details?.with || []);
    const [transStatus, setTransStatus] = useState(userDetails?.personal_details?.trans || false);
    const options = ['bi-curious', 'bi-sexual', 'gay', 'straight'];


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
                                {GENDERS.map((gender) => (
                                    <option key={gender} value={gender}>
                                        {gender}
                                    </option>
                                ))}

                            </select>
                        </div>
                        {/* <div className="md:col-span-2">
                            <Toggle
                                name="trans"
                                label="Trans"
                                checked={transStatus}
                                onCheckedChange={setTransStatus}
                            />
                        </div> */}
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
                                {ACTIVITIES.map((activity) => (
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
                <div className="sticky bottom-4 z-10 px-4 sm:px-0">
                    <Card className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end">
                            <Button
                                type="submit"
                                className="h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
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
                                        window.location.href = `/profile/${encodeURIComponent(userDetails?.full_name || '')}`;
                                    }, 1000);
                                }}
                                className="h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
                                disabled={isSubmitting}
                            >
                                Save and View Profile
                            </Button>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}