// PhysicalCharacteristics.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User2 } from 'lucide-react';

const PHYSICAL_OPTIONS = {
    ETHNICITY: ['Arabic', 'Asian', 'Black', 'Caucasian (White)', 'Chinese', 'Indian', 'Latin', 'Mixed', 'Other'],
    EYE_COLOR: ['Blue', 'Brown', 'Green', 'Hazel', 'Pink', 'Grey'],
    HAIR_COLOR: ['Blonde', 'Brown', 'Black', 'Grey', 'Red', 'Strawberry Blonde', 'Red Brown'],
    HAIR_LENGTH: ['Short', 'Medium', 'Long', 'Shoulder length', 'Bobbed'],
    BODY_TYPE: ['Small', 'Slim', 'Average', 'Athletic', 'Muscular', 'Curvy', 'Few Extra Pounds', 'Heavy Set'],
    HEIGHT: Array.from({ length: 35 }, (_, i) => {
        const feet = Math.floor((i + 44) / 12);
        const inches = (i + 44) % 12;
        return `${feet}'${inches}"`;
    }),
    WEIGHT: Array.from({ length: 17 }, (_, i) => `${7 + i / 2}st`).concat(['15st+']),
    LEG: Array.from({ length: 12 }, (_, i) => `${24 + i}"`),
    SHOE_SIZE: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'],
    DRESS_SIZE: ['4', '6', '8', '10', '12', '14', '16', '18+'],
    CHEST: Array.from({ length: 10 }, (_, i) => `${26 + i * 2}"`).concat(['44"+']),
    WAIST: Array.from({ length: 14 }, (_, i) => `${24 + i * 2}"`).concat(['50"+']),
    HIPS: Array.from({ length: 14 }, (_, i) => `${24 + i * 2}"`).concat(['50"+']),
    BRA_CUP: ['AA', 'A', 'B', 'C', 'DD', 'E', 'EE', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'JJ', 'K', 'KK', 'L'],
    BREAST_SIZE: ['Small', 'Medium', 'Large', 'Very Large'],
    PUBIC_HAIR: ['Natural', 'Trimmed', 'Shaved Mostly', 'Brazilian', 'Shaved Completely'],
};

interface PhysicalCharacteristicsProps {
    userDetails: any;
}

const SelectField = ({ label, name, options, value = '' }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select
            name={name}
            defaultValue={value}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
        >
            <option value="">Select {label}</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

const RadioGroup = ({ label, name, options, value = '' }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="flex flex-wrap gap-4">
            {options.map(option => (
                <label key={option} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        defaultChecked={value === option}
                        className="text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                </label>
            ))}
        </div>
    </div>
);

export const PhysicalCharacteristics: React.FC<PhysicalCharacteristicsProps> = ({ userDetails }) => {
    return (
        <Card className="p-6 shadow-sm">
            {/* <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <User2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Physical Characteristics</h2>
            </div> */}

            <div className="grid gap-6">
                {/* Basic Characteristics */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Ethnicity"
                        name="ethnicity"
                        options={PHYSICAL_OPTIONS.ETHNICITY}
                        value={userDetails?.ethnicity}
                    />
                    <SelectField
                        label="Eye Color"
                        name="eyeColor"
                        options={PHYSICAL_OPTIONS.EYE_COLOR}
                        value={userDetails?.eye_color}
                    />
                </div>

                {/* Hair Characteristics */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Hair Color"
                        name="hairColor"
                        options={PHYSICAL_OPTIONS.HAIR_COLOR}
                        value={userDetails?.hair_color}
                    />
                    <SelectField
                        label="Hair Length"
                        name="hairLength"
                        options={PHYSICAL_OPTIONS.HAIR_LENGTH}
                        value={userDetails?.hair_length}
                    />
                </div>

                {/* Body Characteristics */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <SelectField
                        label="Body Type"
                        name="bodyType"
                        options={PHYSICAL_OPTIONS.BODY_TYPE}
                        value={userDetails?.body_type}
                    />
                    <SelectField
                        label="Height"
                        name="height"
                        options={PHYSICAL_OPTIONS.HEIGHT}
                        value={userDetails?.height}
                    />
                </div>

                {/* Measurements */}
                <div className="grid sm:grid-cols-3 gap-6">
                    {['Weight', 'Leg', 'Shoe Size'].map(field => (
                        <SelectField
                            key={field}
                            label={field}
                            name={field.toLowerCase().replace(' ', '_')}
                            options={PHYSICAL_OPTIONS[field.replace(' ', '_').toUpperCase()]}
                            value={userDetails?.[field.toLowerCase().replace(' ', '_')]}
                        />
                    ))}
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {['Chest', 'Waist', 'Hips'].map(field => (
                        <SelectField
                            key={field}
                            label={field}
                            name={field.toLowerCase()}
                            options={PHYSICAL_OPTIONS[field.toUpperCase()]}
                            value={userDetails?.[field.toLowerCase()]}
                        />
                    ))}
                </div>

                {/* Breast Characteristics */}
                <div className="grid sm:grid-cols-3 gap-6">
                    <SelectField
                        label="Bra Cup Size"
                        name="braCupSize"
                        options={PHYSICAL_OPTIONS.BRA_CUP}
                        value={userDetails?.bra_cup_size}
                    />
                    <SelectField
                        label="Breast Size"
                        name="breastSize"
                        options={PHYSICAL_OPTIONS.BREAST_SIZE}
                        value={userDetails?.breast_size}
                    />
                    <RadioGroup
                        label="Breast Type"
                        name="breastType"
                        options={['Natural', 'Enhanced', 'N/A']}
                        value={userDetails?.breast_type}
                    />
                </div>

                {/* Additional Characteristics */}
                <SelectField
                    label="Pubic Hair Style"
                    name="pubicHair"
                    options={PHYSICAL_OPTIONS.PUBIC_HAIR}
                    value={userDetails?.pubic_hair}
                />

                <div className="grid gap-6">
                    <RadioGroup
                        label="Do you smoke?"
                        name="smoking"
                        options={['Yes', 'No', 'Socially', 'N/A']}
                        value={userDetails?.smoking}
                    />

                    <RadioGroup
                        label="Tattoos or Piercings"
                        name="bodyArt"
                        options={['Tattoos', 'Piercings', 'Both', 'Neither', 'N/A']}
                        value={userDetails?.body_art}
                    />

                    <RadioGroup
                        label="Tattoo/Piercing Visibility"
                        name="bodyArtVisibility"
                        options={['Very Discrete', 'Discrete', 'Partially Visible', 'Visible', 'Blatant', 'None', 'N/A']}
                        value={userDetails?.body_art_visibility}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Birth-marks or scars
                        </label>
                        <Input
                            type="text"
                            name="birthMarksScars"
                            defaultValue={userDetails?.birth_marks_scars || ''}
                            className="w-full"
                            placeholder="Describe size and location"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};