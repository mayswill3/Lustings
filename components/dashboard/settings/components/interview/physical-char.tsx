// components/PhysicalCharacteristics.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PHYSICAL_OPTIONS, { SelectFieldProps, RadioGroupProps } from '@/constants/physical';

interface PhysicalCharacteristicsProps {
    userDetails: any;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, options, value = '' }) => (
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

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value = '' }) => (
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
        <Card className="p-3 sm:p-6 shadow-sm">
            <div className="grid gap-4 sm:gap-6">
                {/* Basic Characteristics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <SelectField
                        label="Weight"
                        name="weight"
                        options={PHYSICAL_OPTIONS.WEIGHT}
                        value={userDetails?.weight}
                    />
                    <SelectField
                        label="Leg"
                        name="leg"
                        options={PHYSICAL_OPTIONS.LEG}
                        value={userDetails?.leg}
                    />
                    <SelectField
                        label="Shoe Size"
                        name="shoe_size"
                        options={PHYSICAL_OPTIONS.SHOE_SIZE}
                        value={userDetails?.shoe_size}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <SelectField
                        label="Chest"
                        name="chest"
                        options={PHYSICAL_OPTIONS.CHEST}
                        value={userDetails?.chest}
                    />
                    <SelectField
                        label="Waist"
                        name="waist"
                        options={PHYSICAL_OPTIONS.WAIST}
                        value={userDetails?.waist}
                    />
                    <SelectField
                        label="Hips"
                        name="hips"
                        options={PHYSICAL_OPTIONS.HIPS}
                        value={userDetails?.hips}
                    />
                </div>

                {/* Breast Characteristics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                        options={PHYSICAL_OPTIONS.BREAST_TYPE}
                        value={userDetails?.breast_type}
                    />
                </div>

                {/* Additional Characteristics */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <SelectField
                        label="Pubic Hair Style"
                        name="pubicHair"
                        options={PHYSICAL_OPTIONS.PUBIC_HAIR}
                        value={userDetails?.pubic_hair}
                    />

                    <RadioGroup
                        label="Do you smoke?"
                        name="smoking"
                        options={PHYSICAL_OPTIONS.SMOKING}
                        value={userDetails?.smoking}
                    />

                    <RadioGroup
                        label="Tattoos or Piercings"
                        name="bodyArt"
                        options={PHYSICAL_OPTIONS.BODY_ART}
                        value={userDetails?.body_art}
                    />

                    <RadioGroup
                        label="Tattoo/Piercing Visibility"
                        name="bodyArtVisibility"
                        options={PHYSICAL_OPTIONS.BODY_ART_VISIBILITY}
                        value={userDetails?.body_art_visibility}
                    />

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Birth-marks or scars
                        </label>
                        <Input
                            type="text"
                            name="birthMarksScars"
                            defaultValue={userDetails?.birth_marks_scars || ''}
                            className="w-full h-9 sm:h-10"
                            placeholder="Describe size and location"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};