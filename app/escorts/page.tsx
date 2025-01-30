'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { EscortCard } from '@/components/escort-card/EscortCard';
import { UserX } from 'lucide-react';
import { getPostcodeCoordinates, calculateDistance } from '@/utils/location';
import { FilterSection } from '@/components/search/FilterSectionProps';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import LocationFilter from '@/components/LocationFilter';
import { UK_REGIONS } from '@/constants/locations';

const supabase = createClient();
const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
]);

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function EscortGrid() {
    const [escorts, setEscorts] = useState([]);
    const [filteredEscorts, setFilteredEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Location state
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [selectedTown, setSelectedTown] = useState<string | null>(null);

    // Existing filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    const [selectedCallType, setSelectedCallType] = useState('');
    const [selectedBookingLength, setSelectedBookingLength] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('');
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedDistance, setSelectedDistance] = useState<number | ''>('');
    const [searchPostcode, setSearchPostcode] = useState('');
    const [postcodeError, setPostcodeError] = useState('');
    const [isLoadingPostcode, setIsLoadingPostcode] = useState(false);
    const [searchCoordinates, setSearchCoordinates] = useState<Coordinates | null>(null);

    // Existing utility functions
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

    const getAgeRange = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 56) return '56+';
        if (age >= 46) return '46-55';
        if (age >= 41) return '41-45';
        if (age >= 36) return '36-40';
        if (age >= 31) return '31-35';
        if (age >= 25) return '25-30';
        if (age >= 18) return '18-24';
        return '';
    };

    // Existing handlers
    const handlePostcodeChange = async (postcode: string) => {
        const cleanedPostcode = postcode.trim().toUpperCase();
        setSearchPostcode(cleanedPostcode);
        setPostcodeError('');

        if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(cleanedPostcode)) {
            setSearchCoordinates(null);
            setPostcodeError('Please enter a valid UK postcode (e.g., DA1 1AA).');
            return;
        }

        setIsLoadingPostcode(true);
        const coords = await getPostcodeCoordinates(cleanedPostcode);
        setIsLoadingPostcode(false);

        if (coords) {
            setSearchCoordinates(coords);
        } else {
            setSearchCoordinates(null);
            setPostcodeError('Postcode not found. Please try again.');
        }
    };

    useEffect(() => {
        const fetchEscortsAndAvailability = async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split('T')[0];

                const { data: availableIds } = await supabase
                    .from('availability_status')
                    .select('user_id')
                    .eq('booking_date', today)
                    .gte('status_end', now.toISOString());

                const { data: featuredIds } = await supabase
                    .from('featured_profiles')
                    .select('user_id')
                    .eq('feature_date', today)
                    .gte('feature_end', now.toISOString());

                const { data: escortData } = await supabase
                    .from('users')
                    .select(`
                        *,
                        verification!left(
                            verified,
                            id
                        )
                    `)
                    .eq('member_type', 'Offering Services')
                    .eq('is_deleted', false);

                setEscorts(escortData || []);
                setAvailableEscorts(new Set(availableIds?.map(a => a.user_id) || []));
                setFeaturedEscorts(new Set(featuredIds?.map(f => f.user_id) || []));
            } catch (error) {
                console.error('Error fetching escorts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEscortsAndAvailability();
        const interval = setInterval(fetchEscortsAndAvailability, 60000);
        return () => clearInterval(interval);
    }, []);

    // Filter functions
    const filterByDistance = async () => {
        if (!searchCoordinates || !selectedDistance) return;

        setLoading(true);
        try {
            const escortsWithinDistance = await Promise.all(
                escorts.map(async (escort) => {
                    const escortPostcode = escort.location?.postcode;
                    if (!escortPostcode) return null;

                    const escortCoordinates = await getPostcodeCoordinates(escortPostcode);
                    if (!escortCoordinates) return null;

                    const distance = calculateDistance(searchCoordinates, escortCoordinates);
                    return distance <= Number(selectedDistance) ? escort : null;
                })
            );

            setFilteredEscorts(escortsWithinDistance.filter(Boolean));
        } catch (error) {
            console.error('Error in filterByDistance:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const filtered = escorts.filter((escort) => {
            // First check if the profile is deleted
            if (escort.is_deleted) return false;
            const details = escort.personal_details || {};
            const preferences = escort.preferences?.escorting || {};

            // Location filters
            if (selectedRegion && escort.location?.region !== selectedRegion) return false;
            if (selectedCounty && escort.location?.county !== selectedCounty) return false;
            if (selectedTown && escort.location?.town !== selectedTown) return false;

            const escortActivities = details.activities?.map(act => act.toLowerCase()) || [];
            const normalizedSelectedActivities = selectedActivities.map(act => act.toLowerCase());

            const matches = [
                !searchTerm || escort.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
                !selectedGender || details.gender?.toLowerCase() === selectedGender.toLowerCase(),
                !selectedEthnicity || escort.about_you?.ethnicity?.toLowerCase() === selectedEthnicity.toLowerCase(),
                !selectedAge || (details.dob && getAgeRange(details.dob) === selectedAge),
                !selectedCallType || preferences.rates?.[selectedCallType],
                !selectedBookingLength || preferences.rates?.inCall?.[selectedBookingLength] || preferences.rates?.outCall?.[selectedBookingLength],
                !selectedNationality || escort.nationality?.toLowerCase() === selectedNationality.toLowerCase(),
                !normalizedSelectedActivities.length || normalizedSelectedActivities.every(activity =>
                    escortActivities.includes(activity)
                )
            ];

            return matches.every(Boolean);
        });

        setFilteredEscorts(filtered);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGender('');
        setSelectedAge('');
        setSelectedEthnicity('');
        setSelectedCallType('');
        setSelectedBookingLength('');
        setSelectedNationality('');
        setSelectedActivities([]);
        setSearchPostcode('');
        setSelectedDistance('');
        setSearchCoordinates(null);
        setSelectedRegion(null);
        setSelectedCounty(null);
        setSelectedTown(null);
        setFilteredEscorts(escorts);
    };

    // Effects
    useEffect(() => {
        setFilteredEscorts(escorts);
    }, [escorts]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [
        searchTerm,
        selectedGender,
        selectedAge,
        selectedEthnicity,
        selectedCallType,
        selectedBookingLength,
        selectedNationality,
        selectedActivities,
        selectedRegion,
        selectedCounty,
        selectedTown,
        escorts
    ]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <DashboardLayout user={user} userDetails={userDetails} title="All Escorts" description="Browse all available escorts">
            <div className="w-full max-w-screen-xl mx-auto px-2 pb-8">
                <FilterSection
                    {...{
                        searchTerm,
                        setSearchTerm,
                        selectedGender,
                        setSelectedGender,
                        selectedAge,
                        setSelectedAge,
                        selectedEthnicity,
                        setSelectedEthnicity,
                        selectedNationality,
                        setSelectedNationality,
                        selectedActivities,
                        setSelectedActivities,
                        selectedBookingLength,
                        setSelectedBookingLength,
                        selectedDistance,
                        setSelectedDistance,
                        searchPostcode,
                        setSearchPostcode: handlePostcodeChange,
                        postcodeError,
                        isLoadingPostcode,
                        searchCoordinates,
                        filterByDistance,
                        clearFilters,
                        showFilters,
                        setShowFilters,
                        loading,
                    }}
                />

                <LocationFilter
                    escorts={escorts}
                    selectedRegion={selectedRegion}
                    selectedCounty={selectedCounty}
                    selectedTown={selectedTown}
                    onRegionSelect={setSelectedRegion}
                    onCountySelect={setSelectedCounty}
                    onTownSelect={setSelectedTown}
                    onClearFilters={clearFilters}
                    ukRegions={UK_REGIONS}
                />

                {filteredEscorts.length === 0 ? (
                    <div className="text-center py-12">
                        <UserX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h2>No Escorts Match Your Search</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEscorts.map((escort) => (
                            <EscortCard
                                key={escort.id}
                                escort={{
                                    ...escort,
                                }}
                                isAvailable={availableEscorts.has(escort.id)}
                                calculateAge={calculateAge}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}