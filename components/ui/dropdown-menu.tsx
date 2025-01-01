// DropdownMenu.tsx
import React from 'react';
import classNames from 'classnames';

interface DropdownMenuProps {
    children: React.ReactNode;
    className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
    return <div className={classNames('relative', className)}>{children}</div>;
};

// DropdownMenuTrigger.tsx
interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    asChild?: boolean;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
    children,
    onClick,
    className,
    asChild = false
}) => {
    const Component = asChild ? 'div' : 'button';
    return (
        <Component
            onClick={onClick}
            className={classNames('cursor-pointer focus:outline-none', className)}
        >
            {children}
        </Component>
    );
};

// DropdownMenuContent.tsx
interface DropdownMenuContentProps {
    children: React.ReactNode;
    isOpen: boolean;
    className?: string;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, isOpen, className }) => {
    if (!isOpen) return null;

    return (
        <div
            className={classNames(
                'absolute mt-2 bg-white shadow-lg rounded-md border border-gray-200',
                className
            )}
        >
            {children}
        </div>
    );
};

// DropdownMenuGroup.tsx
interface DropdownMenuGroupProps {
    children: React.ReactNode;
    className?: string;
}

export const DropdownMenuGroup: React.FC<DropdownMenuGroupProps> = ({ children, className }) => {
    return (
        <div className={classNames('py-1', className)}>
            {children}
        </div>
    );
};

// DropdownMenuItem.tsx
interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={classNames(
                'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none',
                className
            )}
        >
            {children}
        </button>
    );
};
