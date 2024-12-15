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
    const formFields = [
        { name: 'starSign', label: 'Star Sign', type: 'select', options: STAR_SIGNS },
        { name: 'primaryLanguage', label: 'Primary Language', type: 'select', options: LANGUAGES },
        { name: 'favouriteColour', label: 'Favourite Colour', type: 'input' },
        { name: 'favouriteCelebrity', label: 'Favourite Celebrity', type: 'input' },
        { name: 'bestFeature', label: 'Best Feature', type: 'input' },
        { name: 'worstFeature', label: 'Worst Feature', type: 'input' },
        { name: 'personalityWords', label: 'Three Words That Describe You', type: 'input' },
        { name: 'favouriteFood', label: 'Favourite Food', type: 'input' },
        { name: 'favouriteDrink', label: 'Favourite Drink', type: 'input' },
        { name: 'favouriteFilm', label: 'Favourite Film', type: 'input' },
        { name: 'favouriteTv', label: 'Favourite TV Show', type: 'input' },
        { name: 'favouriteFlowers', label: 'Favourite Flowers', type: 'input' },
        { name: 'favouritePerfume', label: 'Favourite Perfume', type: 'input' },
        { name: 'favouriteGift', label: 'Favourite Gift', type: 'input' },
        { name: 'favouriteHoliday', label: 'Favourite Holiday Destination', type: 'input' },
    ];

    const renderField = (field: any) => (
        <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
            </label>
            {field.type === 'select' ? (
                <select
                    name={field.name}
                    defaultValue={userDetails?.[field.name] || ''}
                    className="w-full h-9 sm:h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
                >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            ) : (
                <Input
                    type="text"
                    name={field.name}
                    defaultValue={userDetails?.[field.name] || ''}
                    className="w-full h-9 sm:h-10"
                />
            )}
        </div>
    );

    return (
        <Card className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-4">
                {formFields.map(field => renderField(field))}
            </div>
        </Card>
    );
};