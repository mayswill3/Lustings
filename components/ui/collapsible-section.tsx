// CollapsibleSection.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    children,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        {React.cloneElement(icon as React.ReactElement, {
                            className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                        })}
                    </span>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-left">
                        {title}
                    </h2>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-3 sm:p-4 bg-white dark:bg-zinc-800">
                    {children}
                </div>
            </div>
        </div>
    );
};