// components/booking/BookingFilters.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingFiltersProps {
    viewFilter: 'all' | 'sent' | 'received';
    statusFilter: 'all' | 'pending' | 'accepted' | 'declined';
    setViewFilter: React.Dispatch<React.SetStateAction<'all' | 'sent' | 'received'>>;
    setStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'pending' | 'accepted' | 'declined'>>;
    isMobile?: boolean;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BookingFilters = ({
    viewFilter,
    statusFilter,
    setViewFilter,
    setStatusFilter,
    isMobile = false
}: BookingFiltersProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const viewOptions = [
        { value: 'all', label: 'All Bookings' },
        { value: 'sent', label: 'Sent' },
        { value: 'received', label: 'Received' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status', color: 'blue' },
        { value: 'pending', label: 'Pending', color: 'yellow' },
        { value: 'accepted', label: 'Accepted', color: 'green' },
        { value: 'declined', label: 'Declined', color: 'red' }
    ];

    const FilterContent = () => (
        <CardContent className="p-4">
            <div className="space-y-6">
                {/* View Filter */}
                <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-3">View</h3>
                    <div className="space-y-2">
                        {viewOptions.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setViewFilter(item.value as typeof viewFilter)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${viewFilter === item.value
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-3">Status</h3>
                    <div className="space-y-2">
                        {statusOptions.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setStatusFilter(item.value as typeof statusFilter)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${statusFilter === item.value
                                        ? `bg-${item.color}-50 text-${item.color}-700 dark:bg-${item.color}-900 dark:text-${item.color}-100`
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    );

    if (isMobile) {
        return (
            <div>
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full"
                >
                    {isOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>

                {isOpen && (
                    <Card className="mt-4">
                        <FilterContent />
                    </Card>
                )}
            </div>
        );
    }

    return (
        <Card>
            <FilterContent />
        </Card>
    );
};

export default BookingFilters;
