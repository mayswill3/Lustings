import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface AvailabilityModalProps {
    show: boolean;
    onClose: () => void;
    availability?: {
        date: string;
        slots: string[];
    }[];
}

const CalendarPlaceholder = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500"
                >
                    {day}
                </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square flex items-center justify-center border border-gray-100 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                    {i + 1}
                </div>
            ))}
        </div>
        <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Times</h4>
            <div className="grid grid-cols-4 gap-2">
                {['09:00', '10:00', '11:00', '12:00'].map((time) => (
                    <div
                        key={time}
                        className="text-center py-1 px-2 border border-gray-200 rounded-md text-sm hover:bg-purple-50 hover:border-purple-200 cursor-pointer"
                    >
                        {time}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    show,
    onClose,
    availability
}) => {
    return (
        <Dialog.Root open={show} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />
                <Dialog.Content
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
                    onEscapeKeyDown={onClose}
                    onInteractOutside={onClose}
                >
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-semibold text-purple-800">
                            Availability Calendar
                        </Dialog.Title>
                        <Dialog.Close
                            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>

                    <div className="mb-6">
                        <div className="bg-purple-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-purple-700">
                                Select a date and time to check availability. Available slots are shown in green.
                            </p>
                        </div>

                        {/* Calendar Implementation */}
                        <CalendarPlaceholder />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                    <span className="text-sm text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    <span className="text-sm text-gray-600">Unavailable</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    // Handle selection confirmation
                                    onClose();
                                }}
                                className="bg-purple-600 text-white hover:bg-purple-700"
                            >
                                Confirm Selection
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

// Optional: Calendar component for actual implementation
interface CalendarProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
    availability?: {
        date: string;
        slots: string[];
    }[];
}

export const Calendar: React.FC<CalendarProps> = ({
    selectedDate,
    onDateSelect,
    availability
}) => {
    // Calendar implementation goes here
    return (
        <div>
            {/* Implement actual calendar logic */}
        </div>
    );
};

export default AvailabilityModal;