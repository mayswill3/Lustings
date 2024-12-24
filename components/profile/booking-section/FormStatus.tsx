import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormStatusProps {
    error?: string | null;
    success?: boolean;
}

export const FormStatus: React.FC<FormStatusProps> = ({ error, success }) => {
    if (!error && !success) return null;

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Submission Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                            Booking Submitted Successfully
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Your booking request has been submitted. We will contact you shortly to confirm the details.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Alternative version with a more generic Alert component that can be reused
interface AlertProps {
    variant: 'error' | 'success';
    title: string;
    message: string;
    icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
    variant,
    title,
    message,
    icon
}) => {
    const styles = {
        error: {
            container: 'bg-red-50',
            icon: 'text-red-400',
            title: 'text-red-800',
            message: 'text-red-700'
        },
        success: {
            container: 'bg-green-50',
            icon: 'text-green-400',
            title: 'text-green-800',
            message: 'text-green-700'
        }
    };

    const style = styles[variant];

    return (
        <div className={`rounded-md ${style.container} p-4`}>
            <div className="flex">
                {icon && (
                    <div className="flex-shrink-0">
                        <div className={`h-5 w-5 ${style.icon}`}>
                            {icon}
                        </div>
                    </div>
                )}
                <div className={icon ? 'ml-3' : ''}>
                    <h3 className={`text-sm font-medium ${style.title}`}>
                        {title}
                    </h3>
                    <div className={`mt-2 text-sm ${style.message}`}>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Example usage of the Alert component
export const EnhancedFormStatus: React.FC<FormStatusProps> = ({ error, success }) => {
    if (!error && !success) return null;

    if (error) {
        return (
            <Alert
                variant="error"
                title="Submission Error"
                message={error}
                icon={<AlertCircle />}
            />
        );
    }

    if (success) {
        return (
            <Alert
                variant="success"
                title="Booking Submitted Successfully"
                message="Your booking request has been submitted. We will contact you shortly to confirm the details."
                icon={<CheckCircle2 />}
            />
        );
    }

    return null;
};

export default FormStatus;