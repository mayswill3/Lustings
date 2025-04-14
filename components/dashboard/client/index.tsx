'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Ensure Link is imported
import { Users, Calendar } from 'lucide-react';

import Navbar from '@/components/navbar/NavbarAdmin'; // Assuming correct path
import { getActiveRoute } from '@/utils/navigation'; // Assuming correct path
import { routes } from '@/components/routes'; // Assuming correct path
// Removed Footer import as it wasn't used in the provided layout

// --- LocationCard Component ---
const LocationCard = ({ city, imagePath }) => {
    const router = useRouter(); // Use router hook directly

    // Function to create SEO-friendly and safe URLs
    const getFormattedUrl = (cityName) => {
        const lowerCity = cityName.toLowerCase();
        // Handle specific known cases first
        switch (lowerCity) {
            case 'london':
                return '/escorts/Greater%20London';
            case 'manchester':
                return '/escorts/Greater%20Manchester';
            default:
                // Default: encode the lowercase city name for the URL path
                return `/escorts/${encodeURIComponent(lowerCity)}`;
        }
    };

    return (
        <article
            // Use onClick for programmatic navigation via router.push
            onClick={() => router.push(getFormattedUrl(city))}
            className="relative rounded-xl overflow-hidden h-64 group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
            <Image
                src={imagePath}
                alt={`Escort services in ${city}`}
                fill
                // Removed priority: Not typically needed for these cards unless they are LCP
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Add sizes prop for better performance with fill
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="relative z-10">
                    <p className="text-sm font-medium text-white/90 mb-1">Escorts in</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{city}</h3>
                </div>
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </article>
    );
};

