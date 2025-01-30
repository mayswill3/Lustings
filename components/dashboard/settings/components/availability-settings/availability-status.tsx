import React, { useState, useEffect } from 'react';
import Toggle from '@/components/ui/toggle';
import { AvailabilityList } from '../escorting-options/availability-list';
import { toast } from 'sonner';
import { setAvailability } from '@/utils/availability';
import { createClient } from '@/utils/supabase/client';
import { CreditPurchaseDialog } from '@/components/ui/credit-purchase-dialog';

const supabase = createClient();

interface AvailabilityStatusProps {
    isAvailable: boolean;
    setIsAvailable: (value: boolean) => void;
    availabilityLoading: boolean;
    setAvailabilityLoading: (value: boolean) => void;
    userId?: string;
}

export const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
    isAvailable,
    setIsAvailable,
    availabilityLoading,
    setAvailabilityLoading,
    userId
}) => {
    const [credits, setCredits] = useState({ regular: 0, trial: 0 });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    useEffect(() => {
        const fetchCredits = async () => {
            if (!userId) return;

            const { data, error } = await supabase
                .from('users')
                .select('credits, trial_credits')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setCredits({
                    regular: data.credits || 0,
                    trial: data.trial_credits || 0
                });
            }
        };

        fetchCredits();
    }, [userId]);

    const handleAvailabilityToggle = async (checked: boolean) => {
        if (!userId) {
            toast.error('User ID not found');
            return;
        }

        if (checked && credits.regular < 2 && credits.trial < 2) {
            // Show error toast if user doesn't have enough credits
            toast.error('You need at least 2 credits to set availability');
            return;
        }

        if (checked) {
            // When turning on availability, show the credit purchase dialog
            setIsDialogOpen(true);
        } else {
            // When turning off availability, just update the status
            try {
                setAvailabilityLoading(true);
                await setAvailability(userId, false);
                setIsAvailable(false);
                toast.success('You are now marked as unavailable');
            } catch (error) {
                console.error('Error updating availability:', error);
                toast.error('Failed to update availability status');
            } finally {
                setAvailabilityLoading(false);
            }
        }
    };

    const handlePurchaseSuccess = async () => {
        try {
            setAvailabilityLoading(true);
            await setAvailability(userId!, true);
            setIsAvailable(true);

            // Refresh credits after purchase
            const { data } = await supabase
                .from('users')
                .select('credits, trial_credits')
                .eq('id', userId)
                .single();

            if (data) {
                setCredits({
                    regular: data.credits || 0,
                    trial: data.trial_credits || 0
                });
            }

            toast.success('You are now available until midnight');
        } catch (error) {
            console.error('Error updating availability:', error);
            toast.error('Failed to update availability status');
        } finally {
            setAvailabilityLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Toggle
                    id="availability-toggle"
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                    disabled={availabilityLoading || (credits.regular < 2 && credits.trial < 2)}
                    label="Available Today (Until Midnight - 2 Credits Required)"
                    className="w-full justify-between"
                />
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
                {credits.regular > 0 && (
                    <p>Regular credits remaining: {credits.regular}</p>
                )}
                {credits.trial > 0 && (
                    <p>Trial credits remaining: {credits.trial}</p>
                )}
            </div>
            <AvailabilityList userId={userId} />
            <CreditPurchaseDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handlePurchaseSuccess}
                credits={credits}
                userId={userId}
            />
        </div>
    );
};