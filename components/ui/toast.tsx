// toast.js - Toast module for your project

import React from 'react';
import PropTypes from 'prop-types';

export function Toast({ message, type, action }) {
    const getTypeClass = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className={`toast px-4 py-2 rounded shadow-lg ${getTypeClass(type)}`}>
            <span>{message}</span>
            {action && (
                <button
                    className="ml-4 underline text-white hover:text-gray-200 focus:outline-none"
                    onClick={action.onClick}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

export function ToastActionElement({ label, onClick }) {
    return (
        <button
            className="ml-4 underline text-white hover:text-gray-200 focus:outline-none"
            onClick={onClick}
        >
            {label}
        </button>
    );
}

ToastActionElement.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export const ToastProps = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info', 'default']),
    action: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
    }),
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info', 'default']),
    action: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
    }),
};

Toast.defaultProps = {
    type: 'default',
    action: null,
};
