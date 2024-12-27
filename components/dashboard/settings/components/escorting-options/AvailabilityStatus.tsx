import React from 'react';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Toggle from '@/components/ui/toggle';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { AvailabilityList } from './availability-list';
import { toast } from 'sonner';
import { setAvailability } from '@/utils/availability';

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
    return (
        <CollapsibleSection
            title="Availability Status"
            icon={<Clock />}
            defaultOpen={false}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between space-x-4">
                    <Label htmlFor="availableToday">Available Today (Until Midnight)</Label>
                    <Toggle
                        id="availableToday"
                        checked={isAvailable}
                        onCheckedChange={async (state) => {
                            try {
                                setAvailabilityLoading(true);
                                await setAvailability(userId, state);
                                setIsAvailable(state);
                                toast.success(state ? 'You are now available until midnight' : 'You are now marked as unavailable');
                            } catch (error) {
                                console.error('Error updating availability:', error);
                                toast.error('Failed to update availability status');
                            } finally {
                                setAvailabilityLoading(false);
                            }
                        }}
                        disabled={availabilityLoading}
                    />
                </div>
                <div className="border-t pt-4">
                    <AvailabilityList userId={userId} />
                </div>
            </div>
        </CollapsibleSection>
    );
};
