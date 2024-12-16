'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import {
    MapPin,
    Clock,
    BanknoteIcon,
    Car,
    Home,
    CalendarCheck
} from 'lucide-react';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function AvailableEscorts(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailableEscorts = async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split('T')[0]; // Gets YYYY-MM-DD format

                // First get all available user IDs for today
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

                // Then get those users' details
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('member_type', 'Offering Services')
                    .in('id', availableIds.map(a => a.user_id));

                if (error) throw error;
                setEscorts(data || []);
            } catch (error) {
                console.error('Error fetching available escorts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableEscorts();

        // Refresh data every minute
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
                                <Card key={escort.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-[3/4]">
                                        <img
                                            src={escort.profile_pictures?.[0] || '/placeholder-image.jpg'}
                                            alt={escort.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                                            <Badge className="bg-green-500">
                                                Available Now
                                            </Badge>
                                            {escort.preferences?.escorting?.locationInfo?.canAccommodate && (
                                                <Badge className="bg-purple-500">
                                                    <Home className="h-4 w-4 mr-1" />
                                                    Incall
                                                </Badge>
                                            )}
                                            {escort.preferences?.escorting?.locationInfo?.willTravel && (
                                                <Badge className="bg-purple-500">
                                                    <Car className="h-4 w-4 mr-1" />
                                                    Outcall
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold">{escort.full_name}</h3>
                                            {escort.preferences?.escorting?.rates?.inCall?.["30mins"] && (
                                                <div className="flex items-center text-purple-600 font-semibold">
                                                    <BanknoteIcon className="h-4 w-4 mr-1" />
                                                    £{escort.preferences.escorting.rates.inCall["30mins"]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            {escort.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{`${escort.location.town || ''} ${escort.location.county || ''}`}</span>
                                                </div>
                                            )}
                                            {escort.about_you?.age_group && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{escort.about_you.age_group}</span>
                                                </div>
                                            )}
                                        </div>

                                        {escort.personal_details?.activities && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {escort.personal_details.activities.slice(0, 3).map((activity, index) => (
                                                    <Badge key={index} variant="outline" className="bg-purple-50">
                                                        {activity}
                                                    </Badge>
                                                ))}
                                                {escort.personal_details.activities.length > 3 && (
                                                    <Badge variant="outline" className="bg-purple-50">
                                                        +{escort.personal_details.activities.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}