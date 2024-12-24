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
                className="min-h-[120px] resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
        </FormSection>
    );
};

export default Comments;