// components/profile/profile-overview.tsx
import { User2, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProfileOverviewProps {
    userDetails: {
        nationality?: string;
        about_you?: {
            ethnicity?: string;
            height?: string;
            dress_size?: string;
            chest?: string;
            bra_cup_size?: string;
            breast_type?: string;
            hair_color?: string;
            hair_length?: string;
            eye_color?: string;
            pubic_hair?: string;
        };
        personal_details?: {
            with?: string[];
            activities?: string[];
        };
    };
}

export const ProfileOverview = ({ userDetails }: ProfileOverviewProps) => {
    return (
        <div className="space-y-6">
            {/* Overview Card */}
            <Card className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <User2 className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overview</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {/* I'm Into Section */}
                        <div className="col-span-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    I'm Into
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {userDetails.personal_details?.with?.join(', ') || 'Not Specified'}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        {[
                            { label: "Nationality", value: userDetails.nationality },
                            { label: "Ethnicity", value: userDetails.about_you?.ethnicity },
                            { label: "Dress Size", value: userDetails.about_you?.dress_size },
                            { label: "Height", value: userDetails.about_you?.height },
                            { label: "Hair Colour", value: userDetails.about_you?.hair_color },
                            { label: "Hair Length", value: userDetails.about_you?.hair_length },
                            { label: "Eye Colour", value: userDetails.about_you?.eye_color },
                            { label: "Pubic Hair", value: userDetails.about_you?.pubic_hair }
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.label}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.value || 'Not Specified'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Activities Card */}
            {userDetails.personal_details?.activities && userDetails.personal_details.activities.length > 0 && (
                <Card className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {userDetails.personal_details.activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm text-gray-700 dark:text-gray-300 text-center"
                                >
                                    {activity}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProfileOverview;