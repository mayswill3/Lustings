import { Metadata } from 'next';
import EscortGridClient from '@/components/escorts/EscortGridClient'
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

export const metadata: Metadata = {
    title: 'UK Escort Directory | Browse All Escorts',
    description: 'Browse verified escorts across the United Kingdom. Filter by location, availability, and services to find your perfect match.',
    keywords: 'UK escorts, escort directory, escort services, verified escorts',
    openGraph: {
        title: 'UK Escort Directory | Browse All Escorts',
        description: 'Browse verified escorts across the United Kingdom',
        type: 'website',
        siteName: 'Tinsellink',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'UK Escort Directory',
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://www.tinsellink.com/escorts',
    }
};

export default async function EscortPage() {
    const supabase = createClient();
    const [user, userDetails] = await Promise.all([
        getUser(supabase),
        getUserDetails(supabase)
    ]);

    return <EscortGridClient user={user} userDetails={userDetails} />;
}