// components/booking/FormSection.tsx
import React from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const FormSection = ({ title, description, children }: FormSectionProps) => (
    <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="space-y-4">{children}</div>
    </div>
);
