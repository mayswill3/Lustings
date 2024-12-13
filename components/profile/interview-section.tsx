// components/profile/interview-section.tsx
import { User2, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface InterviewSectionProps {
    userDetails: {
        about_you?: {
            [key: string]: string | undefined;
        };
    };
}

interface InterviewBlockProps {
    title: string;
    icon: any;
    data: Array<{ label: string; value: any }>;
    columns?: 2 | 3;
}

const InterviewBlock = ({ title, icon: Icon, data, columns = 2 }: InterviewBlockProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Icon className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
                {data
                    .filter(item => item.value)
                    .map((item, index) => (
                        <div key={index} className="grid grid-cols-2 gap-x-4">
                            <span className="text-sm text-gray-500">{item.label}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.value}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export const InterviewSection = ({ userDetails }: InterviewSectionProps) => {
    return (
        <Card className="p-6">
            <div className="space-y-8">
                {/* Physical Measurements */}
                <InterviewBlock
                    title="Physical Measurements"
                    icon={User2}
                    data={[
                        { label: "Height", value: userDetails.about_you?.height },
                        { label: "Weight", value: userDetails.about_you?.weight },
                        { label: "Chest", value: userDetails.about_you?.chest },
                        { label: "Waist", value: userDetails.about_you?.waist },
                        { label: "Hips", value: userDetails.about_you?.hips },
                        { label: "Leg Measurement", value: userDetails.about_you?.leg_measurement },
                        { label: "Shoe Size", value: userDetails.about_you?.shoe_size },
                        { label: "Dress Size", value: userDetails.about_you?.dress_size },
                        { label: "Bra Cup Size", value: userDetails.about_you?.bra_cup_size }
                    ]}
                    columns={3}
                />

                {/* Physical Characteristics */}
                <InterviewBlock
                    title="Physical Characteristics"
                    icon={User2}
                    data={[
                        { label: "Body Type", value: userDetails.about_you?.body_type },
                        { label: "Self Body Type", value: userDetails.about_you?.self_body_type },
                        { label: "Ethnicity", value: userDetails.about_you?.ethnicity },
                        { label: "Self Ethnicity", value: userDetails.about_you?.self_ethnicity },
                        { label: "Hair Color", value: userDetails.about_you?.hair_color },
                        { label: "Self Hair Color", value: userDetails.about_you?.self_hair_color },
                        { label: "Hair Length", value: userDetails.about_you?.hair_length },
                        { label: "Eye Color", value: userDetails.about_you?.eye_color },
                        { label: "Breast Size", value: userDetails.about_you?.breast_size },
                        { label: "Self Chest Size", value: userDetails.about_you?.self_chest_size },
                        { label: "Breast Type", value: userDetails.about_you?.breast_type },
                        { label: "Pubic Hair", value: userDetails.about_you?.pubic_hair },
                        { label: "Self Pubic Hair", value: userDetails.about_you?.self_pubic_hair }
                    ]}
                />

                {/* Personal Details */}
                <InterviewBlock
                    title="Personal Details"
                    icon={Heart}
                    data={[
                        { label: "Star Sign", value: userDetails.about_you?.star_sign },
                        { label: "Age Group", value: userDetails.about_you?.age_group },
                        { label: "Primary Language", value: userDetails.about_you?.primary_language },
                        { label: "Secondary Language", value: userDetails.about_you?.secondary_language },
                        { label: "Non Binary Gender", value: userDetails.about_you?.non_binary_gender },
                        { label: "Smoking", value: userDetails.about_you?.smoking },
                        { label: "Body Art", value: userDetails.about_you?.body_art },
                        { label: "Body Art Visibility", value: userDetails.about_you?.body_art_visibility },
                        { label: "Birth Marks/Scars", value: userDetails.about_you?.birth_marks_scars }
                    ]}
                />

                {/* Personality & Preferences */}
                <InterviewBlock
                    title="Personality & Preferences"
                    icon={User2}
                    data={[
                        { label: "Personality Trait", value: userDetails.about_you?.personality_trait },
                        { label: "Personality Words", value: userDetails.about_you?.personality_words },
                        { label: "Humor Type", value: userDetails.about_you?.humor_type },
                        { label: "Energy Level", value: userDetails.about_you?.energy_level },
                        { label: "Sexual Leaning", value: userDetails.about_you?.sexual_leaning },
                        { label: "Priority", value: userDetails.about_you?.priority },
                        { label: "Preferred Time", value: userDetails.about_you?.preferred_time },
                        { label: "Attraction Preference", value: userDetails.about_you?.attraction_preference }
                    ]}
                />

                {/* Intimate Details */}
                <InterviewBlock
                    title="Intimate Details"
                    icon={Heart}
                    data={[
                        { label: "Turn Ons", value: userDetails.about_you?.turn_ons },
                        { label: "Fantasy", value: userDetails.about_you?.fantasy },
                        { label: "Sensitive Spots", value: userDetails.about_you?.sensitive_spots },
                        { label: "Ideal Location", value: userDetails.about_you?.ideal_location },
                        { label: "Ideal Location Intimate", value: userDetails.about_you?.ideal_location_intimate },
                        { label: "Favourite Position", value: userDetails.about_you?.favourite_position },
                        { label: "Second Favourite Position", value: userDetails.about_you?.second_favourite_position },
                        { label: "Peak Libido", value: userDetails.about_you?.peak_libido },
                        { label: "Masturbation Frequency", value: userDetails.about_you?.masturbation_frequency },
                        { label: "Memorable Experience", value: userDetails.about_you?.memorable_experience },
                        { label: "Perfect Evening", value: userDetails.about_you?.perfect_evening }
                    ]}
                />

                {/* Favorites */}
                <InterviewBlock
                    title="Favorites"
                    icon={Heart}
                    data={[
                        { label: "Food", value: userDetails.about_you?.favourite_food },
                        { label: "Drink", value: userDetails.about_you?.favourite_drink },
                        { label: "Film", value: userDetails.about_you?.favourite_film },
                        { label: "TV Show", value: userDetails.about_you?.favourite_tv },
                        { label: "Celebrity", value: userDetails.about_you?.favourite_celebrity },
                        { label: "Colour", value: userDetails.about_you?.favourite_colour },
                        { label: "Holiday", value: userDetails.about_you?.favourite_holiday },
                        { label: "Flowers", value: userDetails.about_you?.favourite_flowers },
                        { label: "Perfume", value: userDetails.about_you?.favourite_perfume },
                        { label: "Gift", value: userDetails.about_you?.favourite_gift }
                    ]}
                />
            </div>
        </Card>
    );
};

export default InterviewSection;