import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Badge } from "@/components/ui/badge";

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
    console.log(feedbacks)
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

    const feedbackCounts = {
        positive: feedbacks.filter(f => f.feedback_type === 'positive').length,
        neutral: feedbacks.filter(f => f.feedback_type === 'neutral').length,
        negative: feedbacks.filter(f => f.feedback_type === 'negative').length
    };

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'positive':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'negative':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Feedback Counts */}
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(feedbackCounts).map(([type, count]) => (
                    <div key={type} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-zinc-800">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{type}</div>
                    </div>
                ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 rounded-lg border dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
                                {feedback.sender?.avatar_url && (
                                    <img
                                        src={feedback.sender.avatar_url}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="font-medium dark:text-gray-200">
                                    {feedback.sender?.full_name || 'Anonymous'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-sm font-medium ${getBadgeVariant(feedback.feedback_type)}`}>
                                {feedback.feedback_type}
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{feedback.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};