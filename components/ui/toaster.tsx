// Toaster.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    const typeClasses = {
        success: 'bg-green-100 text-green-700 border-green-400',
        error: 'bg-red-100 text-red-700 border-red-400',
        info: 'bg-blue-100 text-blue-700 border-blue-400',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    };

    return (
        <div
            className={classNames(
                'flex items-center p-4 mb-4 text-sm border rounded shadow-md',
                typeClasses[type]
            )}
        >
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                    &#x2715;
                </button>
            )}
        </div>
    );
};

interface ToasterProps {
    toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' | 'warning' }>;
    removeToast: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
    return createPortal(
        <div className="fixed top-4 right-4 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>,
        document.body
    );
};


