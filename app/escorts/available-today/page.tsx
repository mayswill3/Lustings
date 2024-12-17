'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { EscortCard } from '@/components/escort-card/EscortCard';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function AvailableEscorts(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [loading, setLoading] = useState(true);

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    useEffect(() => {
        const fetchAvailableEscorts = async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split('T')[0];

                // Get available escorts
                const { data: availableIds, error: availError } = await supabase
                    .from('availability_status')
                    .select('user_id')
                    .eq('booking_date', today)
                    .gte('status_end', now.toISOString());

                if (availError) throw availError;

                if (!availableIds?.length) {
                    setEscorts([]);
                    return;
                }

                // Get featured profiles
                const { data: featuredIds, error: featuredError } = await supabase
                    .from('featured_profiles')
                    .select('user_id')
                    .eq('feature_date', today)
                    .gte('feature_end', now.toISOString());

                if (featuredError) throw featuredError;

                const featuredUserIds = new Set(featuredIds?.map(f => f.user_id) || []);

                // Get users' details
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('member_type', 'Offering Services')
                    .in('id', availableIds.map(a => a.user_id));

                if (error) throw error;

                const escortsWithFeatured = data?.map(escort => ({
                    ...escort,
                    isFeatured: featuredUserIds.has(escort.id)
                })) || [];

                // Sort featured escorts to the top
                const sortedEscorts = escortsWithFeatured.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return 0;
                });

                setEscorts(sortedEscorts);
            } catch (error) {
                console.error('Error fetching available escorts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableEscorts();
        const interval = setInterval(fetchAvailableEscorts, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <DashboardLayout
            user={props.user}
            userDetails={props.userDetails}
            title="Available Now"
            description="Escorts available today"
        >
            <div className="container mx-auto px-4 py-8">
                {escorts.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Escorts Currently Available
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check back later to see who becomes available
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Available Today
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Showing {escorts.length} available escort{escorts.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {escorts.map((escort) => (
                                <EscortCard
                                    key={escort.id}
                                    escort={escort}
                                    isAvailable={true}
                                    isFeatured={escort.isFeatured}
                                    calculateAge={calculateAge}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}