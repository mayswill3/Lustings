// PersonalInfo.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User2 } from 'lucide-react';

interface PersonalInfoProps {
    userDetails: any;
}

const STAR_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Other'
];

const GENDER_IDENTITIES = [
    'Agender', 'Androgyne', 'Bigender', 'Genderfluid', 'Genderqueer',
    'Gender Nonconforming', 'Gender Questioning', 'Gender Variant',
    'Non-binary', 'Pangender', 'Third Gender', 'Two-Spirit', 'Other'
];

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ userDetails }) => {
    return (
        <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <User2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
            </div>

            <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Star Sign</label>
                        <select
                            name="starSign"
                            defaultValue={userDetails?.star_sign || ''}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="">Select Star Sign</option>
                            {STAR_SIGNS.map(sign => (
                                <option key={sign} value={sign}>{sign}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Language</label>
                        <select
                            name="primaryLanguage"
                            defaultValue={userDetails?.primary_language || ''}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="">Select Language</option>
                            {LANGUAGES.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Favorites Section */}
                {[
                    { name: 'favouriteColour', label: 'Favourite Colour' },
                    { name: 'favouriteCelebrity', label: 'Favourite Celebrity' },
                    { name: 'bestFeature', label: 'Best Feature' },
                    { name: 'worstFeature', label: 'Worst Feature' },
                    { name: 'personalityWords', label: 'Three Words That Describe You' },
                    { name: 'favouriteFood', label: 'Favourite Food' },
                    { name: 'favouriteDrink', label: 'Favourite Drink' },
                    { name: 'favouriteFilm', label: 'Favourite Film' },
                    { name: 'favouriteTv', label: 'Favourite TV Show' },
                    { name: 'favouriteFlowers', label: 'Favourite Flowers' },
                    { name: 'favouritePerfume', label: 'Favourite Perfume' },
                    { name: 'favouriteGift', label: 'Favourite Gift' },
                    { name: 'favouriteHoliday', label: 'Favourite Holiday Destination' },
                ].map(field => (
                    <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.label}
                        </label>
                        <Input
                            type="text"
                            name={field.name}
                            defaultValue={userDetails?.[field.name] || ''}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};