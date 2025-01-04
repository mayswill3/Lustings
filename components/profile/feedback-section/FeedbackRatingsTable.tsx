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
    const getTotalCounts = () => {
        // Get unique feedbacks to avoid counting duplicates across periods
        const allFeedbacks = Object.values(feedbackPeriods).reduce((acc, periodFeedbacks) => {
            periodFeedbacks.forEach(feedback => {
                if (!acc.some(f => f.id === feedback.id)) {
                    acc.push(feedback);
                }
            });
            return acc;
        }, []);
        return getFeedbackCounts(allFeedbacks);
    };

    const totalCounts = getTotalCounts();
    const totalFeedback = totalCounts.positive + totalCounts.neutral + totalCounts.negative;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Feedback ratings
            </h2>

            {/* Overview Section - Desktop */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
                {[
                    { type: 'positive', icon: '+', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
                    { type: 'neutral', icon: '○', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
                    { type: 'negative', icon: '-', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' }
                ].map(({ type, icon, color, bgColor }) => (
                    <div
                        key={type}
                        className={`${bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`text-xl ${color}`}>{icon}</span>
                                <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-xl font-semibold ${color}`}>
                                    {totalCounts[type as keyof typeof totalCounts]}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {totalFeedback > 0
                                        ? `${Math.round((totalCounts[type as keyof typeof totalCounts] / totalFeedback) * 100)}%`
                                        : '0%'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overview Section - Mobile */}
            <div className="md:hidden mb-6">
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { type: 'positive', icon: '+', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
                        { type: 'neutral', icon: '○', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
                        { type: 'negative', icon: '-', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' }
                    ].map(({ type, icon, color, bgColor }) => (
                        <div
                            key={type}
                            className={`${bgColor} rounded-lg p-3 border border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className={`text-lg ${color}`}>{icon}</span>
                                    <span className="text-xs capitalize text-gray-700 dark:text-gray-300">{type}</span>
                                </div>
                                <span className={`text-lg font-semibold ${color}`}>
                                    {totalCounts[type as keyof typeof totalCounts]}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {totalFeedback > 0
                                        ? `${Math.round((totalCounts[type as keyof typeof totalCounts] / totalFeedback) * 100)}%`
                                        : '0%'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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

            {/* Mobile Period View */}
            <div className="md:hidden space-y-4">
                {Object.entries(feedbackPeriods).map(([period, periodFeedbacks]) => {
                    const counts = getFeedbackCounts(periodFeedbacks);
                    return (
                        <div key={period} className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                {period}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { type: 'positive', icon: '+', color: 'text-green-600 dark:text-green-400' },
                                    { type: 'neutral', icon: '○', color: 'text-gray-600 dark:text-gray-400' },
                                    { type: 'negative', icon: '-', color: 'text-red-600 dark:text-red-400' }
                                ].map(({ type, icon, color }) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between bg-gray-100 dark:bg-zinc-800 rounded p-2"
                                    >
                                        <span className={`text-lg ${color}`}>{icon}</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            {counts[type as keyof typeof counts]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeedbackRatingsTable;