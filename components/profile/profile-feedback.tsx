import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import FeedbackRatingsTable from './feedback-section/FeedbackRatingsTable';

const supabase = createClient();

interface Feedback {
    id: string;
    booking_id: string;
    sender_id: string;
    recipient_id: string;
    feedback_type: 'positive' | 'neutral' | 'negative';
    comment: string;
    created_at: string;
    sender?: {
        full_name: string;
        avatar_url?: string;
    };
    booking?: any;
}

export const ProfileFeedbackSection = ({ userId }: { userId: string }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    useEffect(() => {
        const fetchFeedbacks = async () => {
            // First get the feedbacks
            const { data: feedbackData, error: feedbackError } = await supabase
                .from('feedbacks')
                .select('*')
                .eq('recipient_id', userId)
                .order('created_at', { ascending: false });

            if (feedbackError) {
                console.error('Error fetching feedbacks:', feedbackError);
                return;
            }

            if (feedbackData) {
                // Then get the user details for each sender
                const feedbacksWithSenders = await Promise.all(
                    feedbackData.map(async (feedback) => {
                        const { data: userData } = await supabase
                            .from('users')
                            .select('full_name, avatar_url')
                            .eq('id', feedback.sender_id)
                            .single();

                        return {
                            ...feedback,
                            sender: userData
                        };
                    })
                );

                setFeedbacks(feedbacksWithSenders);
            }
        };

        fetchFeedbacks();
    }, [userId]);

    // Helper function to filter feedbacks by date range
    const getFilteredFeedbacks = (months: number) => {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - months);

        return feedbacks.filter(feedback =>
            new Date(feedback.created_at) >= cutoffDate
        );
    };

    // Get counts for each time period
    const getFeedbackCounts = (feedbackList: Feedback[]) => ({
        positive: feedbackList.filter(f => f.feedback_type === 'positive').length,
        neutral: feedbackList.filter(f => f.feedback_type === 'neutral').length,
        negative: feedbackList.filter(f => f.feedback_type === 'negative').length
    });

    const feedbackPeriods = {
        '1 month': getFilteredFeedbacks(1),
        '6 months': getFilteredFeedbacks(6),
        '12 months': getFilteredFeedbacks(12)
    };

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'positive':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'negative':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <FeedbackRatingsTable
                feedbackPeriods={feedbackPeriods}
                getFeedbackCounts={getFeedbackCounts}
            />

            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div
                        key={feedback.id}
                        className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 
                            hover:bg-gray-100 dark:hover:bg-zinc-800 
                            transition-colors border border-transparent 
                            hover:border-gray-200 dark:hover:border-gray-700"
                    >
                        <div className="flex gap-4 items-start">
                            {/* Feedback Type Badge */}
                            <div
                                className={`shrink-0 px-3 py-1 rounded-md text-sm font-medium capitalize ${getBadgeVariant(feedback.feedback_type)}`}
                            >
                                {feedback.feedback_type}
                            </div>

                            {/* Content Container */}
                            <div className="flex-1 min-w-0">
                                {/* Header Row */}
                                <div className="flex items-center justify-between mb-3">
                                    <Link
                                        href={`/profile/${feedback.sender?.full_name}`}
                                        className="text-base font-semibold 
                                            text-gray-900 dark:text-gray-100
                                            hover:text-blue-600 dark:hover:text-blue-400 
                                            transition-colors"
                                    >
                                        {feedback.sender?.full_name || 'Anonymous'}
                                    </Link>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(feedback.created_at).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {feedback.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ProfileFeedbackSection;