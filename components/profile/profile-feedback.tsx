import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'negative':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Feedback Rating Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Feedback ratings</h2>
                <div className="bg-gray-50 dark:bg-zinc-900 border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-left"></th>
                                {Object.keys(feedbackPeriods).map(period => (
                                    <th key={period} className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                                        {period}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { type: 'positive', icon: '+', color: 'text-green-600' },
                                { type: 'neutral', icon: '○', color: 'text-gray-600' },
                                { type: 'negative', icon: '-', color: 'text-red-600' }
                            ].map(({ type, icon, color }) => (
                                <tr key={type} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <span className={`text-xl ${color}`}>{icon}</span>
                                        <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                                    </td>
                                    {Object.values(feedbackPeriods).map((periodFeedbacks, index) => (
                                        <td key={index} className="px-6 py-4 text-center text-blue-600 font-medium">
                                            {getFeedbackCounts(periodFeedbacks)[type as keyof typeof getFeedbackCounts]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
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
                                        className="text-base font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
        </div>
    );
};