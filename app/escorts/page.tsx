'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { EscortCard } from '@/components/escort-card/EscortCard';
import { Input } from "@/components/ui/input";
import { Search, UserX } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { NATIONALITIES } from '@/constants/nationalities';
import PHYSICAL_OPTIONS from '@/constants/physical';
import GENDERS from '@/constants/gender';
import AGE_RANGES from '@/constants/age-ranges';
import BOOKING_LENGTHS from '@/constants/booking-length';
import ActivityMultiSelect from '@/components/search/ActivityMultiSelect';
import { calculateDistance, DISTANCE_OPTIONS } from '@/utils/location';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: { [x: string]: any } | null;
}

export default function EscortGrid(props: Props) {
    const [escorts, setEscorts] = useState([]);
    const [availableEscorts, setAvailableEscorts] = useState(new Set());
    const [featuredEscorts, setFeaturedEscorts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    const [selectedCallType, setSelectedCallType] = useState('');
    const [selectedBookingLength, setSelectedBookingLength] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('');
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

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

    const filteredEscorts = escorts.filter((escort) => {
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
                        escortActivity.toLowerCase() === activity.toLowerCase() // Case-insensitive match
                )
            )
            : true;
        return (
            matchesName &&
            matchesGender &&
            matchesEthnicity &&
            matchesAge &&
            matchesCallType &&
            matchesBookingLength &&
            matchesNationality &&
            matchesActivities
        );
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGender('');
        setSelectedAge('');
        setSelectedEthnicity('');
        setSelectedCallType('');
        setSelectedBookingLength('');
        setSelectedNationality('');
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>;
    }

    return (
        <DashboardLayout user={props.user} userDetails={props.userDetails} title="All Escorts" description="Browse all available escorts">
            <div className="container mx-auto px-4 py-8">
                <Card className="mb-6 p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                        <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="border rounded-md px-4 py-2">
                            <option value="">All Genders</option>
                            {GENDERS.map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                            ))}
                        </select>
                        <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="border rounded-md px-4 py-2">
                            <option value="">Age</option>
                            {AGE_RANGES.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                        <select value={selectedEthnicity} onChange={(e) => setSelectedEthnicity(e.target.value)} className="border rounded-md px-4 py-2">
                            <option value="">Ethnicity</option>
                            {PHYSICAL_OPTIONS.ETHNICITY.map((ethnicity) => (
                                <option key={ethnicity} value={ethnicity}>
                                    {ethnicity}
                                </option>
                            ))}
                        </select>
                        <select value={selectedNationality} onChange={(e) => setSelectedNationality(e.target.value)} className="border rounded-md px-4 py-2">
                            <option value="">Select Nationality</option>
                            {NATIONALITIES.map((nation) => (
                                <option key={nation} value={nation}>
                                    {nation}
                                </option>
                            ))}
                        </select>
                        <select value={selectedBookingLength} onChange={(e) => setSelectedBookingLength(e.target.value)} className="border rounded-md px-4 py-2">
                            <option value="">Booking Length</option>
                            {BOOKING_LENGTHS.map((length) => (
                                <option key={length.value} value={length.value}>
                                    {length.label}
                                </option>
                            ))}
                        </select>
                        <ActivityMultiSelect
                            selectedActivities={selectedActivities}
                            setSelectedActivities={setSelectedActivities}
                        />
                        <button onClick={clearFilters} className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition">
                            Clear Filters
                        </button>
                    </div>
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
