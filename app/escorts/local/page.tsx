'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { UK_REGIONS } from '@/constants/locations';
import { MapPin, Clock, BanknoteIcon, Car, Home, ChevronDown, ChevronRight } from 'lucide-react';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function FilteredEscortPage(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [expandedRegions, setExpandedRegions] = useState({});
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

    useEffect(() => {
        fetchEscorts();

        // Refresh data every minute
        const interval = setInterval(fetchEscorts, 60000);
        return () => clearInterval(interval);
    }, []);

    async function fetchEscorts() {
        try {
            // Get today's date in YYYY-MM-DD format
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            // First get all available user IDs for today
            const { data: availableIds, error: availError } = await supabase
                .from('availability_status')
                .select('user_id')
                .eq('booking_date', today)
                .gte('status_end', now.toISOString());

            if (availError) throw availError;

            const availableIdSet = new Set(availableIds?.map(a => a.user_id) || []);

            // Fetch escorts
            const { data: escortData, error: escortError } = await supabase
                .from('users')
                .select('*')
                .eq('member_type', 'Offering Services');

            if (escortError) throw escortError;

            setEscorts(escortData || []);
            setAvailableEscorts(availableIdSet);
        } catch (error) {
            console.error('Error fetching escorts:', error);
        } finally {
            setLoading(false);
        }
    }

    const toggleRegion = (region: string) => {
        setExpandedRegions(prev => ({
            ...prev,
            [region]: !prev[region]
        }));
    };

    const handleRegionClick = (region: string) => {
        setSelectedRegion(region === selectedRegion ? null : region);
        setSelectedCounty(null);
    };

    const handleCountyClick = (county: string) => {
        setSelectedCounty(county === selectedCounty ? null : county);
    };

    const filteredEscorts = escorts.filter(escort => {
        if (selectedRegion && escort.location?.region !== selectedRegion) return false;
        if (selectedCounty && escort.location?.county !== selectedCounty) return false;
        return true;
    });

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
            title="Escorts"
            description="Browse escorts by location"
        >
            <div className="container mx-auto px-4 py-8">
                {/* Location Filter */}
                <Card className="mb-8 p-4">
                    <div className="space-y-2">
                        {Object.entries(UK_REGIONS).map(([regionName, regionData]) => {
                            const escortsInRegion = escorts.filter(e => e.location?.region === regionName);
                            const regionCount = escortsInRegion.length;
                            if (regionCount === 0) return null;

                            return (
                                <div key={regionName} className="border-b border-gray-100 last:border-0">
                                    <button
                                        onClick={() => {
                                            toggleRegion(regionName);
                                            handleRegionClick(regionName);
                                        }}
                                        className={`w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors ${selectedRegion === regionName ? 'bg-purple-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-500" />
                                            <span className="font-medium">{regionName}</span>
                                            <Badge variant="outline" className="ml-2">{regionCount}</Badge>
                                        </div>
                                        {regionData.counties.length > 0 && (
                                            expandedRegions[regionName] ?
                                                <ChevronDown className="h-4 w-4 text-gray-400" /> :
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedRegions[regionName] && (
                                        <div className="ml-6 mb-2 space-y-1">
                                            {regionData.counties.map(county => {
                                                const countyCount = escorts.filter(e =>
                                                    e.location?.county === county &&
                                                    e.location?.region === regionName
                                                ).length;
                                                if (countyCount === 0) return null;

                                                return (
                                                    <button
                                                        key={county}
                                                        onClick={() => handleCountyClick(county)}
                                                        className={`w-full flex items-center justify-between p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md ${selectedCounty === county ? 'bg-purple-50' : ''
                                                            }`}
                                                    >
                                                        <span>{county}</span>
                                                        <Badge variant="outline" className="bg-gray-50">
                                                            {countyCount}
                                                        </Badge>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Escorts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEscorts.map((escort) => (
                        <Card key={escort.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={escort.profile_pictures?.[0] || '/placeholder-image.jpg'}
                                    alt={escort.full_name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2">
                                    {availableEscorts.has(escort.id) && (
                                        <Badge className="bg-green-500">
                                            Available Now
                                        </Badge>
                                    )}
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
            </div>
        </DashboardLayout>
    );
}