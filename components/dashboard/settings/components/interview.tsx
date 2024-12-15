'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { PersonalInfo } from './interview/persoanl-info';
import { PhysicalCharacteristics } from './interview/physical-char';
import { Preferences } from './interview/preferences';
import { SelfDescription } from './interview/self-description';
import { User2, Heart, User, Settings } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/collapsible-section';

const supabase = createClient();

export default function AboutYou() {
    const [userDetails, setUserDetails] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error('Error fetching user:', userError);
                    return;
                }

                const { data: details, error: detailsError } = await supabase
                    .from('users')
                    .select('about_you, full_name')
                    .eq('id', user.id)
                    .single();

                if (detailsError) {
                    console.error('Error fetching user details:', detailsError);
                    return;
                }

                setUserDetails({
                    ...details?.about_you,
                    full_name: details?.full_name || '',
                });
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const aboutYou = {
            // Personal Info
            star_sign: formData.get('starSign'),
            primary_language: formData.get('primaryLanguage'),
            secondary_language: formData.get('secondaryLanguage'),
            non_binary_gender: formData.get('nonBinaryGender'),
            favourite_colour: formData.get('favouriteColour'),
            favourite_celebrity: formData.get('favouriteCelebrity'),
            best_feature: formData.get('bestFeature'),
            worst_feature: formData.get('worstFeature'),
            personality_words: formData.get('personalityWords'),
            favourite_food: formData.get('favouriteFood'),
            favourite_drink: formData.get('favouriteDrink'),
            favourite_film: formData.get('favouriteFilm'),
            favourite_tv: formData.get('favouriteTv'),
            favourite_flowers: formData.get('favouriteFlowers'),
            favourite_perfume: formData.get('favouritePerfume'),
            favourite_gift: formData.get('favouriteGift'),
            favourite_holiday: formData.get('favouriteHoliday'),

            // Physical Characteristics
            ethnicity: formData.get('ethnicity'),
            eye_color: formData.get('eyeColor'),
            hair_color: formData.get('hairColor'),
            hair_length: formData.get('hairLength'),
            body_type: formData.get('bodyType'),
            height: formData.get('height'),
            weight: formData.get('weight'),
            leg_measurement: formData.get('legMeasurement'),
            shoe_size: formData.get('shoeSize'),
            dress_size: formData.get('dressSize'),
            chest: formData.get('chest'),
            waist: formData.get('waist'),
            hips: formData.get('hips'),
            bra_cup_size: formData.get('braCupSize'),
            breast_size: formData.get('breastSize'),
            breast_type: formData.get('breastType'),
            pubic_hair: formData.get('pubicHair'),
            smoking: formData.get('smoking'),
            body_art: formData.get('bodyArt'),
            body_art_visibility: formData.get('bodyArtVisibility'),
            birth_marks_scars: formData.get('birthMarksScars'),

            // Preferences & Experiences
            preferred_time: formData.get('preferredTime'),
            attraction_preference: formData.get('attractionPreference'),
            memorable_experience: formData.get('memorableExperience'),
            ideal_location: formData.get('idealLocation'),
            priority: formData.get('priority'),
            perfect_evening: formData.get('perfectEvening'),
            energy_level: formData.get('energyLevel'),
            attractive_personality: formData.get('attractivePersonality'),

            // Self Description
            self_ethnicity: formData.get('selfEthnicity'),
            self_body_type: formData.get('selfBodyType'),
            self_hair_color: formData.get('selfHairColor'),
            self_chest_size: formData.get('selfChestSize'),
            self_pubic_hair: formData.get('selfPubicHair'),
            sexual_leaning: formData.get('sexualLeaning'),
            age_group: formData.get('ageGroup'),
            humor_type: formData.get('humorType'),
            personality_trait: formData.get('personalityTrait'),

            // Additional Intimate Preferences
            turn_ons: formData.get('turnOns'),
            sensitive_spots: formData.get('sensitiveSpots'),
            favourite_position: formData.get('favouritePosition'),
            second_favourite_position: formData.get('secondFavouritePosition'),
            fantasy: formData.get('fantasy'),
            ideal_location_intimate: formData.get('idealLocationIntimate'),
            masturbation_frequency: formData.get('masturbationFrequency'),
            preferred_activity: formData.get('preferredActivity'),
            peak_libido: formData.get('peakLibido')
        };

        try {
            const { error } = await supabase
                .from('users')
                .update({ about_you: aboutYou })
                .eq('id', (await supabase.auth.getUser()).data.user?.id);

            if (error) throw error;
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }

        setIsSubmitting(false);
    };

    if (!userDetails) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <CollapsibleSection
                    title="Personal Information"
                    icon={<User2 size={24} />}
                >
                    <PersonalInfo userDetails={userDetails} />
                </CollapsibleSection>

                <CollapsibleSection
                    title="Physical Characteristics"
                    icon={<Settings size={24} />}
                >
                    <PhysicalCharacteristics userDetails={userDetails} />
                </CollapsibleSection>

                <CollapsibleSection
                    title="Preferences & Experiences"
                    icon={<Heart size={24} />}
                >
                    <Preferences userDetails={userDetails} />
                </CollapsibleSection>

                <CollapsibleSection
                    title="Self Description"
                    icon={<User size={24} />}
                >
                    <SelfDescription userDetails={userDetails} />
                </CollapsibleSection>

                <div className="sticky bottom-4 z-10 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            onClick={async () => {
                                setIsSubmitting(true);
                                const form = document.querySelector('form') as HTMLFormElement;
                                if (form) {
                                    form.requestSubmit();
                                }
                                setTimeout(() => {
                                    setIsSubmitting(false);
                                    const fullName = userDetails?.full_name || '';
                                    window.location.href = `/profile/${encodeURIComponent(fullName)}`;
                                }, 1000);
                            }}
                            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base flex justify-center items-center gap-2"
                            disabled={isSubmitting}
                        >
                            Save and View Profile
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}