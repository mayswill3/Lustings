'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, User2, Activity, Heart, Image as ImageIcon, Lock, MessageSquare, Clock, Phone } from 'lucide-react';
import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import classNames from 'classnames';
import ImageGallery from '@/components/ui/Image-gallery';
import GalleryGrid from '@/components/ui/gallery-grid';
import { ProfileHeader } from '@/components/profile/profile-header';
import { AboutSection } from '@/components/profile/about-section';
import { RatesSection } from '@/components/profile/rates-section';
import { ProfileOverview } from '@/components/profile/profile-overview';
import { GallerySection } from '@/components/profile/gallery-section';
import { InterviewSection } from '@/components/profile/interview-section';
import { UserDetails, ProfilePageProps } from '@/types/types';

const supabase = createClient();

export default function ProfilePage({ params, user, userDetails }: ProfilePageProps) {
    const { full_name } = params;
    const [fetchedUserDetails, setFetchedUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMobile, setShowMobile] = useState(false);

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
                        <div className="w-full md:w-1/2">
                            <ImageGallery images={fetchedUserDetails.profile_pictures || []} />
                        </div>

                        <div className="w-full md:w-1/2">
                            <ProfileHeader
                                userDetails={fetchedUserDetails}
                                showMobile={showMobile}
                                setShowMobile={setShowMobile}
                                calculateAge={calculateAge}
                            />
                            <AboutSection
                                userDetails={fetchedUserDetails}
                                renderHTMLContent={renderHTMLContent}
                            />
                        </div>
                    </div>
                </Card>

                <RatesSection userDetails={fetchedUserDetails} />

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

                    <TabsContent value="profile">
                        <ProfileOverview userDetails={fetchedUserDetails} />
                    </TabsContent>

                    <TabsContent value="gallery">
                        <GallerySection images={fetchedUserDetails.free_gallery} />
                    </TabsContent>

                    <TabsContent value="private">
                        <GallerySection
                            images={fetchedUserDetails.private_gallery}
                            isPrivate
                        />
                    </TabsContent>

                    <TabsContent value="interview">
                        <InterviewSection userDetails={fetchedUserDetails} />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
