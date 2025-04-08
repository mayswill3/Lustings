import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch active escort profiles
    const { data: escorts } = await supabase
      .from('users')
      .select('id, full_name, location, updated_at')
      .eq('is_deleted', false)
      .eq('member_type', 'Offering Services');

    // Fetch all locations with active escorts
    const { data: locations } = await supabase
      .from('users')
      .select('location')
      .eq('is_deleted', false)
      .eq('member_type', 'Offering Services');

    // Generate sitemap XML
    const xml = generateSitemapXml(escorts, locations);

    // Return the XML with proper headers
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function generateSitemapXml(escorts: any[], locations: any[]) {
  // Get unique locations
  const uniqueLocations = new Set(
    locations
      .map(item => item.location)
      .filter(Boolean)
      .map(loc => formatLocationUrl(loc))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      <url>
        <loc>https://www.tinsellink.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://www.tinsellink.com/escorts</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://www.tinsellink.com/escorts/available-today</loc>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
      </url>
          <!-- Classified Alternative Pages -->
      <url>
        <loc>https://www.tinsellink.com/classifieds/adultwork-alternative</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://www.tinsellink.com/classifieds/onlyfans-alternative</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://www.tinsellink.com/classifieds/vivastreet-alternative</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- Location Pages -->
      ${Array.from(uniqueLocations)
        .map(
          location => `
        <url>
          <loc>https://www.tinsellink.com/escorts/${location}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `
        )
        .join('')}

      <!-- Profile Pages -->
      ${escorts
        .map(
          escort => `
        <url>
          <loc>https://www.tinsellink.com/escort/${escort.id}</loc>
          <lastmod>${new Date(escort.updated_at).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}

      <!-- Legal Pages -->
      <url>
        <loc>https://www.tinsellink.com/terms</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://www.tinsellink.com/privacy-policy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    </urlset>`;

  return xml;
}

function formatLocationUrl(location: any) {
  if (!location) return '';
  
  // Special cases for Greater areas
  if (location.region === 'London') return 'Greater%20London';
  if (location.region === 'Manchester') return 'Greater%20Manchester';
  
  // Default to region/county
  return encodeURIComponent(location.region || location.county || '').toLowerCase();
}