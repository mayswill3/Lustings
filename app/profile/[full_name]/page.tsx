'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, User2, Activity, Heart, Image as ImageIcon, Lock, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import classNames from 'classnames';
import ImageGallery from '@/components/ui/Image-gallery';
import GalleryGrid from '@/components/ui/gallery-grid';

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

const ProfileSection = ({ title, icon: Icon, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Icon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {children}
    </div>
);



const LocationDetail = ({ label, value }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {label}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {value?.toString() || 'Not Provided'}
        </span>
    </div>
);


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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!fetchedUserDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">User not found</p>
            </div>
        );
    }
    const renderHTMLContent = (content: string) => {
        return (
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="text-sm text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
            />
        );
    };

    // Helper functions for date calculations
    const calculateAge = (dob: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatMemberSince = (createdAt: string) => {
        if (!createdAt) return null;
        const date = new Date(createdAt);
        return date.toLocaleDateString('en-GB'); // formats as DD/MM/YYYY
    };

    return (
        <DashboardLayout user={user} userDetails={userDetails} title="Profile Page" description="View user details">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Card className="p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Pictures Section */}
                        <div className="w-full md:w-1/2">
                            <ImageGallery
                                images={fetchedUserDetails.profile_pictures || []}
                            />
                        </div>

                        {/* Profile Info Section */}
                        <div className="w-full md:w-1/2">
                            {/* Basic Info */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {fetchedUserDetails.full_name}
                                </h1>
                                {/* <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {fetchedUserDetails.personal_details?.dob || 'Age not provided'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User2 className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {fetchedUserDetails.personal_details?.gender || 'Gender not provided'}
                                        </span>
                                    </div>
                                </div> */}
                            </div>

                            {/* About Me Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <User2 className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
                                </div>
                                <div className="space-y-6">
                                    {/* Basic Details */}
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        {[
                                            { label: "Ethnicity", value: fetchedUserDetails.about_you?.ethnicity },
                                            { label: "Height", value: fetchedUserDetails.about_you?.height },
                                            { label: "Dress Size", value: fetchedUserDetails.about_you?.dress_size },
                                            { label: "Chest Size", value: `${fetchedUserDetails.about_you?.chest} ${fetchedUserDetails.about_you?.bra_cup_size} ${fetchedUserDetails.about_you?.breast_type}` },
                                            { label: "Hair", value: `${fetchedUserDetails.about_you?.hair_color} ${fetchedUserDetails.about_you?.hair_length}` },
                                            { label: "Eye Colour", value: fetchedUserDetails.about_you?.eye_color },
                                            { label: "Pubic Hair", value: fetchedUserDetails.about_you?.pubic_hair },
                                        ].map((detail, index) => (
                                            detail.value && (
                                                <div key={index} className="flex items-start">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px]">
                                                        {detail.label}:
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200 ml-2">
                                                        {detail.value}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>

                                    {/* Summary and Details */}
                                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {fetchedUserDetails.summary || 'No summary available'}
                                        </div>
                                        {fetchedUserDetails.details ?
                                            renderHTMLContent(fetchedUserDetails.details)
                                            :
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                No additional details provided
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                        <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">
                            Gallery
                        </TabsTrigger>
                        <TabsTrigger value="private" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">
                            Private Gallery
                        </TabsTrigger>
                        <TabsTrigger value="interview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">
                            Interview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        {/* Member Details Card */}
                        <Card className="p-6">
                            <ProfileSection title="Member Details" icon={User2}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LocationDetail
                                        label="Gender"
                                        value={fetchedUserDetails.personal_details?.gender}
                                    />
                                    <LocationDetail
                                        label="Age"
                                        value={calculateAge(fetchedUserDetails.personal_details?.dob)}
                                    />
                                    <LocationDetail
                                        label="Orientation"
                                        value={fetchedUserDetails.personal_details?.orientation}
                                    />
                                    <LocationDetail
                                        label="Nationality"
                                        value="British"
                                    />
                                    <LocationDetail
                                        label="Member Since"
                                        value={formatMemberSince(fetchedUserDetails.created_at)}
                                    />
                                    <LocationDetail
                                        label="Last Login"
                                        value="Today"
                                    />
                                </div>
                            </ProfileSection>
                        </Card>

                        {/* Location Card */}
                        <Card className="p-6">
                            <ProfileSection title="Location" icon={MapPin}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LocationDetail label="Town" value="Crawley" />
                                    <LocationDetail label="County" value="West Sussex" />
                                    <LocationDetail label="Region" value="South East" />
                                    <LocationDetail label="Country" value="United Kingdom" />
                                </div>
                            </ProfileSection>
                        </Card>

                        {/* Activities Card - keeping this if still needed */}
                        {fetchedUserDetails.personal_details?.activities && fetchedUserDetails.personal_details.activities.length > 0 && (
                            <Card className="p-6">
                                <ProfileSection title="Activities" icon={Activity}>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {fetchedUserDetails.personal_details.activities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                {activity}
                                            </div>
                                        ))}
                                    </div>
                                </ProfileSection>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="gallery">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <ImageIcon className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Public Gallery</h2>
                            </div>
                            <GalleryGrid
                                images={fetchedUserDetails.free_gallery || []}
                            />
                        </Card>
                    </TabsContent>

                    <TabsContent value="private">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <Lock className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Private Gallery</h2>
                            </div>
                            {fetchedUserDetails.private_gallery && fetchedUserDetails.private_gallery.length > 0 ? (
                                <GalleryGrid
                                    images={fetchedUserDetails.private_gallery}
                                />
                            ) : (
                                <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <Lock className="w-12 h-12 mb-4" />
                                    <p className="text-lg font-medium">Private Gallery</p>
                                    <p className="text-sm">Contact to view private content</p>
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="interview">
                        <Card className="p-6">
                            <div className="space-y-8">
                                {/* Physical Measurements */}
                                <ProfileSection title="Physical Measurements" icon={User2}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { label: "Height", value: fetchedUserDetails.about_you?.height },
                                            { label: "Weight", value: fetchedUserDetails.about_you?.weight },
                                            { label: "Chest", value: fetchedUserDetails.about_you?.chest },
                                            { label: "Waist", value: fetchedUserDetails.about_you?.waist },
                                            { label: "Hips", value: fetchedUserDetails.about_you?.hips },
                                            { label: "Leg Measurement", value: fetchedUserDetails.about_you?.leg_measurement },
                                            { label: "Shoe Size", value: fetchedUserDetails.about_you?.shoe_size },
                                            { label: "Dress Size", value: fetchedUserDetails.about_you?.dress_size },
                                            { label: "Bra Cup Size", value: fetchedUserDetails.about_you?.bra_cup_size }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>

                                {/* Physical Characteristics */}
                                <ProfileSection title="Physical Characteristics" icon={User2}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Body Type", value: fetchedUserDetails.about_you?.body_type },
                                            { label: "Self Body Type", value: fetchedUserDetails.about_you?.self_body_type },
                                            { label: "Ethnicity", value: fetchedUserDetails.about_you?.ethnicity },
                                            { label: "Self Ethnicity", value: fetchedUserDetails.about_you?.self_ethnicity },
                                            { label: "Hair Color", value: fetchedUserDetails.about_you?.hair_color },
                                            { label: "Self Hair Color", value: fetchedUserDetails.about_you?.self_hair_color },
                                            { label: "Hair Length", value: fetchedUserDetails.about_you?.hair_length },
                                            { label: "Eye Color", value: fetchedUserDetails.about_you?.eye_color },
                                            { label: "Breast Size", value: fetchedUserDetails.about_you?.breast_size },
                                            { label: "Self Chest Size", value: fetchedUserDetails.about_you?.self_chest_size },
                                            { label: "Breast Type", value: fetchedUserDetails.about_you?.breast_type },
                                            { label: "Pubic Hair", value: fetchedUserDetails.about_you?.pubic_hair },
                                            { label: "Self Pubic Hair", value: fetchedUserDetails.about_you?.self_pubic_hair }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>

                                {/* Personal Details */}
                                <ProfileSection title="Personal Details" icon={Heart}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Star Sign", value: fetchedUserDetails.about_you?.star_sign },
                                            { label: "Age Group", value: fetchedUserDetails.about_you?.age_group },
                                            { label: "Primary Language", value: fetchedUserDetails.about_you?.primary_language },
                                            { label: "Secondary Language", value: fetchedUserDetails.about_you?.secondary_language },
                                            { label: "Non Binary Gender", value: fetchedUserDetails.about_you?.non_binary_gender },
                                            { label: "Smoking", value: fetchedUserDetails.about_you?.smoking },
                                            { label: "Body Art", value: fetchedUserDetails.about_you?.body_art },
                                            { label: "Body Art Visibility", value: fetchedUserDetails.about_you?.body_art_visibility },
                                            { label: "Birth Marks/Scars", value: fetchedUserDetails.about_you?.birth_marks_scars }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>

                                {/* Personality & Preferences */}
                                <ProfileSection title="Personality & Preferences" icon={User2}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Personality Trait", value: fetchedUserDetails.about_you?.personality_trait },
                                            { label: "Personality Words", value: fetchedUserDetails.about_you?.personality_words },
                                            { label: "Humor Type", value: fetchedUserDetails.about_you?.humor_type },
                                            { label: "Energy Level", value: fetchedUserDetails.about_you?.energy_level },
                                            { label: "Sexual Leaning", value: fetchedUserDetails.about_you?.sexual_leaning },
                                            { label: "Priority", value: fetchedUserDetails.about_you?.priority },
                                            { label: "Preferred Time", value: fetchedUserDetails.about_you?.preferred_time },
                                            { label: "Attraction Preference", value: fetchedUserDetails.about_you?.attraction_preference }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>

                                {/* Intimate Details */}
                                <ProfileSection title="Intimate Details" icon={Heart}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Turn Ons", value: fetchedUserDetails.about_you?.turn_ons },
                                            { label: "Fantasy", value: fetchedUserDetails.about_you?.fantasy },
                                            { label: "Sensitive Spots", value: fetchedUserDetails.about_you?.sensitive_spots },
                                            { label: "Ideal Location", value: fetchedUserDetails.about_you?.ideal_location },
                                            { label: "Ideal Location Intimate", value: fetchedUserDetails.about_you?.ideal_location_intimate },
                                            { label: "Favourite Position", value: fetchedUserDetails.about_you?.favourite_position },
                                            { label: "Second Favourite Position", value: fetchedUserDetails.about_you?.second_favourite_position },
                                            { label: "Peak Libido", value: fetchedUserDetails.about_you?.peak_libido },
                                            { label: "Masturbation Frequency", value: fetchedUserDetails.about_you?.masturbation_frequency },
                                            { label: "Memorable Experience", value: fetchedUserDetails.about_you?.memorable_experience },
                                            { label: "Perfect Evening", value: fetchedUserDetails.about_you?.perfect_evening }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>

                                {/* Favorites */}
                                <ProfileSection title="Favorites" icon={Heart}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Food", value: fetchedUserDetails.about_you?.favourite_food },
                                            { label: "Drink", value: fetchedUserDetails.about_you?.favourite_drink },
                                            { label: "Film", value: fetchedUserDetails.about_you?.favourite_film },
                                            { label: "TV Show", value: fetchedUserDetails.about_you?.favourite_tv },
                                            { label: "Celebrity", value: fetchedUserDetails.about_you?.favourite_celebrity },
                                            { label: "Colour", value: fetchedUserDetails.about_you?.favourite_colour },
                                            { label: "Holiday", value: fetchedUserDetails.about_you?.favourite_holiday },
                                            { label: "Flowers", value: fetchedUserDetails.about_you?.favourite_flowers },
                                            { label: "Perfume", value: fetchedUserDetails.about_you?.favourite_perfume },
                                            { label: "Gift", value: fetchedUserDetails.about_you?.favourite_gift }
                                        ].map((item, index) => (
                                            item.value && (
                                                <div key={index} className="grid grid-cols-2 gap-x-4">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </ProfileSection>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
