// Tabs.tsx
'use client';

import React from 'react';
import classNames from 'classnames';

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

export const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={classNames('w-full', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

// TabsList.tsx
interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
    return (
        <div className={classNames(
            'flex space-x-1 rounded-lg p-1',
            'bg-gray-100 dark:bg-zinc-800',
            className
        )}>
            {children}
        </div>
    );
};

// TabsTrigger.tsx
interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('TabsTrigger must be used within a Tabs component');
    }

    const { activeTab, setActiveTab } = context;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={classNames(
                'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                activeTab === value ? (
                    'bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-400'
                ) : (
                    'text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-zinc-700/50'
                ),
                className
            )}
        >
            {children}
        </button>
    );
};

// TabsContent.tsx
interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('TabsContent must be used within a Tabs component');
    }

    const { activeTab } = context;

    if (activeTab !== value) {
        return null;
    }

    return (
        <div
            className={classNames(
                'focus:outline-none',
                className
            )}
        >
            {children}
        </div>
    );
};