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
        <div className="relative h-8" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full h-full px-2 text-left bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md cursor-pointer text-xs"
            >
                <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                    {selectedActivities.length > 0 ? (
                        <span className="truncate text-gray-900 dark:text-white">
                            {selectedActivities.join(", ")}
                        </span>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">Select Services</span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {selectedActivities.length > 0 && (
                        <X
                            className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={clearSelections}
                        />
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-48 overflow-auto">
                    <div className="p-1">
                        {ACTIVITIES.map((activity) => (
                            <div
                                key={activity}
                                onClick={() => toggleActivity(activity)}
                                className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-sm text-xs text-gray-900 dark:text-white"
                            >
                                <span>{activity}</span>
                                {selectedActivities.includes(activity) && (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}