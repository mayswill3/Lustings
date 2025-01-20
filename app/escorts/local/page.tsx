'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { MapPin, ChevronDown, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '@/components/layout';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EscortCard } from '@/components/escort-card/EscortCard';
import { FilterSection } from '@/components/search/FilterSectionProps';
import { createClient } from '@/utils/supabase/client';
import { getPostcodeCoordinates, calculateDistance } from '@/utils/location';
import { UK_REGIONS } from '@/constants/locations';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import LocationFilter from '@/components/LocationFilter';

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

export default function FilteredEscortPage() {
    // Core state
    const [escorts, setEscorts] = useState([]);
    const [filteredEscorts, setFilteredEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Location state
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [selectedTown, setSelectedTown] = useState<string | null>(null);

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

            // Location filters
            if (selectedRegion && escort.location?.region !== selectedRegion) return false;
            if (selectedCounty && escort.location?.county !== selectedCounty) return false;
            if (selectedTown && escort.location?.town !== selectedTown) return false;

            // Basic filters
            if (filters.searchTerm && !escort.full_name?.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
            if (filters.gender && personalDetails.gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
            if (filters.ethnicity && escort.about_you?.ethnicity?.toLowerCase() !== filters.ethnicity.toLowerCase()) return false;
            if (filters.nationality && escort.nationality?.toLowerCase() !== filters.nationality.toLowerCase()) return false;

            // Age filter using age range
            if (filters.age && personalDetails.dob) {
                const ageRange = getAgeRange(personalDetails.dob);
                if (ageRange !== filters.age) return false;
            }

            // Booking length filter
            if (filters.bookingLength) {
                const hasBookingLength = escort.preferences?.escorting?.rates?.inCall?.[filters.bookingLength] ||
                    escort.preferences?.escorting?.rates?.outCall?.[filters.bookingLength];
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
        setSelectedRegion(null);
        setSelectedCounty(null);
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
    const fetchEscorts = async () => {
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            // Fetch available escorts
            const { data: availableIds, error: availError } = await supabase
                .from('availability_status')
                .select('user_id')
                .eq('booking_date', today)
                .gte('status_end', now.toISOString());

            if (availError) throw availError;

            // Fetch featured escorts
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
                .select(`
                    *,
                    verification!left(
                        verified,
                        id
                    )
                `)
                .eq('member_type', 'Offering Services');

            if (escortError) throw escortError;

            // Sort escorts: featured first within each region/county
            const sortedEscorts = (escortData || []).sort((a, b) => {
                if (featuredIdSet.has(a.id) && !featuredIdSet.has(b.id)) return -1;
                if (!featuredIdSet.has(a.id) && featuredIdSet.has(b.id)) return 1;
                return 0;
            });

            setEscorts(sortedEscorts);
            setAvailableEscorts(availableIdSet);
            setFeaturedEscorts(featuredIdSet);
            setFilteredEscorts(sortedEscorts);
        } catch (error) {
            console.error('Error fetching escorts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchEscorts();
        const interval = setInterval(fetchEscorts, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, selectedRegion, selectedCounty]);


    return (
        <DashboardLayout
            user={user}
            userDetails={userDetails}
            title="Escorts"
            description="Browse escorts by location"
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
                    selectedActivities={filters.activities}
                    setSelectedActivities={(activities) => setFilters(prev => ({ ...prev, activities }))}
                    selectedBookingLength={filters.bookingLength}
                    setSelectedBookingLength={(length) => setFilters(prev => ({ ...prev, bookingLength: length }))}
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

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEscorts.map((escort) => (
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