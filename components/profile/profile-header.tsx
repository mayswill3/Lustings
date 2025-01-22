// components/profile/profile-header.tsx
import { Phone, MapPin, Calendar, User2, Heart, CheckCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
    userDetails: any;
    showMobile: boolean;
    setShowMobile: (show: boolean) => void;
    calculateAge: (dob: string) => number | null;
    availability: Array<{
        status_start: string;
        status_end: string;
        booking_date: string;
        user_id: string;
    }>;
}

const isAvailableNow = (availability: ProfileHeaderProps['availability']) => {
    if (!availability?.length) return false;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    return availability.some(slot => {
        if (!slot || slot.booking_date !== today) return false;

        try {
            // Use the full timestamp from the database
            const startTime = new Date(slot.status_start);
            const endTime = new Date(slot.status_end);
            return now >= startTime && now <= endTime;
        } catch (error) {
            console.error('Error parsing dates:', error);
            return false;
        }
    });
};

export const ProfileHeader = ({ userDetails, showMobile, setShowMobile, calculateAge, availability = [] }: ProfileHeaderProps) => {
    const isAvailable = isAvailableNow(availability);
    return (
        <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {userDetails.full_name}
                    </h1>
                    {userDetails.verification?.verified && (
                        <Badge className="bg-blue-500 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                        </Badge>
                    )}
                    {isAvailable && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <span className="w-2 h-2 mr-1.5 bg-green-400 rounded-full"></span>
                            Available today
                        </span>
                    )}
                </div>
                <div className="min-w-[200px] lg:w-auto">
                    {isAvailable ? (
                        showMobile ? (
                            <div className="flex items-center justify-center lg:justify-end gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-md">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">
                                    {userDetails.phone_number || '07123 456789'}
                                </span>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setShowMobile(true)}
                                variant="secondary"
                                className="w-full lg:w-auto flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                View Mobile Number
                            </Button>
                        )
                    ) : (
                        <div className="flex items-center justify-center lg:justify-end gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-md">
                            <span className="text-sm text-gray-500">Currently unavailable</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Location Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>
                    {[
                        userDetails?.location?.town,
                        userDetails?.location?.county,
                        userDetails?.location?.region
                    ].filter(Boolean).join(', ')}
                </span>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {calculateAge(userDetails.personal_details?.dob)
                            ? `${calculateAge(userDetails.personal_details?.dob)} years`
                            : 'Age not provided'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <User2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {userDetails.personal_details?.gender || 'Gender not provided'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {userDetails.personal_details?.orientation || 'Not specified'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {userDetails.nationality || 'Nationality not specified'}
                    </span>
                </div>
            </div>
        </div>
    );
};