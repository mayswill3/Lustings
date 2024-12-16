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
    BanknoteIcon, // Changed from Pound
    Car,
    Home
} from 'lucide-react';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function EscortGrid(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEscorts() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('member_type', 'Offering Services');

                if (error) throw error;
                setEscorts(data || []);
            } catch (error) {
                console.error('Error fetching escorts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEscorts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <DashboardLayout user={props.user}
            userDetails={props.userDetails}
            title="Profile Page" description="View user details">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {escorts.map((escort) => (
                        <Card key={escort.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={escort.profile_pictures?.[0] || '/placeholder-image.jpg'}
                                    alt={escort.full_name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2">
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
                                            <BanknoteIcon className="h-4 w-4" />
                                            {escort.preferences.escorting.rates.inCall["30mins"]}
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
                                    {escort.personal_details?.age_group && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{escort.personal_details.age_group}</span>
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
            </div>
        </DashboardLayout>
    );
}