'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import Toggle from '@/components/ui/toggle';

const supabase = createClient();

interface FeaturedProfileListProps {
    userId: string;
}

export function FeaturedProfileList({ userId }: FeaturedProfileListProps) {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Generate next 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
        const date = addDays(new Date(), i);
        return {
            date,
            formatted: format(date, 'EEEE dd MMMM yyyy'),
            key: format(date, 'yyyy-MM-dd')
        };
    });

    useEffect(() => {
        loadFeaturedDates();
    }, []);

    async function loadFeaturedDates() {
        try {
            const { data, error } = await supabase
                .from('featured_profiles')
                .select('feature_date')
                .eq('user_id', userId);

            if (error) throw error;
            setSelectedDates(data.map(d => d.feature_date));
        } catch (error) {
            console.error('Error loading featured dates:', error);
            toast.error('Failed to load featured dates');
        } finally {
            setLoading(false);
        }
    }

    async function updateFeaturedStatus(dateKey: string, selected: boolean) {
        try {
            setLoading(true);
            const date = new Date(dateKey);

            if (selected) {
                // Add featured date
                const { error } = await supabase
                    .from('featured_profiles')
                    .insert({
                        user_id: userId,
                        feature_date: dateKey,
                        feature_start: startOfDay(date).toISOString(),
                        feature_end: endOfDay(date).toISOString()
                    });

                if (error) throw error;
                setSelectedDates(prev => [...prev, dateKey]);
                toast.success('Profile will be featured on selected date');
            } else {
                // Remove featured date
                const { error } = await supabase
                    .from('featured_profiles')
                    .delete()
                    .eq('user_id', userId)
                    .eq('feature_date', dateKey);

                if (error) throw error;
                setSelectedDates(prev => prev.filter(d => d !== dateKey));
                toast.success('Feature removed for selected date');
            }
        } catch (error) {
            console.error('Error updating featured status:', error);
            toast.error('Failed to update featured status');
        } finally {
            setLoading(false);
        }
    }

    const handleSelectAll = async () => {
        try {
            setLoading(true);
            const dateData = dates.map(d => ({
                user_id: userId,
                feature_date: d.key,
                feature_start: startOfDay(d.date).toISOString(),
                feature_end: endOfDay(d.date).toISOString()
            }));

            const { error } = await supabase
                .from('featured_profiles')
                .upsert(dateData);

            if (error) throw error;
            setSelectedDates(dates.map(d => d.key));
            toast.success('Profile will be featured on all dates');
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
                .from('featured_profiles')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
            setSelectedDates([]);
            toast.success('All featured dates cleared');
        } catch (error) {
            console.error('Error clearing dates:', error);
            toast.error('Failed to clear dates');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select dates to feature your profile:</h3>
                <div className="flex gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dates.map(({ formatted, key }) => (
                    <div key={key}>
                        <Toggle
                            name={key}
                            checked={selectedDates.includes(key)}
                            onCheckedChange={(checked) => {
                                updateFeaturedStatus(key, checked);
                            }}
                            disabled={loading}
                            label={formatted}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t">
                <p className="text-sm font-medium">
                    Selected Days: {selectedDates.length}
                </p>
            </div>
        </div>
    );
}