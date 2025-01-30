import React, { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800',
                destructive: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
                outline: 'border border-purple-300 bg-white hover:bg-purple-50 dark:bg-purple-900 dark:hover:bg-purple-800 dark:border-purple-700 dark:text-purple-100',
                secondary: 'bg-purple-200 text-purple-900 hover:bg-purple-300 dark:bg-purple-800 dark:text-purple-100 dark:hover:bg-purple-700',
                ghost: 'bg-transparent hover:bg-purple-100 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900 dark:hover:text-purple-300',
            },
            size: {
                default: 'h-10 px-4',
                sm: 'h-8 px-3 text-sm',
                lg: 'h-12 px-6',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';