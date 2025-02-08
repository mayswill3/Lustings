'use client'

import { usePathname, useRouter } from 'next/navigation';
import { Users, Calendar } from 'lucide-react';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute } from '@/utils/navigation';
import { routes } from '@/components/routes';
import Footer from '@/components/footer/FooterAdmin';

const LocationCard = ({ city, imagePath }) => {
    const router = useRouter();

    const getFormattedUrl = (city) => {
        switch (city.toUpperCase()) {
            case 'LONDON':
                return '/escorts/Greater%20London';
            case 'MANCHESTER':
                return '/escorts/Greater%20Manchester';
            default:
                return `/escorts/${city.toLowerCase()}`;
        }
    };

    return (
        <div
            onClick={() => router.push(getFormattedUrl(city))}
            className="relative rounded-xl overflow-hidden h-64 group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
            {/* Background Image */}
            <img
                src={imagePath}
                alt={`${city} escorts`}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="relative z-10">
                    <p className="text-sm font-medium text-white/90 mb-1">Escorts in</p>
                    <h3 className="text-3xl font-bold text-white tracking-wide">{city}</h3>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </div>
    );
};


export default function DashboardClient({ user, userDetails }) {
    const router = useRouter();
    const pathname = usePathname();

    const categories = [
        { name: 'All Escorts', path: '/escorts/', icon: Users },
        { name: 'Available Today', path: '/escorts/available-today', icon: Calendar },
    ];

    const locations = [
        {
            city: "LONDON",
            image: "/london-escort.jpeg"
        },
        {
            city: "MANCHESTER",
            image: "/manchester-escort.jpeg"
        },
        {
            city: "ESSEX",
            image: "/essex-escort.jpeg"
        },
        {
            city: "KENT",
            image: "/kent-escort.jpeg"
        }
    ];


    return (
        <>
            <Navbar brandText={getActiveRoute(routes, pathname)} />
            <div className="min-h-screen flex flex-col">
                {/* Hero Section */}
                <div className="relative h-[600px] bg-black/20">
                    <img
                        src="/hero-image.jpeg"
                        alt="Hero backdrop"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
                    <div className="relative container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                                Find Your Perfect Match
                            </h1>
                            <p className="text-2xl text-white drop-shadow-lg mb-8">
                                Discover companions in your area across the United Kingdom
                            </p>
                            <div className="flex gap-4">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.path}
                                            onClick={() => router.push(category.path)}
                                            className="flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white 
                                                     text-gray-900 rounded-lg font-semibold transition-all 
                                                     duration-200 hover:shadow-lg"
                                        >
                                            <Icon className="w-5 h-5" />
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rest of the content remains the same */}
                <div className="container mx-auto px-4 md:px-32 py-8">
                    <h2 className="text-3xl font-bold text-center text-indigo-900 mb-8">
                        Most Searched locations in United Kingdom
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((location) => (
                            <LocationCard
                                key={location.city}
                                city={location.city}
                                imagePath={location.image}
                            />
                        ))}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}