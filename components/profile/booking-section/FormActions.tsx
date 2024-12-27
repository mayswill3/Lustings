import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';

interface FormActionsProps {
    loading: boolean;
    setShowAvailability: (show: boolean) => void;
    onSubmit?: () => void;
}

const LoadingSpinner = () => (
    <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export const FormActions: React.FC<FormActionsProps> = ({
    loading,
    setShowAvailability,
    onSubmit
}) => {
    return (
        <div className="flex justify-end items-center gap-4">
            {/* <Button
                type="button"
                variant="outline"
                onClick={() => setShowAvailability(true)}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-zinc-700"
            >
                <Calendar className="mr-2 h-4 w-4" />
                View Availability
            </Button> */}
            <Button
                type="submit"
                onClick={onSubmit}
                disabled={loading}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                {loading ? (
                    <>
                        <LoadingSpinner />
                        Submitting...
                    </>
                ) : (
                    'Submit Booking Request'
                )}
            </Button>
        </div>
    );
};

// Optional: Custom Button component with consistent styling
const CustomButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'outline';
    }
>(({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-zinc-700"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});

CustomButton.displayName = "Button";

// Form Actions with Custom Button
export const FormActionsWithCustomButton: React.FC<FormActionsProps> = ({
    loading,
    setShowAvailability,
    onSubmit
}) => {
    return (
        <div className="flex justify-end items-center gap-4">
            <CustomButton
                type="button"
                variant="outline"
                onClick={() => setShowAvailability(true)}
            >
                <Calendar className="mr-2 h-4 w-4" />
                View Availability
            </CustomButton>
            <CustomButton
                type="submit"
                onClick={onSubmit}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <LoadingSpinner />
                        Submitting...
                    </>
                ) : (
                    'Submit Booking Request'
                )}
            </CustomButton>
        </div>
    );
};

export default FormActions;