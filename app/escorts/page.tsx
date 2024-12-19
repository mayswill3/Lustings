'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { EscortCard } from '@/components/escort-card/EscortCard';
import { Input } from "@/components/ui/input";
import { Search, UserX, SlidersHorizontal } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { NATIONALITIES } from '@/constants/nationalities';
import PHYSICAL_OPTIONS from '@/constants/physical';
import GENDERS from '@/constants/gender';
import AGE_RANGES from '@/constants/age-ranges';
import BOOKING_LENGTHS from '@/constants/booking-length';
import ActivityMultiSelect from '@/components/search/ActivityMultiSelect';
import { getPostcodeCoordinates, calculateDistance, DISTANCE_OPTIONS } from '@/utils/location';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function EscortGrid(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [filteredEscorts, setFilteredEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

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

    const handlePostcodeChange = async (postcode: string) => {
        const cleanedPostcode = postcode.trim().toUpperCase();
        setSearchPostcode(cleanedPostcode);
        setPostcodeError('');

        // Validate the postcode
        const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
        if (!postcodeRegex.test(cleanedPostcode)) {
            setSearchCoordinates(null);
            setPostcodeError('Please enter a valid UK postcode (e.g., DA1 1AA).');
            return;
        }

        // Fetch coordinates if valid
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


    useEffect(() => {
        async function fetchEscortsAndAvailability() {
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

                const availableIdSet = new Set(availableIds?.map(a => a.user_id) || []);
                const featuredIdSet = new Set(featuredIds?.map(f => f.user_id) || []);

                setEscorts(escortData || []);
                setAvailableEscorts(availableIdSet);
                setFeaturedEscorts(featuredIdSet);
            } catch (error) {
                console.error('Error fetching escorts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEscortsAndAvailability();
        const interval = setInterval(fetchEscortsAndAvailability, 60000);
        return () => clearInterval(interval);
    }, []);

    const filterByDistance = async () => {
        if (!searchCoordinates || !selectedDistance) {
            console.log('No search coordinates or distance selected');
            return;
        }

        setLoading(true);
        try {
            // Filter escorts with valid postcodes
            const escortsWithValidPostcodes = await Promise.all(
                escorts.map(async (escort) => {
                    const escortPostcode = escort.location?.postcode;
                    if (!escortPostcode) {
                        console.log(`No postcode for escort ${escort.id}`);
                        return null;
                    }

                    try {
                        const escortCoordinates = await getPostcodeCoordinates(escortPostcode);
                        if (!escortCoordinates) {
                            console.log(`No coordinates found for postcode ${escortPostcode}`);
                            return null;
                        }

                        const distance = calculateDistance(searchCoordinates, escortCoordinates);
                        console.log(`Distance for escort ${escort.id}: ${distance} miles`);

                        if (distance <= Number(selectedDistance)) {
                            return escort;
                        }
                    } catch (error) {
                        console.error(`Error processing escort ${escort.id}:`, error);
                    }
                    return null;
                })
            );

            // Filter out null values and update state
            const filteredResults = escortsWithValidPostcodes.filter(escort => escort !== null);
            console.log(`Found ${filteredResults.length} escorts within range`);
            setFilteredEscorts(filteredResults);
        } catch (error) {
            console.error('Error in filterByDistance:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        const filtered = await Promise.all(
            escorts.map(async (escort) => {
                const personalDetails = escort.personal_details || {};
                const preferences = escort.preferences?.escorting || {};

                const matchesName = escort.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesGender = selectedGender
                    ? personalDetails.gender?.toLowerCase() === selectedGender.toLowerCase()
                    : true;
                const matchesEthnicity = selectedEthnicity
                    ? escort.about_you.ethnicity?.toLowerCase() === selectedEthnicity.toLowerCase()
                    : true;
                const matchesAge =
                    selectedAge && personalDetails.dob
                        ? calculateAge(personalDetails.dob) === parseInt(selectedAge)
                        : true;
                const matchesCallType = selectedCallType
                    ? preferences.rates?.[selectedCallType]
                    : true;
                const matchesBookingLength = selectedBookingLength
                    ? (preferences.rates?.inCall?.[selectedBookingLength] ||
                        preferences.rates?.outCall?.[selectedBookingLength])
                    : true;
                const matchesNationality = selectedNationality
                    ? escort.nationality?.toLowerCase() === selectedNationality.toLowerCase()
                    : true;
                const matchesActivities = selectedActivities.length
                    ? selectedActivities.every((activity) =>
                        escort.personal_details?.activities?.some(
                            (escortActivity) =>
                                escortActivity.toLowerCase() === activity.toLowerCase()
                        )
                    )
                    : true;

                let matchesDistance = true;
                if (selectedDistance && searchCoordinates) {
                    const escortPostcode = escort.location?.postcode;
                    if (escortPostcode) {
                        const escortCoordinates = await getPostcodeCoordinates(escortPostcode);
                        if (escortCoordinates) {
                            const distance = calculateDistance(searchCoordinates, escortCoordinates);
                            matchesDistance = distance <= Number(selectedDistance);
                        } else {
                            matchesDistance = false; // No coordinates found for the escort
                        }
                    } else {
                        matchesDistance = false; // Escort lacks a postcode
                    }
                }

                return (
                    matchesName &&
                    matchesGender &&
                    matchesEthnicity &&
                    matchesAge &&
                    matchesCallType &&
                    matchesBookingLength &&
                    matchesNationality &&
                    matchesActivities &&
                    matchesDistance
                );
            })
        );

        // Update filtered escorts
        setFilteredEscorts(escorts.filter((_, index) => filtered[index]));
    };

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
        setPostcodeError('');
        setFilteredEscorts(escorts);
    };

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedGender, selectedAge, selectedEthnicity, selectedCallType, selectedBookingLength, selectedNationality, selectedActivities]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }
    return (
        <DashboardLayout user={props.user} userDetails={props.userDetails} title="All Escorts" description="Browse all available escorts">
            <div className="container mx-auto px-4 py-8">
                <Card className="mb-3 p-2 sm:p-3 bg-white">
                    {/* Primary Search - Always visible */}
                    <div className="relative mb-2">
                        <label className="text-xs font-medium text-gray-600">Search</label>
                        <div className="flex gap-2 mt-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                                <Input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-7 w-full h-8 text-xs"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-3 h-8 border rounded-md text-xs flex items-center gap-1 bg-gray-50 hover:bg-gray-100"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Primary Filters - Always visible */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Gender</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                            >
                                <option value="">All Genders</option>
                                {GENDERS.map((gender) => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Age</label>
                            <select
                                value={selectedAge}
                                onChange={(e) => setSelectedAge(e.target.value)}
                                className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                            >
                                <option value="">Any Age</option>
                                {AGE_RANGES.map((range) => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Secondary Filters - Collapsible */}
                    <div className={`space-y-2 ${showFilters ? '' : 'hidden'}`}>
                        {/* Location Search */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Postcode</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Enter postcode..."
                                        value={searchPostcode}
                                        onChange={(e) => handlePostcodeChange(e.target.value)}
                                        className={`h-8 w-full text-xs ${postcodeError ? 'border-red-500' : ''}`}
                                    />
                                    {isLoadingPostcode && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-500"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Distance</label>
                                <select
                                    value={selectedDistance}
                                    onChange={(e) => setSelectedDistance(e.target.value ? Number(e.target.value) : '')}
                                    className="h-8 border rounded-md px-2 bg-white text-xs w-full disabled:bg-gray-100"
                                    disabled={!searchPostcode || !searchCoordinates}
                                >
                                    <option value="">Select radius</option>
                                    {DISTANCE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Ethnicity</label>
                                <select
                                    value={selectedEthnicity}
                                    onChange={(e) => setSelectedEthnicity(e.target.value)}
                                    className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                                >
                                    <option value="">Any Ethnicity</option>
                                    {PHYSICAL_OPTIONS.ETHNICITY.map((ethnicity) => (
                                        <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Nationality</label>
                                <select
                                    value={selectedNationality}
                                    onChange={(e) => setSelectedNationality(e.target.value)}
                                    className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                                >
                                    <option value="">Any Nationality</option>
                                    {NATIONALITIES.map((nation) => (
                                        <option key={nation} value={nation}>{nation}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Services</label>
                                <ActivityMultiSelect
                                    selectedActivities={selectedActivities}
                                    setSelectedActivities={setSelectedActivities}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Duration</label>
                                <select
                                    value={selectedBookingLength}
                                    onChange={(e) => setSelectedBookingLength(e.target.value)}
                                    className="w-full h-8 border rounded-md px-2 bg-white text-xs"
                                >
                                    <option value="">Any Duration</option>
                                    {BOOKING_LENGTHS.map((length) => (
                                        <option key={length.value} value={length.value}>{length.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={filterByDistance}
                            disabled={!searchCoordinates || !selectedDistance || loading}
                            className="flex-1 h-8 bg-purple-600 text-white px-3 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                            {loading ? 'Searching...' : 'Search Location'}
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex-1 h-8 bg-gray-100 text-gray-700 px-3 rounded-md hover:bg-gray-200 transition-colors text-xs"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Error messages */}
                    {postcodeError && (
                        <p className="text-red-500 text-xs mt-1">{postcodeError}</p>
                    )}
                </Card>
                {filteredEscorts.length === 0 ? (
                    <div className="text-center py-12">
                        <UserX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h2>No Escorts Match Your Search</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEscorts.map((escort) => (
                            <EscortCard key={escort.id} escort={escort} isAvailable={availableEscorts.has(escort.id)} calculateAge={calculateAge} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}