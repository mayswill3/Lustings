// Checkbox.tsx
import React from 'react';
import classNames from 'classnames';

interface CheckboxProps {
    id: string;
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    checked = false,
    onChange,
    className,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event.target.checked);
        }
    };

    return (
        <div className={classNames('flex items-center space-x-2', className)}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            {label && <label htmlFor={id} className="text-sm text-gray-700">{label}</label>}
        </div>
    );
};

