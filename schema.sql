-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS sync_auth_user_email ON auth.users;
DROP FUNCTION IF EXISTS sync_user_email();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create simplified user handler function
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Single trigger for user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION public.handle_new_user();

-- USER TABLE AND POLICIES
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,  -- UUID from auth.users
    
    -- Basic user information
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    nationality TEXT,
    member_type TEXT,

    -- Credits system
    credits BIGINT DEFAULT 0,
    trial_credits BIGINT DEFAULT 3,

    -- JSON stored objects
    billing_address JSONB,
    payment_method JSONB,
    location JSONB,
    privacy JSONB,
    preferences JSONB,
    personal_details JSONB,
    profile_pictures JSONB,
    free_gallery JSONB,
    private_gallery JSONB,
    about_you JSONB,
    faqs JSONB DEFAULT '[]'::JSONB,

    -- Text content
    summary TEXT,
    details TEXT,

    -- Arrays
    services TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Can view own user data." 
ON users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Can update own user data." 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger: Automatically update `updated_at` timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sync email from auth.users to users
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

-- ADDITIONAL TABLES AND POLICIES

-- Availability Status Table
CREATE TABLE IF NOT EXISTS public.availability_status (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status_start TIMESTAMP WITH TIME ZONE NOT NULL,
    status_end TIMESTAMP WITH TIME ZONE NOT NULL,
    booking_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_date UNIQUE (user_id, booking_date)
);

CREATE INDEX idx_availability_user_id ON public.availability_status (user_id);
CREATE INDEX idx_availability_status_end ON public.availability_status (status_end);
CREATE INDEX idx_availability_booking_date ON public.availability_status (booking_date);

COMMENT ON TABLE public.availability_status IS 'Tracks when users are available for bookings';

-- Bookings Table
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    nickname TEXT,
    first_name TEXT,
    last_name TEXT,
    contact_number TEXT,
    contact_date DATE,
    time_start TEXT,
    time_end TEXT,
    duration INTEGER,
    overnight BOOLEAN,
    meeting_type TEXT,
    proposed_fee DECIMAL,
    address1 TEXT,
    address2 TEXT,
    town TEXT,
    county TEXT,
    post_code TEXT,
    comments TEXT,
    sender_id TEXT,
    sender_email TEXT,
    recipient_id TEXT,
    recipient_email TEXT,
    recipient_nickname TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies for Bookings
CREATE POLICY "Users can view bookings made to them"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update status of bookings made to them"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Feedbacks Table
CREATE TABLE feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    sender_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    feedback_type VARCHAR(10) CHECK (feedback_type IN ('positive', 'neutral', 'negative')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(booking_id, sender_id)
);

ALTER TABLE feedbacks
DROP CONSTRAINT IF EXISTS feedbacks_booking_id_sender_id_key;

ALTER TABLE feedbacks
ADD CONSTRAINT one_feedback_per_role 
UNIQUE (booking_id, sender_id, recipient_id);

-- Featured Profiles Table
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

-- Verification Table
CREATE TABLE verification (
    id UUID REFERENCES users(id) PRIMARY KEY,
    files TEXT[],
    is_british BOOLEAN,
    verification_number INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    images_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FUNCTIONS FOR CREDITS SYSTEM
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, amount INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET credits = credits + amount
  WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_credits(user_id UUID, increment_amount INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    current_credits INT;
BEGIN
    SELECT COALESCE(credits, 0) INTO current_credits 
    FROM users 
    WHERE id = user_id;

    RETURN current_credits + increment_amount;
END;
$$;
