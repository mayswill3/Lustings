// Preferences.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart } from 'lucide-react';

interface PreferencesProps {
    userDetails: any;
}

const FormField = ({ label, name, type = "text", defaultValue = '', placeholder = '' }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <Input
            type={type}
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full h-9 sm:h-10"
        />
    </div>
);

const SelectField = ({ label, name, options, defaultValue = '' }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <select
            name={name}
            defaultValue={defaultValue}
            className="w-full h-9 sm:h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
        >
            <option value="">Select option</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);



export const Preferences: React.FC<PreferencesProps> = ({ userDetails }) => {
    const formFields = [
        {
            type: 'select',
            label: "Preferred time of day",
            name: "preferredTime",
            options: ['Morning', 'Afternoon', 'Evening', 'Night'],
            defaultValue: userDetails?.preferred_time
        },
        {
            type: 'select',
            label: "Attraction preferences",
            name: "attractionPreference",
            options: [
                'Personality',
                'Intelligence',
                'Sense of humor',
                'Confidence',
                'Kindness',
                'Ambition'
            ],
            defaultValue: userDetails?.attraction_preference
        },
        {
            type: 'input',
            label: "What makes a memorable experience?",
            name: "memorableExperience",
            placeholder: "Share what creates special moments for you",
            defaultValue: userDetails?.memorable_experience
        },
        {
            type: 'input',
            label: "Ideal location for a date",
            name: "idealLocation",
            placeholder: "Describe your perfect setting",
            defaultValue: userDetails?.ideal_location
        },
        {
            type: 'select',
            label: "What matters most to you?",
            name: "priority",
            options: [
                'Emotional connection',
                'Communication',
                'Trust',
                'Respect',
                'Understanding',
                'Companionship'
            ],
            defaultValue: userDetails?.priority
        },
        {
            type: 'input',
            label: "Your perfect evening would include...",
            name: "perfectEvening",
            placeholder: "Describe your ideal evening",
            defaultValue: userDetails?.perfect_evening
        },
        {
            type: 'select',
            label: "Energy level preference",
            name: "energyLevel",
            options: [
                'Very relaxed',
                'Balanced',
                'Active',
                'Very energetic'
            ],
            defaultValue: userDetails?.energy_level
        },
        {
            type: 'input',
            label: "What type of personality attracts you?",
            name: "attractivePersonality",
            placeholder: "Describe personality traits you admire",
            defaultValue: userDetails?.attractive_personality
        }
    ];

    return (
        <Card className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-4">
                {formFields.map((field, index) => (
                    <div key={field.name}>
                        {field.type === 'select' ? (
                            <SelectField
                                label={field.label}
                                name={field.name}
                                options={field.options}
                                defaultValue={field.defaultValue}
                            />
                        ) : (
                            <FormField
                                label={field.label}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={field.defaultValue}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};