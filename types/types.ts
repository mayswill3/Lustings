import Stripe from 'stripe';
import { ComponentType, ReactNode } from 'react';

export type OpenAIModel =
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-1106-preview'
  | 'gpt-4o';

export interface TranslateBody {
  // inputLanguage: string;
  // outputLanguage: string;
  topic: string;
  paragraphs: string;
  essayType: string;
  model: OpenAIModel;
  type?: 'review' | 'refactor' | 'complexity' | 'normal';
}
export interface ChatBody {
  inputMessage: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface TranslateResponse {
  code: string;
}

export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  nationality: any;
  id: string;
  full_name: string;
  avatar_url: string | null;
  summary: string | null;
  details: string | null;
  created_at: string;
  phone_number?: string;
  profile_pictures: (string | null)[];
  free_gallery: (string | null)[];
  private_gallery: (string | null)[];
  location?: {
    town?: string;
    county?: string;
    region?: string;
  };
  personal_details: {
    dob?: string;
    gender?: string;
    orientation?: string;
    activities?: string[];
    with?: string[];
  };
  about_you?: {
    height?: string;
    weight?: string;
    chest?: string;
    waist?: string;
    hips?: string;
    leg_measurement?: string;
    shoe_size?: string;
    dress_size?: string;
    bra_cup_size?: string;
    // ... add all other about_you fields
  };
  preferences?: {
    allowSearch?: boolean;
    escorting?: {
      locationInfo?: {
        willTravel?: boolean;
        canAccommodate?: boolean;
      };
      rates?: {
        inCall?: Record<string, string>;
        outCall?: Record<string, string>;
      };
    };
  };
}

export interface ProfilePageProps {
  params: {
    full_name: string;
  };
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export interface IRoute {
  path: string;
  name: string;
  layout?: string;
  exact?: boolean;
  component?: ComponentType;
  disabled?: boolean;
  icon?: JSX.Element;
  secondary?: boolean;
  collapse?: boolean;
  items?: IRoute[];
  rightElement?: boolean;
  invisible?: boolean;
}

export interface EssayBody {
  topic: string;
  words: '300' | '200';
  essayType: '' | 'Argumentative' | 'Classic' | 'Persuasive' | 'Critique';
  model: OpenAIModel;
  apiKey?: string | undefined;
}
export interface PremiumEssayBody {
  words: string;
  topic: string;
  essayType:
    | ''
    | 'Argumentative'
    | 'Classic'
    | 'Persuasive'
    | 'Memoir'
    | 'Critique'
    | 'Compare/Contrast'
    | 'Narrative'
    | 'Descriptive'
    | 'Expository'
    | 'Cause and Effect'
    | 'Reflective'
    | 'Informative';
  tone: string;
  citation: string;
  level: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
