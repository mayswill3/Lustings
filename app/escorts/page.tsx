'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { EscortCard } from '@/components/escort-card/EscortCard';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function EscortGrid(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
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
        async function fetchEscortsAndAvailability() {
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

                // Get featured escorts
                const { data: featuredIds, error: featuredError } = await supabase
                    .from('featured_profiles')
                    .select('user_id')
                    .eq('feature_date', today)
                    .gte('feature_end', now.toISOString());

                if (featuredError) throw featuredError;

                const availableIdSet = new Set(availableIds?.map(a => a.user_id) || []);
                const featuredIdSet = new Set(featuredIds?.map(f => f.user_id) || []);

                // Fetch all escorts
                const { data: escortData, error: escortError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('member_type', 'Offering Services');

                if (escortError) throw escortError;

                // Sort escorts to show featured first
                const sortedEscorts = (escortData || []).sort((a, b) => {
                    if (featuredIdSet.has(a.id) && !featuredIdSet.has(b.id)) return -1;
                    if (!featuredIdSet.has(a.id) && featuredIdSet.has(b.id)) return 1;
                    return 0;
                });

                setEscorts(sortedEscorts);
                setAvailableEscorts(availableIdSet);
                setFeaturedEscorts(featuredIdSet);
            } catch (error) {
                console.error('Error fetching escorts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEscortsAndAvailability();

        // Refresh status every minute
        const interval = setInterval(fetchEscortsAndAvailability, 60000);
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
            title="All Escorts"
            description="Browse all available escorts"
        >
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {escorts.map((escort) => (
                        <EscortCard
                            key={escort.id}
                            escort={escort}
                            isAvailable={availableEscorts.has(escort.id)}
                            calculateAge={calculateAge}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}