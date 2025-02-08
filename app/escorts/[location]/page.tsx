// app/escorts/[location]/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import LocationPageClient from './location-page-client';
import { UK_REGIONS } from '@/constants/locations';

// Helper function to find location details
const findLocation = (searchLocation: string) => {
    const normalizedSearch = searchLocation.toLowerCase().trim();

    // Check counties
    for (const [region, data] of Object.entries(UK_REGIONS)) {
        if (data.counties.some(county => county.toLowerCase() === normalizedSearch)) {
            return {
                type: 'county',
                name: searchLocation,
                region
            };
        }
        // Check towns
        for (const county of data.counties) {
            if (data.towns[county].some(town => town.toLowerCase() === normalizedSearch)) {
                return {
                    type: 'town',
                    name: searchLocation,
                    county,
                    region
                };
            }
        }
    }
    return null;
};

// Generate metadata for the page
export async function generateMetadata({ params }): Promise<Metadata> {
    const locationName = decodeURIComponent(params.location).replace(/-/g, ' ');
    const locationInfo = findLocation(locationName);

    const title = locationInfo
        ? `Escorts in ${locationInfo.name} | Find Local Escorts`
        : 'Find Local Escorts';

    const description = locationInfo
        ? `Find verified escorts in ${locationInfo.name}${locationInfo.type === 'town' ? `, ${locationInfo.county}` : ''}. Browse profiles, reviews, and availability.`
        : 'Find verified local escorts in your area. Browse profiles, reviews, and availability.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_GB',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
        alternates: {
            canonical: `/escorts/${params.location}`,
        },
    };
}

export default async function LocationPage({
    params
}: {
    params: { location: string }
}) {
    const supabase = createClient();
    const [user, userDetails] = await Promise.all([
        getUser(supabase),
        getUserDetails(supabase)
    ]);

    const locationName = decodeURIComponent(params.location).replace(/-/g, ' ');
    const locationInfo = findLocation(locationName);

    return (
        <DashboardLayout
            user={user}
            userDetails={userDetails}
            title={locationInfo ? `Escorts in ${locationInfo.name}` : 'Find Local Escorts'}
            description={locationInfo
                ? `Find verified escorts in ${locationInfo.name}${locationInfo.type === 'town' ? `, ${locationInfo.county}` : ''}`
                : 'Find verified local escorts in your area'
            }
        >
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            }>
                <LocationPageClient location={locationName} />
            </Suspense>
        </DashboardLayout>
    );
}