import React from 'react';

// components/ui/section-header.tsx
interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const SectionHeader = ({ icon, title, subtitle }: SectionHeaderProps) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5 text-blue-600 dark:text-blue-400"
            })}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
    </div>
);
