// SelfDescription.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface SelfDescriptionProps {
    userDetails: any;
}

const SELF_DESCRIPTION_OPTIONS = {
    ETHNICITY: [
        'White',
        'European (Non-EU)',
        'Mixed',
        'Asian or Asian British',
        'Black or Black British',
        'Chinese'
    ],
    BODY_TYPE: [
        'Slim',
        'Fit',
        'Athletic',
        'Average',
        'Muscular',
        'Few Extra Pounds',
        'Heavy Set',
        'Stocky',
        'Obese'
    ],
    HAIR_COLOR: [
        'Blonde',
        'Brown',
        'Black',
        'Grey',
        'Red',
        'Strawberry Blonde',
        'Red Brown'
    ],
    CHEST_SIZE: [
        'Small',
        'Medium',
        'Large',
        'Very Large'
    ],
    PUBIC_HAIR: [
        'Natural',
        'Trimmed',
        'Shaved Mostly',
        'Brazilian',
        'Shaved Completely'
    ],
    SEXUAL_LEANING: [
        'Any',
        'Dominant',
        'Submissive',
        'Switch'
    ],
    AGE_GROUP: [
        'Younger',
        'Middle Aged',
        'Older'
    ],
    HUMOR_TYPE: [
        'Clever',
        'Dry',
        'Sarcastic',
        'Friendly',
        'Goofy',
        'Obscure',
        'Sadistic',
        'Slapstick',
        'Raunchy'
    ],
    PERSONALITY_TRAITS: [
        'Flirtatious',
        'Sense of Humour',
        'Intelligent',
        'Quirky',
        'Passive',
        'Assertive',
        'Sensitive',
        'Spontaneous',
        'Thoughtful'
    ]
};

const SelectField = ({ label, name, options, value = '', required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            name={name}
            defaultValue={value}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={required}
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export const SelfDescription: React.FC<SelfDescriptionProps> = ({ userDetails }) => {
    return (
        <Card className="p-6 shadow-sm">
            {/* <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
            </div> */}

            <div className="grid gap-6">
                {/* Demographics */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Ethnicity"
                        name="selfEthnicity"
                        options={SELF_DESCRIPTION_OPTIONS.ETHNICITY}
                        value={userDetails?.self_ethnicity}
                    />
                    <SelectField
                        label="Age Group"
                        name="ageGroup"
                        options={SELF_DESCRIPTION_OPTIONS.AGE_GROUP}
                        value={userDetails?.age_group}
                    />
                </div>

                {/* Physical Characteristics */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Body Type"
                        name="selfBodyType"
                        options={SELF_DESCRIPTION_OPTIONS.BODY_TYPE}
                        value={userDetails?.self_body_type}
                    />
                    <SelectField
                        label="Hair Color"
                        name="selfHairColor"
                        options={SELF_DESCRIPTION_OPTIONS.HAIR_COLOR}
                        value={userDetails?.self_hair_color}
                    />
                </div>

                {/* Physical Details */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Chest Size"
                        name="selfChestSize"
                        options={SELF_DESCRIPTION_OPTIONS.CHEST_SIZE}
                        value={userDetails?.self_chest_size}
                    />
                    <SelectField
                        label="Pubic Hair Style"
                        name="selfPubicHair"
                        options={SELF_DESCRIPTION_OPTIONS.PUBIC_HAIR}
                        value={userDetails?.self_pubic_hair}
                    />
                </div>

                {/* Preferences */}
                <SelectField
                    label="Sexual Leaning"
                    name="sexualLeaning"
                    options={SELF_DESCRIPTION_OPTIONS.SEXUAL_LEANING}
                    value={userDetails?.sexual_leaning}
                />

                {/* Personality */}
                <div className="space-y-6">
                    <SelectField
                        label="Sense of Humour"
                        name="humorType"
                        options={SELF_DESCRIPTION_OPTIONS.HUMOR_TYPE}
                        value={userDetails?.humor_type}
                    />
                    <SelectField
                        label="Best Description of You"
                        name="personalityTrait"
                        options={SELF_DESCRIPTION_OPTIONS.PERSONALITY_TRAITS}
                        value={userDetails?.personality_trait}
                    />
                </div>
            </div>
        </Card>
    );
};