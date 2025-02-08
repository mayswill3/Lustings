import { Metadata } from 'next';
import AvailableEscortsClient from '@/components/escorts/AvailableEscortsClient';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

export const metadata: Metadata = {
    title: 'Available Escorts | Find Companions Available Today',
    description: 'Browse escorts available today across the UK. Real-time availability updates, verified profiles, and instant booking options.',
    keywords: 'available escorts, UK escorts, instant booking, verified escorts',
    openGraph: {
        title: 'Available Escorts | Find Companions Available Today',
        description: 'Browse escorts available today across the UK',
        type: 'website',
        url: 'https://www.tinsellink.com/escorts/available-today',
    },
    alternates: {
        canonical: 'https://www.tinsellink.com/escorts/available-today',
    }
};

// JSON-LD structured data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Available Escorts Directory",
    "description": "Browse escorts available today across the UK",
    "provider": {
        "@type": "Organization",
        "name": "Tinsellink"
    },
    "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
    }
};

export default async function AvailableEscortsPage() {
    const supabase = createClient();
    const [user, userDetails] = await Promise.all([
        getUser(supabase),
        getUserDetails(supabase)
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AvailableEscortsClient user={user} userDetails={userDetails} />
        </>
    );
}