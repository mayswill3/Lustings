'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import Toggle from '@/components/ui/toggle';

const supabase = createClient();

interface DateListProps {
  userId: string;
}

export function AvailabilityList({ userId }: DateListProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1); // Start from tomorrow
    return {
      date,
      formatted: format(date, 'EEEE dd MMMM yyyy'),
      key: format(date, 'yyyy-MM-dd')
    };
  });

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    try {
      const { data, error } = await supabase
        .from('availability_status')
        .select('booking_date')
        .eq('user_id', userId);

      if (error) throw error;

      setSelectedDates(data.map(d => d.booking_date));
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  }

  async function updateAvailability(dateKey: string, selected: boolean) {
    try {
      setLoading(true);
      const date = new Date(dateKey);

      if (selected) {
        // Add availability
        const { error } = await supabase
          .from('availability_status')
          .insert({
            user_id: userId,
            booking_date: dateKey,
            status_start: startOfDay(date).toISOString(),
            status_end: endOfDay(date).toISOString()
          });

        if (error) throw error;
        setSelectedDates(prev => [...prev, dateKey]);
      } else {
        // Remove availability
        const { error } = await supabase
          .from('availability_status')
          .delete()
          .eq('user_id', userId)
          .eq('booking_date', dateKey);

        if (error) throw error;
        setSelectedDates(prev => prev.filter(d => d !== dateKey));
      }

      toast.success(selected ? 'Date added to availability' : 'Date removed from availability');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAll = async () => {
    try {
      setLoading(true);
      const dateData = dates.map(d => ({
        user_id: userId,
        booking_date: d.key,
        status_start: startOfDay(d.date).toISOString(),
        status_end: endOfDay(d.date).toISOString()
      }));

      const { error } = await supabase
        .from('availability_status')
        .upsert(dateData);

      if (error) throw error;
      setSelectedDates(dates.map(d => d.key));
      toast.success('All dates selected');
    } catch (error) {
      console.error('Error selecting all dates:', error);
      toast.error('Failed to select all dates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNone = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('availability_status')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setSelectedDates([]);
      toast.success('All dates cleared');
    } catch (error) {
      console.error('Error clearing dates:', error);
      toast.error('Failed to clear dates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Select Days:</h3>
        <Button
          variant="link"
          onClick={handleSelectAll}
          disabled={loading}
          className="text-purple-600 hover:text-purple-700"
        >
          Select All
        </Button>
        <Button
          variant="link"
          onClick={handleSelectNone}
          disabled={loading}
          className="text-purple-600 hover:text-purple-700"
        >
          Select None
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dates.map(({ formatted, key }) => (
          <div key={key}>
            <Toggle
              name={key}
              checked={selectedDates.includes(key)}
              onCheckedChange={(checked) => {
                updateAvailability(key, checked);
              }}
              disabled={loading}
              label={formatted}
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Selected Days: {selectedDates.length}
        </p>
      </div>
    </div>
  );
}