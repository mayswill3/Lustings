// Card.tsx
import React from 'react';
import classNames from 'classnames';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'bg-white shadow-md rounded border border-gray-200 p-4 dark:border-zinc-700 bg-white dark:bg-zinc-900',
                className
            )}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'flex flex-col space-y-1.5 pb-4',
                className
            )}
        >
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <h3
            className={classNames(
                'text-2xl font-semibold leading-none tracking-tight',
                className
            )}
        >
            {children}
        </h3>
    );
};

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
    return (
        <p
            className={classNames(
                'text-sm text-gray-500',
                className
            )}
        >
            {children}
        </p>
    );
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'pt-0',
                className
            )}
        >
            {children}
        </div>
    );
};

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'flex items-center justify-end pt-4',
                className
            )}
        >
            {children}
        </div>
    );
};