// constants/physical.ts

export const PHYSICAL_OPTIONS = {
  ETHNICITY: [
    'Arabic',
    'Asian',
    'Black',
    'Caucasian (White)',
    'Chinese',
    'Indian',
    'Latin',
    'Mixed',
    'Other'
  ],
  EYE_COLOR: ['Blue', 'Brown', 'Green', 'Hazel', 'Pink', 'Grey'],
  HAIR_COLOR: [
    'Blonde',
    'Brown',
    'Black',
    'Grey',
    'Red',
    'Strawberry Blonde',
    'Red Brown'
  ],
  HAIR_LENGTH: ['Short', 'Medium', 'Long', 'Shoulder length', 'Bobbed'],
  BODY_TYPE: [
    'Small',
    'Slim',
    'Average',
    'Athletic',
    'Muscular',
    'Curvy',
    'Few Extra Pounds',
    'Heavy Set'
  ],
  HEIGHT: Array.from({ length: 35 }, (_, i) => {
    const feet = Math.floor((i + 44) / 12);
    const inches = (i + 44) % 12;
    return `${feet}'${inches}"`;
  }),
  WEIGHT: Array.from({ length: 17 }, (_, i) => `${7 + i / 2}st`).concat([
    '15st+'
  ]),
  LEG: Array.from({ length: 12 }, (_, i) => `${24 + i}"`),
  SHOE_SIZE: [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '12.5',
    '13'
  ],
  DRESS_SIZE: ['4', '6', '8', '10', '12', '14', '16', '18+'],
  CHEST: Array.from({ length: 10 }, (_, i) => `${26 + i * 2}"`).concat([
    '44"+'
  ]),
  WAIST: Array.from({ length: 14 }, (_, i) => `${24 + i * 2}"`).concat([
    '50"+'
  ]),
  HIPS: Array.from({ length: 14 }, (_, i) => `${24 + i * 2}"`).concat(['50"+']),
  BRA_CUP: [
    'AA',
    'A',
    'B',
    'C',
    'DD',
    'E',
    'EE',
    'F',
    'FF',
    'G',
    'GG',
    'H',
    'HH',
    'J',
    'JJ',
    'K',
    'KK',
    'L'
  ],
  BREAST_SIZE: ['Small', 'Medium', 'Large', 'Very Large'],
  PUBIC_HAIR: [
    'Natural',
    'Trimmed',
    'Shaved Mostly',
    'Brazilian',
    'Shaved Completely'
  ],
  BREAST_TYPE: ['Natural', 'Enhanced', 'N/A'],
  SMOKING: ['Yes', 'No', 'Socially', 'N/A'],
  BODY_ART: ['Tattoos', 'Piercings', 'Both', 'Neither', 'N/A'],
  BODY_ART_VISIBILITY: [
    'Very Discrete',
    'Discrete',
    'Partially Visible',
    'Visible',
    'Blatant',
    'None',
    'N/A'
  ]
} as const;

// Type definitions
export type PhysicalOptionKeys = keyof typeof PHYSICAL_OPTIONS;
export type PhysicalOptionValues<K extends PhysicalOptionKeys> =
  (typeof PHYSICAL_OPTIONS)[K][number];

// Helper types for component props
export interface SelectFieldProps {
  label: string;
  name: string;
  options: readonly string[];
  value?: string;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  options: readonly string[];
  value?: string;
}

export default PHYSICAL_OPTIONS;
