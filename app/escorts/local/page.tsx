'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { UK_REGIONS } from '@/constants/locations';
import { MapPin, ChevronDown, ChevronRight, Search, UserX } from 'lucide-react';
import { EscortCard } from '@/components/escort-card/EscortCard';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function FilteredEscortPage(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [expandedRegions, setExpandedRegions] = useState({});
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        fetchEscorts();
        const interval = setInterval(fetchEscorts, 60000);
        return () => clearInterval(interval);
    }, []);

    async function fetchEscorts() {
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

            // Fetch escorts
            const { data: escortData, error: escortError } = await supabase
                .from('users')
                .select('*')
                .eq('member_type', 'Offering Services');

            if (escortError) throw escortError;

            // Sort escorts to show featured first within each region/county
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
        // Filter by region
        if (selectedRegion && escort.location?.region !== selectedRegion) return false;

        // Filter by county
        if (selectedCounty && escort.location?.county !== selectedCounty) return false;

        // Filter by search term
        if (searchTerm && !escort.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    const clearFilters = () => {
        setSelectedRegion(null);
        setSelectedCounty(null);
        setSearchTerm('');
    };

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
                {/* Search Bar */}
                <Card className="mb-6 p-6 bg-white">
                    <div className="relative flex items-center">
                        <div className="absolute left-0 text-gray-600">
                            Members: {filteredEscorts.length}
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="relative w-full max-w-xl">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

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
                                        className={`w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors ${selectedRegion === regionName ? 'bg-purple-50' : ''}`}
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
                                                        className={`w-full flex items-center justify-between p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md ${selectedCounty === county ? 'bg-purple-50' : ''}`}
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

                {/* Escorts Grid or Empty State */}
                {filteredEscorts.length === 0 ? (
                    <div className="text-center py-12">
                        <UserX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No Escorts Match Your Search
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {(selectedRegion || selectedCounty || searchTerm)
                                ? "Try adjusting your filters or search term"
                                : "There are currently no escorts available"}
                        </p>
                        {(selectedRegion || selectedCounty || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEscorts.map((escort) => (
                            <EscortCard
                                key={escort.id}
                                escort={escort}
                                isAvailable={availableEscorts.has(escort.id)}
                                isFeatured={featuredEscorts.has(escort.id)}
                                calculateAge={calculateAge}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}