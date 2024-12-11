// Preferences.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart } from 'lucide-react';

interface PreferencesProps {
    userDetails: any;
}

const FormField = ({ label, name, type = "text", defaultValue = '', placeholder = '' }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <Input
            type={type}
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full"
        />
    </div>
);

const SelectField = ({ label, name, options, defaultValue = '' }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <select
            name={name}
            defaultValue={defaultValue}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
        >
            <option value="">Select option</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export const Preferences: React.FC<PreferencesProps> = ({ userDetails }) => {
    return (
        <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences & Experiences</h2>
            </div>

            <div className="grid gap-6">
                <SelectField
                    label="Preferred time of day"
                    name="preferredTime"
                    options={['Morning', 'Afternoon', 'Evening', 'Night']}
                    defaultValue={userDetails?.preferred_time}
                />

                <SelectField
                    label="Attraction preferences"
                    name="attractionPreference"
                    options={[
                        'Personality',
                        'Intelligence',
                        'Sense of humor',
                        'Confidence',
                        'Kindness',
                        'Ambition'
                    ]}
                    defaultValue={userDetails?.attraction_preference}
                />

                <FormField
                    label="What makes a memorable experience?"
                    name="memorableExperience"
                    placeholder="Share what creates special moments for you"
                    defaultValue={userDetails?.memorable_experience}
                />

                <FormField
                    label="Ideal location for a date"
                    name="idealLocation"
                    placeholder="Describe your perfect setting"
                    defaultValue={userDetails?.ideal_location}
                />

                <SelectField
                    label="What matters most to you?"
                    name="priority"
                    options={[
                        'Emotional connection',
                        'Communication',
                        'Trust',
                        'Respect',
                        'Understanding',
                        'Companionship'
                    ]}
                    defaultValue={userDetails?.priority}
                />

                <FormField
                    label="Your perfect evening would include..."
                    name="perfectEvening"
                    placeholder="Describe your ideal evening"
                    defaultValue={userDetails?.perfect_evening}
                />

                <SelectField
                    label="Energy level preference"
                    name="energyLevel"
                    options={[
                        'Very relaxed',
                        'Balanced',
                        'Active',
                        'Very energetic'
                    ]}
                    defaultValue={userDetails?.energy_level}
                />

                <FormField
                    label="What type of personality attracts you?"
                    name="attractivePersonality"
                    placeholder="Describe personality traits you admire"
                    defaultValue={userDetails?.attractive_personality}
                />
            </div>
        </Card>
    );
};