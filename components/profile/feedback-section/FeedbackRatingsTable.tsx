import React from 'react';

interface FeedbackRatingsTableProps {
    feedbackPeriods: Record<string, any[]>;
    getFeedbackCounts: (feedbacks: any[]) => {
        positive: number;
        neutral: number;
        negative: number;
    };
}

export const FeedbackRatingsTable: React.FC<FeedbackRatingsTableProps> = ({
    feedbackPeriods,
    getFeedbackCounts
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Feedback ratings
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-800">
                            <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300"></th>
                            {Object.keys(feedbackPeriods).map(period => (
                                <th
                                    key={period}
                                    className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {period}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { type: 'positive', icon: '+', color: 'text-green-600 dark:text-green-400' },
                            { type: 'neutral', icon: '○', color: 'text-gray-600 dark:text-gray-400' },
                            { type: 'negative', icon: '-', color: 'text-red-600 dark:text-red-400' }
                        ].map(({ type, icon, color }) => (
                            <tr
                                key={type}
                                className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <span className={`text-xl ${color}`}>{icon}</span>
                                    <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                                </td>
                                {Object.values(feedbackPeriods).map((periodFeedbacks, index) => (
                                    <td
                                        key={index}
                                        className="px-6 py-4 text-center text-blue-600 dark:text-blue-400 font-medium"
                                    >
                                        {getFeedbackCounts(periodFeedbacks)[type as keyof ReturnType<typeof getFeedbackCounts>]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Responsive View */}
            <div className="md:hidden space-y-4">
                {[
                    { type: 'positive', icon: '+', color: 'text-green-600 dark:text-green-400' },
                    { type: 'neutral', icon: '○', color: 'text-gray-600 dark:text-gray-400' },
                    { type: 'negative', icon: '-', color: 'text-red-600 dark:text-red-400' }
                ].map(({ type, icon, color }) => (
                    <div
                        key={type}
                        className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xl ${color}`}>{icon}</span>
                            <span className="capitalize text-gray-700 dark:text-gray-300 font-semibold">
                                {type} Feedback
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(feedbackPeriods).map((period, index) => (
                                <div
                                    key={period}
                                    className="text-center bg-gray-100 dark:bg-zinc-800 rounded p-2"
                                >
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {period}
                                    </div>
                                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                                        {getFeedbackCounts(Object.values(feedbackPeriods)[index])[type as keyof ReturnType<typeof getFeedbackCounts>]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackRatingsTable;