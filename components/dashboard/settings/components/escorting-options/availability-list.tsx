'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import Toggle from '@/components/ui/toggle';
import { MultiDayConfirmationDialog } from '@/components/ui/multi-day-confirmation-dialog';

const supabase = createClient();

interface DateListProps {
  userId: string;
}

export function AvailabilityList({ userId }: DateListProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [pendingDates, setPendingDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState({ regular: 0, trial: 0 });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Generate next 14 days starting from today
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date,
      formatted: format(date, 'EEEE dd MMMM yyyy'),
      key: format(date, 'yyyy-MM-dd')
    };
  });

  useEffect(() => {
    loadAvailability();
    loadCredits();
  }, []);

  async function loadCredits() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('credits, trial_credits')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setCredits({
        regular: data.credits || 0,
        trial: data.trial_credits || 0
      });
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  }

  async function loadAvailability() {
    try {
      const { data, error } = await supabase
        .from('availability_status')
        .select('booking_date')
        .eq('user_id', userId);

      if (error) throw error;

      const availableDates = data.map(d => d.booking_date);
      setSelectedDates(availableDates);
      setPendingDates(availableDates); // Set pending dates to match current selection
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  }

  const handleDateToggle = (dateKey: string, checked: boolean) => {
    const newPendingDates = checked
      ? [...pendingDates, dateKey]
      : pendingDates.filter(d => d !== dateKey);

    setPendingDates(newPendingDates);
    setHasChanges(true);
  };

  const handleSelectAll = () => {
    const allDates = dates.map(d => d.key);
    setPendingDates(allDates);
    setHasChanges(true);
  };

  const handleSelectNone = () => {
    setPendingDates([]);
    setHasChanges(true);
  };

  const handleConfirm = async (useTrialCredits: boolean) => {
    try {
      setLoading(true);

      // Calculate changes
      const datesToAdd = pendingDates.filter(d => !selectedDates.includes(d));
      const datesToRemove = selectedDates.filter(d => !pendingDates.includes(d));

      // Calculate credits needed for new dates only (2 credits per day)
      const today = startOfDay(new Date());
      const futureDatesToAdd = datesToAdd.filter(date =>
        new Date(date) >= today
      );

      // Multiply by 2 to account for 2 credits per day
      const creditsNeeded = selectedDates.length === 0
        ? pendingDates.filter(date => new Date(date) >= today).length * 2
        : futureDatesToAdd.length * 2;

      // Update credits if needed
      if (creditsNeeded > 0) {
        const creditType = useTrialCredits ? 'trial_credits' : 'credits';
        const currentCredits = useTrialCredits ? credits.trial : credits.regular;

        const { error: creditError } = await supabase
          .from('users')
          .update({ [creditType]: currentCredits - creditsNeeded })
          .eq('id', userId);

        if (creditError) throw creditError;
      }

      // Remove dates that are no longer selected
      if (datesToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('availability_status')
          .delete()
          .eq('user_id', userId)
          .in('booking_date', datesToRemove);

        if (removeError) throw removeError;
      }

      // Add new dates
      if (datesToAdd.length > 0) {
        const dateData = datesToAdd.map(dateKey => ({
          user_id: userId,
          booking_date: dateKey,
          status_start: startOfDay(new Date(dateKey)).toISOString(),
          status_end: endOfDay(new Date(dateKey)).toISOString()
        }));

        const { error: addError } = await supabase
          .from('availability_status')
          .insert(dateData);

        if (addError) throw addError;
      }

      setSelectedDates(pendingDates);
      await loadCredits();
      setHasChanges(false);
      toast.success('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
      setPendingDates(selectedDates); // Reset to original selection
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDaysCount = () => {
    const today = startOfDay(new Date());

    // Filter out past dates from both arrays
    const futurePendingDates = pendingDates.filter(date =>
      new Date(date) >= today
    );
    const futureSelectedDates = selectedDates.filter(date =>
      new Date(date) >= today
    );

    // If there are no previously selected future dates
    if (futureSelectedDates.length === 0) {
      return futurePendingDates.length;
    }

    // Count only newly added future dates
    const newlyAddedDates = futurePendingDates.filter(date =>
      !futureSelectedDates.includes(date)
    );

    return newlyAddedDates.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Select Days:</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={handleSelectAll}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700 flex-1 sm:flex-none"
          >
            Select All
          </Button>
          <Button
            variant="secondary"
            onClick={handleSelectNone}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700 flex-1 sm:flex-none"
          >
            Select None
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {dates.map(({ formatted, key }) => (
          <div key={key} className="flex justify-between items-center pb-2">
            <span className="text-sm">{formatted}</span>
            <Toggle
              name={key}
              checked={pendingDates.includes(key)}
              onCheckedChange={(checked) => handleDateToggle(key, checked)}
              disabled={loading}
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t space-y-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Selected Days: {pendingDates.filter(date => new Date(date) >= startOfDay(new Date())).length}
        </p>

        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={() => setIsConfirmationOpen(true)}
              disabled={loading || pendingDates.length === selectedDates.length}
            >
              Confirm Changes
            </Button>
          </div>
        )}
      </div>

      <MultiDayConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirm}
        selectedDays={getSelectedDaysCount()}
        credits={credits}
        userId={userId}
      />
    </div>
  );
}