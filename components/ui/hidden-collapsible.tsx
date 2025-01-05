// components/ui/hidden-collapsible.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HiddenCollapsibleProps {
    children: React.ReactNode;
    trigger: string;
    className?: string;
}

export const HiddenCollapsible: React.FC<HiddenCollapsibleProps> = ({
    children,
    trigger,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("text-sm text-muted-foreground", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-muted-foreground/80 hover:text-muted-foreground transition-colors"
            >
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "transform rotate-180"
                    )}
                />
                <span className="text-xs">{trigger}</span>
            </button>

            <div className={cn(
                "grid transition-all",
                isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};