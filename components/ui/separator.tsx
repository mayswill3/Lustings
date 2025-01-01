// Separator.tsx
import React from 'react';
import classNames from 'classnames';

interface SeparatorProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}) => {
    return (
        <div
            role={decorative ? 'none' : 'separator'}
            aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
            className={classNames(
                'shrink-0 bg-gray-200',
                orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
                className
            )}
            {...props}
        />
    );
};