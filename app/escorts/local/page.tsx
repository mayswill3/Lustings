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
    const [expandedRegions, setExpandedRegions] = useState({});
    const [expandedCounties, setExpandedCounties] = useState({});
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [selectedTown, setSelectedTown] = useState<string | null>(null);

    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showCountyDropdown, setShowCountyDropdown] = useState(false);
    const [showTownDropdown, setShowTownDropdown] = useState(false);


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

            // Location filters
            if (selectedRegion && escort.location?.region !== selectedRegion) return false;
            if (selectedCounty && escort.location?.county !== selectedCounty) return false;
            if (selectedTown && escort.location?.town !== selectedTown) return false;

            // Basic filters
            if (filters.searchTerm && !escort.full_name?.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
            if (filters.gender && personalDetails.gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
            if (filters.ethnicity && escort.about_you?.ethnicity?.toLowerCase() !== filters.ethnicity.toLowerCase()) return false;
            if (filters.nationality && escort.nationality?.toLowerCase() !== filters.nationality.toLowerCase()) return false;

            // Age filter
            if (filters.age && personalDetails.dob) {
                const age = calculateAge(personalDetails.dob);
                if (age !== parseInt(filters.age)) return false;
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

    // Region/County/Town handlers
    const toggleRegion = (region: string) => {
        setExpandedRegions(prev => ({ ...prev, [region]: !prev[region] }));
    };

    const toggleCounty = (county: string) => {
        setExpandedCounties(prev => ({ ...prev, [county]: !prev[county] }));
    };

    const handleRegionClick = (region: string) => {
        setSelectedRegion(region === selectedRegion ? null : region);
        setSelectedCounty(null);
        setSelectedTown(null);
    };

    const handleCountyClick = (county: string) => {
        setSelectedCounty(county === selectedCounty ? null : county);
        setSelectedTown(null);
    };

    const handleTownClick = (town: string) => {
        setSelectedTown(town === selectedTown ? null : town);
    };

    const handleOutsideClick = () => {
        setShowRegionDropdown(false);
        setShowCountyDropdown(false);
        setShowTownDropdown(false);
    };

    const getCurrentRegionCounties = () => {
        return selectedRegion ? UK_REGIONS[selectedRegion]?.counties || [] : [];
    };

    const getCurrentCountyTowns = () => {
        if (!selectedRegion || !selectedCounty) return [];
        const escortsInCounty = escorts.filter(e =>
            e.location?.region === selectedRegion &&
            e.location?.county === selectedCounty
        );
        return [...new Set(escortsInCounty.map(e => e.location?.town).filter(Boolean))];
    };


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

                <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                        {/* Label */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">Location:</span>
                        </div>

                        {/* Filters Container */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                            {/* Region Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowRegionDropdown(!showRegionDropdown);
                                        setShowCountyDropdown(false);
                                        setShowTownDropdown(false);
                                    }}
                                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                            border border-gray-200 dark:border-gray-600
                            bg-white dark:bg-gray-800 
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            text-gray-900 dark:text-gray-100"
                                >
                                    <span className="truncate">{selectedRegion || 'Select Region'}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                </button>

                                {showRegionDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                            bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-600 
                            rounded-md shadow-lg">
                                        {Object.entries(UK_REGIONS).map(([regionName, regionData]) => {
                                            const escortsInRegion = escorts.filter(e => e.location?.region === regionName);
                                            const hasEscorts = escortsInRegion.length > 0;

                                            return (
                                                <button
                                                    key={regionName}
                                                    onClick={() => {
                                                        if (hasEscorts) {
                                                            handleRegionClick(regionName);
                                                            setShowRegionDropdown(false);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center justify-between p-3 text-left
                                            ${selectedRegion === regionName ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                            ${hasEscorts ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}
                                            text-gray-900 dark:text-gray-100`}
                                                    disabled={!hasEscorts}
                                                >
                                                    <span className="truncate font-medium">{regionName}</span>
                                                    <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                        {escortsInRegion.length}
                                                    </Badge>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {selectedRegion && (
                                <>
                                    <ChevronRight className="hidden sm:block h-4 w-4 text-gray-400 dark:text-gray-500" />

                                    {/* County Dropdown */}
                                    <div className="relative w-full sm:w-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCountyDropdown(!showCountyDropdown);
                                                setShowTownDropdown(false);
                                            }}
                                            className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                                    border border-gray-200 dark:border-gray-600
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    text-gray-900 dark:text-gray-100"
                                        >
                                            <span className="truncate">{selectedCounty || 'Select County'}</span>
                                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                        </button>

                                        {showCountyDropdown && (
                                            <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                                    bg-white dark:bg-gray-800 
                                    border border-gray-200 dark:border-gray-600 
                                    rounded-md shadow-lg">
                                                {getCurrentRegionCounties().map(county => {
                                                    const escortsInCounty = escorts.filter(e =>
                                                        e.location?.region === selectedRegion &&
                                                        e.location?.county === county
                                                    );
                                                    const hasCountyEscorts = escortsInCounty.length > 0;

                                                    return (
                                                        <button
                                                            key={county}
                                                            onClick={() => {
                                                                if (hasCountyEscorts) {
                                                                    handleCountyClick(county);
                                                                    setShowCountyDropdown(false);
                                                                }
                                                            }}
                                                            className={`w-full flex items-center justify-between p-3 text-left
                                                    ${selectedCounty === county ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                                    ${hasCountyEscorts ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}
                                                    text-gray-900 dark:text-gray-100`}
                                                            disabled={!hasCountyEscorts}
                                                        >
                                                            <span className="truncate">{county}</span>
                                                            <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                                {escortsInCounty.length}
                                                            </Badge>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedCounty && (
                                <>
                                    <ChevronRight className="hidden sm:block h-4 w-4 text-gray-400 dark:text-gray-500" />

                                    {/* Town Dropdown */}
                                    <div className="relative w-full sm:w-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowTownDropdown(!showTownDropdown);
                                            }}
                                            className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                                    border border-gray-200 dark:border-gray-600
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    text-gray-900 dark:text-gray-100"
                                        >
                                            <span className="truncate">{selectedTown || 'Select Town'}</span>
                                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                        </button>

                                        {showTownDropdown && (
                                            <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                                    bg-white dark:bg-gray-800 
                                    border border-gray-200 dark:border-gray-600 
                                    rounded-md shadow-lg">
                                                {getCurrentCountyTowns().map(town => {
                                                    const escortsInTown = escorts.filter(e =>
                                                        e.location?.region === selectedRegion &&
                                                        e.location?.county === selectedCounty &&
                                                        e.location?.town === town
                                                    );

                                                    return (
                                                        <button
                                                            key={town}
                                                            onClick={() => {
                                                                handleTownClick(town);
                                                                setShowTownDropdown(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between p-3 text-left
                                                    ${selectedTown === town ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                                    text-gray-900 dark:text-gray-100`}
                                                        >
                                                            <span className="truncate">{town}</span>
                                                            <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                                {escortsInTown.length}
                                                            </Badge>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Clear Button */}
                            {(selectedRegion || selectedCounty || selectedTown) && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center justify-center p-2 rounded-md
                            border border-gray-200 dark:border-gray-600
                            hover:bg-gray-100 dark:hover:bg-gray-700
                            sm:ml-2"
                                    title="Clear location filters"
                                >
                                    <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

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