// --- HeroSlideshow Component ---
const HeroSlideshow = ({ slides, categories }) => { // Removed router prop
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // Ensure slides array is not empty before setting interval
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [slides.length]); // Dependency array ensures effect runs only if slide count changes

    // Handle case where slides might be empty initially
    if (slides.length === 0) {
        return <section aria-label="Hero" className="relative h-[600px] bg-gray-200 flex items-center justify-center"><p>Loading slides...</p></section>; // Or some placeholder
    }

    return (
        <section aria-label="Hero Slideshow" className="relative h-[600px] overflow-hidden bg-black/20">
            {slides.map((slide, index) => (
                <div
                    key={slide.type === 'image' ? slide.src : slide.title} // Use a more stable key if possible
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0' // Manage z-index for smooth transition
                        }`}
                    aria-hidden={index !== currentSlide} // Improve accessibility
                >
                    {/* == Slide Type: Image == */}
                    {slide.type === 'image' && (
                        <>
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                priority={index === 0} // Only prioritize the first image potentially
                                className="object-cover"
                                sizes="100vw" // Essential for 'fill' images
                            />
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
                            {/* Content for Image Slide */}
                            <div className="relative container mx-auto px-4 md:px-32 h-full flex items-center z-10">
                                <div className="max-w-2xl text-white">
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
                                        Find Your Perfect Match
                                    </h1>
                                    <p className="text-xl sm:text-2xl drop-shadow-lg mb-6 sm:mb-8">
                                        Discover companions in your area across the United Kingdom
                                    </p>
                                    {/* Category Links */}
                                    <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        {categories.map((category) => {
                                            const Icon = category.icon;
                                            return (
                                                <Link // Use Next.js Link for client-side navigation
                                                    key={category.path}
                                                    href={category.path}
                                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white/90 hover:bg-white
                                                            text-gray-900 rounded-lg font-semibold transition-all
                                                            duration-200 hover:shadow-md text-sm sm:text-base"
                                                >
                                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                                    <span>{category.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </>
                    )}

                    {/* == Slide Type: Promo == */}
                    {slide.type === 'promo' && (
                        // Use a distinct background color for the promo slide
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800">
                            <div className="relative container mx-auto px-4 md:px-16 lg:px-32 h-full flex items-center">
                                {/* Layout Container */}
                                <div className="grid grid-cols-1 md:grid-cols-2 w-full  items-center">

                                    {/* Text Content (Order adjusted for mobile focus) */}
                                    <div className="text-center md:text-left order-2 md:order-1">
                                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                                            {slide.title} {/* Use title from slide data */}
                                        </h2>
                                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8">
                                            {slide.subtitle} {/* Use subtitle from slide data */}
                                        </p>
                                        {/* Sign Up Button Link */}
                                        <Link // Use Link for internal navigation
                                            href="/dashboard/signin/signup" // Assuming this is the correct internal path
                                            className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-indigo-700 font-bold rounded-lg
                                                    hover:bg-indigo-100 transition-colors duration-200 text-base sm:text-lg"
                                        >
                                            Sign Up Now
                                        </Link>
                                    </div>

                                    {/* Phone Image */}
                                    <div className="flex justify-center md:justify-end items-center order-1 md:order-2 px-4 md:px-0 max-h-[400px] md:max-h-full">
                                        <div className="relative w-64 h-64 md:w-80 lg:w-96 md:h-[500px]">
                                            {/* Use a specific image path for the promo */}
                                            <Image
                                                src="/available_now.png" // Ensure this image exists in /public
                                                alt="Available Now feature shown on a mobile phone"
                                                fill
                                                className="object-contain drop-shadow-2xl"
                                                sizes="(max-width: 768px) 60vw, 30vw" // Adjust sizes
                                            // No priority needed here typically
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Slide Indicators */}
            {slides.length > 1 && ( // Only show indicators if more than one slide
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide} // Accessibility
                        />
                    ))}
                </div>
            )}
        </section>
    );
};


// --- Main Page Component: DashboardClient ---
export default function DashboardClient({ user, userDetails }) {
    // Hooks used at the top level
    const pathname = usePathname();
    // Router can be instantiated here if needed elsewhere, but not passed down unnecessarily
    // const router = useRouter();

    // Data Definitions
    const categories = [
        { name: 'All Escorts', path: '/escorts', icon: Users },
        { name: 'Available Today', path: '/escorts/available-today', icon: Calendar },
        // Add more categories as needed
    ];

    const locations = [
        { city: "LONDON", image: "/london-escort.jpeg" },
        { city: "MANCHESTER", image: "/manchester-escort.jpeg" },
        { city: "ESSEX", image: "/essex-escort.jpeg" },
        { city: "KENT", image: "/kent-escort.jpeg" },
        // Add more locations
    ];

    const slides = [
        {
            type: 'image',
            src: '/hero-image.jpeg', // Ensure this image exists in /public
            alt: 'Attractive background showing a cityscape or luxury setting'
            // Text/buttons for this slide are hardcoded within HeroSlideshow component's 'image' type block
        },
        {
            type: 'promo',
            // Define the specific text for the promo slide here
            title: "Stand Out as 'Available Now'",
            subtitle: "Increase your bookings with real-time availability, affordable at just £2 per day.",
            // The image (/available_now.png) and CTA are handled within the 'promo' block in HeroSlideshow
        }
        // Add more slides here if needed, alternating types
    ];

    return (
        <>
            <header className="relative z-30">
                {/* Ensure Navbar and its dependencies (routes, getActiveRoute) work correctly */}
                <Navbar brandText={getActiveRoute(routes, pathname)} />
            </header>

            {/* Use flex-grow to ensure main content takes available space */}
            <main className="flex-grow">
                {/* Pass defined data as props to the slideshow */}
                <HeroSlideshow slides={slides} categories={categories} />

                {/* Popular Locations Section */}
                <section aria-label="Popular Locations" className="container mx-auto px-4 md:px-16 lg:px-32 py-12 sm:py-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
                        Most Searched Locations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {locations.map((location) => (
                            <LocationCard
                                key={location.city} // Use city as key assuming it's unique
                                city={location.city}
                                imagePath={location.image} // Ensure these images exist in /public
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Add Footer component here if needed */}
            {/* <Footer /> */}
        </>
    );
}