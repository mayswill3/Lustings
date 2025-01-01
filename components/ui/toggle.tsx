import React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface ToggleProps {
    id?: string;
    name?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
    id,
    name,
    checked,
    onCheckedChange,
    label,
    className = '',
    disabled = false
}) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    {label}
                </label>
            )}
            <Switch.Root
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className={`
                    w-11 h-6 
                    bg-gray-300 dark:bg-gray-600
                    rounded-full 
                    relative 
                    transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800
                    data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600
                `}
            >
                <Switch.Thumb
                    className={`
                        block w-5 h-5 
                        bg-white 
                        rounded-full 
                        shadow-lg
                        transition-transform duration-200 ease-in-out
                        translate-x-0.5 data-[state=checked]:translate-x-[22px]
                    `}
                />
            </Switch.Root>
        </div>
    );
};

export default Toggle;