// Table.tsx
import React from 'react';
import classNames from 'classnames';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
    return <table className={classNames('w-full border-collapse border border-gray-200', className)}>{children}</table>;
};

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
    return <thead className={classNames('bg-gray-100', className)}>{children}</thead>;
};

export const TableHead: React.FC<TableHeaderProps> = ({ children, className }) => {
    return <thead className={classNames('bg-gray-200', className)}>{children}</thead>;
};

export const TableBody: React.FC<TableHeaderProps> = ({ children, className }) => {
    return <tbody className={className}>{children}</tbody>;
};

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
    return <tr className={classNames('border-b border-gray-200', className)}>{children}</tr>;
};

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
    header?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className, header = false }) => {
    const Tag = header ? 'th' : 'td';
    return (
        <Tag
            className={classNames(
                'px-4 py-2 text-left',
                header ? 'font-semibold text-gray-700' : 'text-gray-600',
                className
            )}
        >
            {children}
        </Tag>
    );
};