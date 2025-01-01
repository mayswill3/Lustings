import React from 'react';
import classNames from 'classnames';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    className?: string;
    htmlFor?: string;
}

export const Label: React.FC<LabelProps> = ({ children, className, htmlFor, ...props }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={classNames(
                'text-sm font-medium text-gray-700 dark:text-gray-300 leading-none',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
};