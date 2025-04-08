// app/page.tsx
import { Metadata } from 'next';
import DashboardClient from '@/components/dashboard/client';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import Footer from '@/components/footer/FooterAdmin';

// Static metadata
export const metadata: Metadata = {
  title: 'UK Escort Directory | Find Your Perfect Match',
  description: 'Discover companions across the United Kingdom. Browse our directory of verified escorts in London, Manchester, Essex, Kent and more.',
  keywords: 'UK escorts, London escorts, Manchester escorts, Essex escorts, Kent escorts',
  openGraph: {
    title: 'UK Escort Directory | Find Your Perfect Match',
    description: 'Discover companions across the United Kingdom',
    type: 'website',
    url: 'https://www.tinsellink.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UK Escort Directory',
      },
    ],
  },
};

export default async function DashboardPage() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  return <><DashboardClient user={user} userDetails={userDetails} />  <Footer /></>;
}