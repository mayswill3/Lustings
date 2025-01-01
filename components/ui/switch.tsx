// Switch.tsx
import React from 'react';
import classNames from 'classnames';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false, className }) => {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <div
            className={classNames(
                'relative inline-flex items-center cursor-pointer',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
                className
            )}
            onClick={handleToggle}
        >
            <span
                className={classNames(
                    'inline-block w-10 h-6 rounded-full transition-colors',
                    checked ? 'bg-blue-600' : 'bg-gray-300'
                )}
            ></span>
            <span
                className={classNames(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform',
                    checked ? 'translate-x-4' : 'translate-x-0'
                )}
            ></span>
        </div>
    );
};