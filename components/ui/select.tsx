// components/ui/select.tsx
import React from 'react';
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    placeholder?: string;
    className?: string;
}

export const SelectItem = ({
    value,
    children,
    className,
    ...props
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <option
        value={value}
        className={cn("", className)}
        {...props}
    >
        {children}
    </option>
);

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, value, onValueChange, children, placeholder, ...props }, ref) => (
        <div className="relative">
            <select
                ref={ref}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className={cn(
                    "w-full h-10 px-3 rounded-md text-sm",
                    "border border-gray-300 dark:border-zinc-700",
                    "bg-white dark:bg-zinc-800",
                    "text-gray-900 dark:text-gray-100",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {children}
            </select>
        </div>
    )
);

Select.displayName = "Select";