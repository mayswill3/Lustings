// utils/availability.ts
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

const supabase = createClient();

// Helper to get end of current day
function getEndOfDay() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

export async function setAvailability(userId: string, isAvailable: boolean) {
  if (!isAvailable) {
    // Remove availability status
    const { error } = await supabase
      .from('availability_status')
      .delete()
      .eq('user_id', userId)
      .eq('booking_date', format(new Date(), 'yyyy-MM-dd'));

    if (error) throw error;
    return null;
  }

  // Remove any existing status first for today
  await supabase
    .from('availability_status')
    .delete()
    .eq('user_id', userId)
    .eq('booking_date', format(new Date(), 'yyyy-MM-dd'));

  // Insert new status
  const { data, error } = await supabase.from('availability_status').insert({
    user_id: userId,
    booking_date: format(new Date(), 'yyyy-MM-dd'),
    status_start: new Date().toISOString(),
    status_end: getEndOfDay().toISOString()
  });

  if (error) throw error;
  return data;
}

export async function checkAvailability(userId: string) {
  const { data, error } = await supabase
    .from('availability_status')
    .select('*')
    .eq('user_id', userId)
    .eq('booking_date', format(new Date(), 'yyyy-MM-dd'))
    .gte('status_end', new Date().toISOString())
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}
