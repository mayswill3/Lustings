'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { EscortCard } from '@/components/escort-card/EscortCard';
import { UserX } from 'lucide-react';
import { FilterSection } from '@/components/search/FilterSectionProps';
import LocationFilter from '@/components/LocationFilter';
import { getPostcodeCoordinates, calculateDistance } from '@/utils/location';
import { UK_REGIONS, type Region, type County } from '@/constants/locations';

interface LocationPageClientProps {
    location: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const supabase = createClient();

// Helper function to normalize strings for comparison
const normalizeString = (str: string): string => {
    return str.toLowerCase().trim();
};

// Helper function to check if location is a county
const isCounty = (searchLocation: string): { region: Region; county: string } | null => {
    const normalizedSearch = normalizeString(searchLocation);

    for (const [region, data] of Object.entries(UK_REGIONS)) {
        const countyMatch = data.counties.find(
            county => normalizeString(county) === normalizedSearch
        );

        if (countyMatch) {
            return {
                region: region as Region,
                county: countyMatch // Keep original casing from data
            };
        }
    }
    return null;
};

// Helper function to check if location is a town
const isTown = (searchLocation: string): { region: Region; county: string; town: string } | null => {
    const normalizedSearch = normalizeString(searchLocation);

    for (const [region, data] of Object.entries(UK_REGIONS)) {
        for (const county of data.counties) {
            const townMatch = data.towns[county].find(
                town => normalizeString(town) === normalizedSearch
            );

            if (townMatch) {
                return {
                    region: region as Region,
                    county: county,
                    town: townMatch // Keep original casing from data
                };
            }
        }
    }
    return null;
};

// Main location finding function
const findLocation = (searchLocation: string) => {
    // First check if it's a county
    const countyMatch = isCounty(searchLocation);
    if (countyMatch) {
        return {
            ...countyMatch,
            type: 'county' as const
        };
    }

    // Then check if it's a town
    const townMatch = isTown(searchLocation);
    if (townMatch) {
        return {
            region: townMatch.region,
            county: townMatch.county,
            type: 'town' as const,
            town: townMatch.town
        };
    }

    return null;
};


export default function LocationPageClient({ location }: LocationPageClientProps) {
    const router = useRouter();
    const locationInfo = findLocation(location);

    // States for all escorts and initial location
    const [allEscorts, setAllEscorts] = useState<any[]>([]);
    const [initialLocation] = useState(locationInfo);

    // Initialize location state based on URL location parameter
    const [selectedRegion, setSelectedRegion] = useState<string | null>(locationInfo?.region || null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(
        locationInfo?.type === 'county' ? locationInfo.county :
            locationInfo?.type === 'town' ? locationInfo.county :
                null
    );
    const [selectedTown, setSelectedTown] = useState<string | null>(
        locationInfo?.type === 'town' ? locationInfo.town : null
    );


    // States
    const [escorts, setEscorts] = useState<any[]>([]);
    const [filteredEscorts, setFilteredEscorts] = useState<any[]>([]);
    const [availableEscorts, setAvailableEscorts] = useState<Set<string>>(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
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

    // Fetch data with case-insensitive queries
    useEffect(() => {
        const fetchData = async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split('T')[0];

                let query = supabase
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

                // Apply location filters based on location type
                if (locationInfo) {
                    // Use ilike for case-insensitive matching
                    query = query.ilike('location->>region', locationInfo.region);

                    if (locationInfo.type === 'county') {
                        query = query.ilike('location->>county', locationInfo.county);
                    } else if (locationInfo.type === 'town') {
                        query = query
                            .ilike('location->>county', locationInfo.county)
                            .ilike('location->>town', locationInfo.town);
                    }
                }

                const [availabilityData, featuredData, escortsData] = await Promise.all([
                    supabase
                        .from('availability_status')
                        .select('user_id')
                        .eq('booking_date', today)
                        .gte('status_end', now.toISOString()),
                    supabase
                        .from('featured_profiles')
                        .select('user_id')
                        .eq('feature_date', today)
                        .gte('feature_end', now.toISOString()),
                    query
                ]);

                setAvailableEscorts(new Set(availabilityData.data?.map(a => a.user_id) || []));
                setFeaturedEscorts(new Set(featuredData.data?.map(f => f.user_id) || []));
                setEscorts(escortsData.data || []);
                setFilteredEscorts(escortsData.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location, locationInfo]);

    // Calculate age helper
    const calculateAge = (dob: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Get age range for filtering
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

    // Handle postcode changes
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

    // Filter by distance
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

    // Apply filters
    const applyFilters = () => {
        const filtered = escorts.filter((escort) => {
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

        // Reset location to URL parameters
        setSelectedRegion(locationInfo?.region || null);
        setSelectedCounty(locationInfo?.type === 'county' ? locationInfo.county :
            locationInfo?.type === 'town' ? locationInfo.county :
                null);
        setSelectedTown(locationInfo?.type === 'town' ? locationInfo.town : null);

        setFilteredEscorts(escorts);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const generateStructuredData = () => {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "name": `Escorts in ${location}`,
            "description": `Find verified escorts in ${location}`,
            "provider": {
                "@type": "Organization",
                "name": "Your Site Name",
                "url": `https://tinsellink.com/escorts/${encodeURIComponent(location)}`
            },
            "numberOfItems": filteredEscorts.length,
            "itemListElement": filteredEscorts.map((escort, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Person",
                    "name": escort.full_name,
                    "location": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": escort.location?.town,
                            "addressRegion": escort.location?.county,
                            "addressCountry": "GB"
                        }
                    }
                }
            }))
        };

        return JSON.stringify(structuredData);
    };


    return (
        <>
            <Script id="structured-data" type="application/ld+json">
                {generateStructuredData()}
            </Script>
            <main className="w-full max-w-screen-xl mx-auto px-2 pb-8">
                <nav aria-label="Breadcrumb" className="mb-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li>
                            <a href="/" className="hover:text-gray-700">Home</a>
                        </li>
                        <li>/</li>
                        <li>
                            <a href="/escorts" className="hover:text-gray-700">Escorts</a>
                        </li>
                        <li>/</li>
                        <li aria-current="page" className="font-medium text-gray-900">
                            {location}
                        </li>
                    </ol>
                </nav>
                <header className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">
                        {locationInfo?.type === 'county' ? `Escorts in ${locationInfo.county}` :
                            locationInfo?.type === 'town' ? `Escorts in ${locationInfo.town}` :
                                `Escorts in ${location}`}
                    </h1>
                    {locationInfo && (
                        <p className="text-gray-600 dark:text-gray-400">
                            {locationInfo.type === 'town'
                                ? `${locationInfo.county}, ${locationInfo.region}`
                                : locationInfo.region}
                        </p>
                    )}
                </header>

                <section aria-label="Location filters">
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
                </section>
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

                <section aria-label="Search results">
                    {filteredEscorts.length === 0 ? (
                        <div className="text-center py-12">
                            <UserX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h2>No Escorts Found in {location}</h2>
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
                </section>
            </main>
        </>
    );
}