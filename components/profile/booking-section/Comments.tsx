import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from './FormSection';

interface FormData {
    comments: string;
    [key: string]: any;
}

interface CommentsProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
}

export const Comments: React.FC<CommentsProps> = ({
    formData,
    setFormData
}) => {
    const handleCommentChange = (value: string) => {
        setFormData({ ...formData, comments: value });
    };

    return (
        <FormSection
            title="Additional Comments"
            description="Any special requests or additional information?"
        >
            <Textarea
                value={formData.comments}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder="Enter any additional details or special requests..."
                className="min-h-[120px] resize-none 
                    border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-zinc-800
                    text-gray-900 dark:text-gray-100 
                    focus:border-purple-500 dark:focus:border-purple-400 
                    focus:ring-purple-500 dark:focus:ring-purple-400 
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
        </FormSection>
    );
};

export default Comments;