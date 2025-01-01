import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const timeToMinutes = (duration: string) => {
    if (duration === 'overnight') return 24 * 60;
    const hours = duration.match(/(\d+(?:\.\d+)?)\s*hours?/);
    const mins = duration.match(/(\d+)\s*mins?/);
    return (hours ? parseFloat(hours[1]) * 60 : 0) + (mins ? parseInt(mins[1], 10) : 0);
};

const formatDuration = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
};

interface RateTableProps {
    title: string;
    rates?: Record<string, string | number>;
}

const RateTable: React.FC<RateTableProps> = ({ title, rates }) => {
    const sortedRates = Object.entries(rates || {})
        .filter(([_, value]) => value !== '')
        .sort(([durationA], [durationB]) => {
            const timeA = timeToMinutes(durationA);
            const timeB = timeToMinutes(durationB);
            return timeA - timeB;
        });

    return (
        <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                {sortedRates.map(([duration, rate]) => (
                    <div
                        key={duration}
                        className="bg-gray-100 dark:bg-zinc-800 rounded-md p-2 text-center"
                    >
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">
                            {formatDuration(duration)}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {String(rate)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface UserDetailsProps {
    preferences?: {
        escorting?: {
            locationInfo?: {
                willTravel?: boolean;
                canAccommodate?: boolean;
            };
            rates?: {
                inCall?: Record<string, string | number>;
                outCall?: Record<string, string | number>;
            };
        };
    };
}

export const RatesSection: React.FC<{ userDetails: UserDetailsProps }> = ({ userDetails }) => {
    if (!userDetails.preferences?.escorting?.locationInfo?.willTravel &&
        !userDetails.preferences?.escorting?.locationInfo?.canAccommodate) {
        return null;
    }

    return (
        <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Rates</h2>
            </div>
            <div className="space-y-4">
                {userDetails.preferences?.escorting?.locationInfo?.canAccommodate && (
                    <RateTable
                        title="In-call Rates"
                        rates={userDetails.preferences.escorting.rates?.inCall}
                    />
                )}
                {userDetails.preferences?.escorting?.locationInfo?.willTravel && (
                    <RateTable
                        title="Out-call Rates"
                        rates={userDetails.preferences.escorting.rates?.outCall}
                    />
                )}
            </div>
        </Card>
    );
};

export default RatesSection;