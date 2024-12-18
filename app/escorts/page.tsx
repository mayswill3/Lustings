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

    // Filters state
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

    // Utility to calculate age from DOB
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

    // Handle postcode input and fetch coordinates
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

    // Fetch escorts and availability data
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
                    .select('*')
                    .eq('member_type', 'Offering Services');

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

    // Apply distance-based filter
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

    // Apply all filters
    const applyFilters = () => {
        const filtered = escorts.filter((escort) => {
            const details = escort.personal_details || {};
            const preferences = escort.preferences?.escorting || {};

            const matches = [
                !searchTerm || escort.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
                !selectedGender || details.gender?.toLowerCase() === selectedGender.toLowerCase(),
                !selectedEthnicity || escort.about_you.ethnicity?.toLowerCase() === selectedEthnicity.toLowerCase(),
                !selectedAge || (details.dob && calculateAge(details.dob) === parseInt(selectedAge)),
                !selectedCallType || preferences.rates?.[selectedCallType],
                !selectedBookingLength || preferences.rates?.inCall?.[selectedBookingLength] || preferences.rates?.outCall?.[selectedBookingLength],
                !selectedNationality || escort.nationality?.toLowerCase() === selectedNationality.toLowerCase(),
                !selectedActivities.length || selectedActivities.every((activity) =>
                    details.activities?.includes(activity.toLowerCase())
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
        setFilteredEscorts(escorts);
    };

    // Initialize filtered escorts on first load
    useEffect(() => {
        setFilteredEscorts(escorts);
    }, [escorts]);

    // Re-apply filters when dependencies change
    useEffect(() => {
        applyFilters();
    }, [
        searchTerm,
        selectedGender,
        selectedAge,
        selectedEthnicity,
        selectedCallType,
        selectedBookingLength,
        selectedNationality,
        selectedActivities,
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
                                escort={escort}
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
