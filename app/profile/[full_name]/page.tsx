'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Card } from '@/components/ui/card';

import DashboardLayout from '@/components/layout';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ImageGallery from '@/components/ui/Image-gallery';

import { ProfileHeader } from '@/components/profile/profile-header';
import { AboutSection } from '@/components/profile/about-section';
import { RatesSection } from '@/components/profile/rates-section';
import { ProfileOverview } from '@/components/profile/profile-overview';
import { GallerySection } from '@/components/profile/gallery-section';
import { InterviewSection } from '@/components/profile/interview-section';
import { ProfileFeedbackSection } from '@/components/profile/profile-feedback';
import { UserDetails, ProfilePageProps } from '@/types/types';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import BookingForm from '@/components/profile/booking-section';

const supabase = createClient();
const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
]);

export default function ProfilePage({ params }: ProfilePageProps) {
    const { full_name } = params;
    const [fetchedUserDetails, setFetchedUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMobile, setShowMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const tabItems = [
        { value: 'profile', label: 'Profile' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'private', label: 'Private Gallery' },
        { value: 'interview', label: 'Interview' },
        { value: 'booking', label: 'Make a Booking' },
        { value: 'feedback', label: 'Feedback' }
    ];

    const renderTabContent = (value: string) => {
        switch (value) {
            case 'profile':
                return <ProfileOverview userDetails={fetchedUserDetails} />;
            case 'gallery':
                return <GallerySection images={fetchedUserDetails.free_gallery} />;
            case 'private':
                return <GallerySection images={fetchedUserDetails.private_gallery} isPrivate />;
            case 'interview':
                return <InterviewSection userDetails={fetchedUserDetails} />;
            case 'booking':
                return <BookingForm userDetails={fetchedUserDetails} user={user} />;
            case 'feedback':
                return <ProfileFeedbackSection userId={fetchedUserDetails.id} />;
            default:
                return null;
        }
    };

    const fetchUserDetailsAndAvailability = async () => {
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            // First get user details
            const userResponse = await supabase
                .from('users')
                .select('*')
                .eq('full_name', full_name)
                .single();

            if (userResponse.error) throw userResponse.error;

            // Then get availability using the user's ID
            const availabilityResponse = await supabase
                .from('availability_status')
                .select('*')
                .eq('user_id', userResponse.data.id)
                .eq('booking_date', today)
                .gte('status_end', now.toISOString());

            setFetchedUserDetails({
                ...userResponse.data,
                availability_status: availabilityResponse.data || []
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetailsAndAvailability();
        const interval = setInterval(fetchUserDetailsAndAvailability, 60000);
        return () => clearInterval(interval);
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
    console.log(fetchedUserDetails)
    return (

        <DashboardLayout user={user} userDetails={userDetails} title="Profile Page" description="View user details">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Card className="p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2">
                            <ImageGallery images={fetchedUserDetails.profile_pictures || []} />
                        </div>

                        <div className="w-full md:w-1/2">
                            <ProfileHeader
                                userDetails={fetchedUserDetails}
                                showMobile={showMobile}
                                setShowMobile={setShowMobile}
                                calculateAge={calculateAge}
                                availability={fetchedUserDetails?.availability_status}
                            />
                            <AboutSection
                                userDetails={fetchedUserDetails}
                                renderHTMLContent={renderHTMLContent}
                            />
                        </div>
                    </div>
                </Card>

                <RatesSection userDetails={fetchedUserDetails} />



                {/* Mobile Select */}
                <div className="space-y-6">
                    <div className="md:hidden">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                        >
                            {tabItems.map(tab => (
                                <option key={tab.value} value={tab.value}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>

                        {/* Mobile Content - Only shows on mobile */}
                        <div className="md:hidden mt-6">
                            {renderTabContent(activeTab)}
                        </div>
                    </div>
                    {/* Desktop Tabs */}
                    <div className="hidden md:block">
                        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-full mb-6">
                                {tabItems.map(tab => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Need to include TabsContent components for Tabs to work properly */}

                            {tabItems.map(tab => (
                                <TabsContent key={tab.value} value={tab.value}>
                                    {renderTabContent(tab.value)}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
