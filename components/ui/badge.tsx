// Badge.tsx
import React from 'react';
import classNames from 'classnames';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
    const variantClasses = {
        primary: 'bg-blue-100 text-blue-700',
        secondary: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <span
            className={classNames(
                'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
};