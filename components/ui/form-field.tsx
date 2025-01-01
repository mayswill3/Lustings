// components/ui/form-field.tsx
interface FormFieldProps {
    label: string;
    children: React.ReactNode;
}

export const FormField = ({ label, children }: FormFieldProps) => (
    <label className="flex flex-col space-y-2 w-full">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="w-full">{children}</div>
    </label>
);