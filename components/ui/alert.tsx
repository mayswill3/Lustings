import * as React from "react"

interface AlertProps {
    variant?: 'default' | 'destructive'
    className?: string
    children: React.ReactNode
}

const Alert = ({
    variant = "default",
    className = "",
    children,
    ...props
}: AlertProps) => {
    const variantClasses = {
        default: "bg-gray-50 text-gray-900 border-gray-200",
        destructive: "bg-red-50 text-red-900 border-red-200"
    }

    return (
        <div
            role="alert"
            className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

interface AlertDescriptionProps {
    className?: string
    children: React.ReactNode
}

const AlertDescription = ({
    className = "",
    children,
    ...props
}: AlertDescriptionProps) => (
    <div
        className={`text-sm ${className}`}
        {...props}
    >
        {children}
    </div>
)

export { Alert, AlertDescription }