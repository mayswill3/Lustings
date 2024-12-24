// hooks/useBookings.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  // Fetch all bookings for the current user
  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  // Real-time subscription for both sent and received bookings
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `or(recipient_id.eq.${user.id},sender_id.eq.${user.id})`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleStatusChange = async (
    bookingId: string,
    newStatus: 'accepted' | 'declined'
  ) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .eq('recipient_id', user.id)
        .select();

      if (error) throw error;

      // Handle email notification
      if (data[0].sender_email) {
        await handleEmailNotification(data[0], 'update');
      }

      fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleEmailNotification = async (
    bookingDetails: any,
    type: 'new' | 'update'
  ) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: bookingDetails.sender_email,
          bookingDetails,
          type
        })
      });

      if (!response.ok) {
        console.error('Failed to send email notification');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return {
    bookings,
    loading,
    error,
    user,
    handleStatusChange,
    handleEmailNotification,
    fetchBookings
  };
};
