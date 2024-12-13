// components/profile/profile-header.tsx
import { Phone, MapPin, Calendar, User2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
    userDetails: any;
    showMobile: boolean;
    setShowMobile: (show: boolean) => void;
    calculateAge: (dob: string) => number | null;
}

export const ProfileHeader = ({ userDetails, showMobile, setShowMobile, calculateAge }: ProfileHeaderProps) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userDetails.full_name}
                </h1>
                <div>
                    {showMobile ? (
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-md">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">
                                {userDetails.phone_number || '07123 456789'}
                            </span>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setShowMobile(true)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            View Mobile Number
                        </Button>
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
            <div className="grid grid-cols-3 gap-4">
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
            </div>
        </div>
    );
};