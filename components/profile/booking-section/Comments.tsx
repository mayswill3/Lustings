import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from './FormSection';

interface FormData {
    nickname: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    contact_date: string;
    time_start: string;
    time_end: string;
    duration: string;
    overnight: boolean;
    meeting_type: string;
    comments: string;
    // Add any other properties from your full form data
}

interface CommentsProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
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