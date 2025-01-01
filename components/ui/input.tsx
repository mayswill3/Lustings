import React from 'react';

type InputProps = {
    id?: string;
    placeholder?: string;
    type?: string;
    name?: string;
    autoComplete?: string;
    className?: string;
    defaultValue?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({
    id,
    placeholder,
    type = 'text',
    name,
    autoComplete,
    className = '',
    defaultValue,
    value,
    required,
    disabled,
    readOnly,
    onChange,
}) => {
    const disabledStyles = disabled || readOnly
        ? 'bg-gray-50 dark:bg-zinc-800 cursor-not-allowed'
        : 'bg-white dark:bg-zinc-800';

    return (
        <input
            id={id}
            placeholder={placeholder}
            type={type}
            name={name}
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            value={value}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            className={`w-full h-10 px-3 rounded-md border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabledStyles} ${className}`}
        />
    );
};
export default Input;