import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { ACTIVITIES } from '@/constants/activities';

interface ActivityMultiSelectProps {
    selectedActivities: string[];
    setSelectedActivities: (activities: string[]) => void;
}

export default function ActivityMultiSelect({
    selectedActivities,
    setSelectedActivities
}: ActivityMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleActivity = (activity: string) => {
        setSelectedActivities(
            selectedActivities.includes(activity)
                ? selectedActivities.filter(item => item !== activity)
                : [...selectedActivities, activity]
        );
    };

    const clearSelections = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedActivities([]);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border rounded-md cursor-pointer"
            >
                <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                    {selectedActivities.length > 0 ? (
                        selectedActivities.map((activity) => (
                            <span
                                key={activity}
                                className="px-2 py-0.5 text-sm bg-gray-100 rounded-full"
                            >
                                {activity}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">Select Activities</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {selectedActivities.length > 0 && (
                        <X
                            className="w-4 h-4 text-gray-400 hover:text-gray-600"
                            onClick={clearSelections}
                        />
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                        {ACTIVITIES.map((activity) => (
                            <div
                                key={activity}
                                onClick={() => toggleActivity(activity)}
                                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                            >
                                <span>{activity}</span>
                                {selectedActivities.includes(activity) && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}