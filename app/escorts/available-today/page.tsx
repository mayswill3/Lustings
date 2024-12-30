'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/layout';
import { EscortCard } from '@/components/escort-card/EscortCard';
import { FilterSection } from '@/components/search/FilterSectionProps';
import { createClient } from '@/utils/supabase/client';
import { getPostcodeCoordinates, calculateDistance } from '@/utils/location';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface FilterState {
    searchTerm: string;
    gender: string;
    age: string;
    ethnicity: string;
    callType: string;
    bookingLength: string;
    nationality: string;
    activities: string[];
    distance: number | '';
    postcode: string;
}

const supabase = createClient();
const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
]);

export default function AvailableEscorts() {
    // Core state
    const [escorts, setEscorts] = useState([]);
    const [filteredEscorts, setFilteredEscorts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        gender: '',
        age: '',
        ethnicity: '',
        callType: '',
        bookingLength: '',
        nationality: '',
        activities: [],
        distance: '',
        postcode: ''
    });

    // UI state
    const [showFilters, setShowFilters] = useState(false);
    const [postcodeError, setPostcodeError] = useState('');
    const [isLoadingPostcode, setIsLoadingPostcode] = useState(false);
    const [searchCoordinates, setSearchCoordinates] = useState<Coordinates | null>(null);

    // Utility functions
    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Handlers
    const handlePostcodeChange = async (postcode: string) => {
        const cleanedPostcode = postcode.trim().toUpperCase();
        setFilters(prev => ({ ...prev, postcode: cleanedPostcode }));
        setPostcodeError('');

        const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
        if (!postcodeRegex.test(cleanedPostcode)) {
            setSearchCoordinates(null);
            setPostcodeError('Please enter a valid UK postcode (e.g., DA1 1AA).');
            return;
        }

        setIsLoadingPostcode(true);
        const coords = await getPostcodeCoordinates(cleanedPostcode);
        setIsLoadingPostcode(false);

        if (coords) {
            setSearchCoordinates(coords);
            setPostcodeError('');
        } else {
            setSearchCoordinates(null);
            setPostcodeError('Postcode not found. Please try again.');
        }
    };

    const filterByDistance = async () => {
        if (!searchCoordinates || !filters.distance) return;

        setLoading(true);
        try {
            const escortsWithValidPostcodes = await Promise.all(
                escorts.map(async (escort) => {
                    const escortPostcode = escort.location?.postcode;
                    if (!escortPostcode) return null;

                    try {
                        const escortCoordinates = await getPostcodeCoordinates(escortPostcode);
                        if (!escortCoordinates) return null;

                        const distance = calculateDistance(searchCoordinates, escortCoordinates);
                        return distance <= Number(filters.distance) ? escort : null;
                    } catch (error) {
                        console.error(`Error processing escort ${escort.id}:`, error);
                        return null;
                    }
                })
            );

            setFilteredEscorts(escortsWithValidPostcodes.filter(Boolean));
        } catch (error) {
            console.error('Error in filterByDistance:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const filtered = escorts.filter(escort => {
            const personalDetails = escort.personal_details || {};
            const preferences = escort.preferences?.escorting || {};

            // Basic filters
            if (filters.searchTerm && !escort.full_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()))
                return false;
            if (filters.gender && personalDetails.gender?.toLowerCase() !== filters.gender.toLowerCase())
                return false;
            if (filters.ethnicity && escort.about_you?.ethnicity?.toLowerCase() !== filters.ethnicity.toLowerCase())
                return false;
            if (filters.nationality && escort.nationality?.toLowerCase() !== filters.nationality.toLowerCase())
                return false;

            // Age filter
            if (filters.age && personalDetails.dob) {
                const age = calculateAge(personalDetails.dob);
                if (age !== parseInt(filters.age)) return false;
            }

            // Booking length filter
            if (filters.bookingLength) {
                const hasBookingLength = preferences.rates?.inCall?.[filters.bookingLength] ||
                    preferences.rates?.outCall?.[filters.bookingLength];
                if (!hasBookingLength) return false;
            }

            // Activities filter
            if (filters.activities.length > 0) {
                const hasAllActivities = filters.activities.every(activity =>
                    personalDetails.activities?.some(
                        escortActivity => escortActivity.toLowerCase() === activity.toLowerCase()
                    )
                );
                if (!hasAllActivities) return false;
            }

            return true;
        });

        setFilteredEscorts(filtered);
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            gender: '',
            age: '',
            ethnicity: '',
            callType: '',
            bookingLength: '',
            nationality: '',
            activities: [],
            distance: '',
            postcode: ''
        });
        setSearchCoordinates(null);
        setPostcodeError('');
        setFilteredEscorts(escorts);
    };

    // Data fetching
    const fetchAvailableEscorts = async () => {
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];

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

            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    verification!left(
                        verified,
                        id
                    )
                `)
                .in('id', availableIds.map(a => a.user_id));

            if (error) throw error;

            setEscorts(data || []);
            setFilteredEscorts(data || []);
        } catch (error) {
            console.error('Error fetching available escorts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchAvailableEscorts();
        const interval = setInterval(fetchAvailableEscorts, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <DashboardLayout
            user={user}
            userDetails={userDetails}
            title="Available Now"
            description="Escorts available today"
        >
            <div className="w-full max-w-screen-xl mx-auto px-2 pb-8">
                <FilterSection
                    searchTerm={filters.searchTerm}
                    setSearchTerm={(term) => setFilters(prev => ({ ...prev, searchTerm: term }))}
                    selectedGender={filters.gender}
                    setSelectedGender={(gender) => setFilters(prev => ({ ...prev, gender }))}
                    selectedAge={filters.age}
                    setSelectedAge={(age) => setFilters(prev => ({ ...prev, age }))}
                    selectedEthnicity={filters.ethnicity}
                    setSelectedEthnicity={(ethnicity) => setFilters(prev => ({ ...prev, ethnicity }))}
                    selectedNationality={filters.nationality}
                    setSelectedNationality={(nationality) => setFilters(prev => ({ ...prev, nationality }))}
                    selectedBookingLength={filters.bookingLength}
                    setSelectedBookingLength={(length) => setFilters(prev => ({ ...prev, bookingLength: length }))}
                    selectedActivities={filters.activities}
                    setSelectedActivities={(activities) => setFilters(prev => ({ ...prev, activities }))}
                    selectedDistance={filters.distance}
                    setSelectedDistance={(distance) => setFilters(prev => ({ ...prev, distance }))}
                    searchPostcode={filters.postcode}
                    setSearchPostcode={handlePostcodeChange}
                    postcodeError={postcodeError}
                    isLoadingPostcode={isLoadingPostcode}
                    searchCoordinates={searchCoordinates}
                    filterByDistance={filterByDistance}
                    clearFilters={clearFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    loading={loading}
                />

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEscorts.map(escort => (
                        <EscortCard
                            key={escort.id}
                            escort={escort}
                            isAvailable={true}
                            calculateAge={calculateAge}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}