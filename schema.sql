/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
    -- UUID from auth.users
    id uuid references auth.users not null primary key,
    
    -- Basic user information
    full_name text,
    email text,
    avatar_url text,
    phone_number text,
    nationality text,
    member_type text,
    
    -- Credits system
    credits bigint default 0,
    trial_credits bigint default 3,
    
    -- JSON stored objects
    billing_address jsonb,
    payment_method jsonb,
    location jsonb,
    privacy jsonb,
    preferences jsonb,
    personal_details jsonb,
    profile_pictures jsonb,
    free_gallery jsonb,
    private_gallery jsonb,
    about_you jsonb,
    faqs jsonb default '[]'::jsonb,
    
    -- Text content
    summary text,
    details text,
    
    -- Arrays
    services text[] default array[]::text[],
    
    -- Timestamps
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable row-level security
alter table users enable row level security;

-- Policy: Users can view their own data
create policy "Can view own user data." 
on users 
for select 
using (auth.uid() = id);

-- Policy: Users can update their own data
create policy "Can update own user data." 
on users 
for update 
using (auth.uid() = id)
with check (
  auth.uid() = id
);

-- Trigger: Automatically update `updated_at` timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at
before update on users
for each row
execute function update_updated_at_column();

 
/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Modify availability_status table to support multiple days
create table if not exists public.availability_status (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    status_start timestamp with time zone not null,
    status_end timestamp with time zone not null,
    created_at timestamp with time zone default now(),
    booking_date date not null, -- Added to track specific dates
    constraint unique_user_date unique (user_id, booking_date) -- Changed constraint to allow multiple days
);

create index on public.availability_status (user_id);
create index on public.availability_status (status_end);
create index on public.availability_status (booking_date);

-- Add comment to table
comment on table public.availability_status is 'Tracks when escorts are available for bookings';

CREATE TABLE featured_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_date DATE NOT NULL,
  feature_start TIMESTAMP WITH TIME ZONE NOT NULL,
  feature_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, feature_date)
);

CREATE INDEX idx_featured_profiles_user_id ON featured_profiles(user_id);
CREATE INDEX idx_featured_profiles_feature_date ON featured_profiles(feature_date);

create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  nickname text,
  first_name text,
  last_name text,
  contact_number text,
  contact_date date,
  time_start text,
  time_end text,
  duration integer,
  overnight boolean,
  meeting_type text,
  proposed_fee decimal,
  address1 text,
  address2 text,
  town text,
  county text,
  post_code text,
  comments text,
  sender_id text,
  sender_email: text,
  recipient_id text,
  recipient_email text,
  recipient_nickname text,
  status text,
  created_at timestamp with time zone default now()
);

-- Allow users to see bookings made to them
CREATE POLICY "Users can view bookings made to them"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update status of bookings made to them
CREATE POLICY "Users can update status of bookings made to them"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_auth_user_email
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_user_email();

CREATE TABLE feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    sender_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    feedback_type VARCHAR(10) CHECK (feedback_type IN ('positive', 'neutral', 'negative')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(booking_id, sender_id) -- Ensures one feedback per booking per sender
);

ALTER TABLE feedbacks
DROP CONSTRAINT IF EXISTS feedbacks_booking_id_sender_id_key;

-- And add a new constraint that ensures one feedback per role per booking
ALTER TABLE feedbacks
ADD CONSTRAINT one_feedback_per_role 
UNIQUE (booking_id, sender_id, recipient_id);

ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'accepted', 'declined', 'completed'));

-- Create the stored procedure for adding credits
create or replace function add_credits(user_id uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update users
  set credits = credits + amount
  where id = user_id;
end;
$$;

-- Drop the existing function if it exists
drop function if exists increment_credits;

-- Create the increment_credits function
create or replace function increment_credits(user_id uuid, increment_amount int)
returns int
language plpgsql
as $$
declare
    current_credits int;
begin
    -- Get current credits
    select COALESCE(credits, 0) into current_credits 
    from users 
    where id = user_id;

    -- Return new credit amount
    return current_credits + increment_amount;
end;
$$;

create table verification (
    id uuid references users(id) primary key,  -- Assuming you want to link it to the user's ID
    files text[],  -- Store the URLs of uploaded files
    is_british boolean,  -- Store British citizenship status
    verification_number integer,  -- Store the verification number
    verified boolean default false,  -- Track if the user is verified
    images_submitted boolean default false,  -- Track if all images have been submitted
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/** 
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  id text primary key,
  -- Whether the product is currently available for purchase.
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products, 
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  -- The status of the subscription object, one of subscription_status type above.
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  -- ID of the price that created this subscription.
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);
-- create policy "Allow subscriber to update credits" on subscriptions for update using (auth.uid() = id) with check ( exists ( 
--     SELECT 1 FROM subscriptions
--     WHERE subscriptions.user_id = users.id
--       AND subscriptions.status = 'active' )
-- );

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;
