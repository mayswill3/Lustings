import React from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const FormSection = ({ title, description, children }: FormSectionProps) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-gray-700 p-6 shadow-sm dark:shadow-md">
        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2">{title}</h3>
        {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {description}
            </p>
        )}
        <div className="space-y-4">{children}</div>
    </div>
);

export default FormSection;