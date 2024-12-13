// components/profile/about-section.tsx
import { User2 } from 'lucide-react';

export const AboutSection = ({ userDetails, renderHTMLContent }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <User2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
            </div>
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {userDetails.summary || 'No summary available'}
                    </div>
                    {userDetails.details ?
                        renderHTMLContent(userDetails.details)
                        :
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            No additional details provided
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};