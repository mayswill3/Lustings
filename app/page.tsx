import DashboardClient from '@/components/dashboard/client';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

export default async function DashboardPage() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  return <DashboardClient user={user} userDetails={userDetails} />;
}