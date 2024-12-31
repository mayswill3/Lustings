// RatesConfiguration.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { CollapsibleSection } from '@/components/ui/collapsible-section';

interface RateType {
    [key: string]: string;
}

interface Rates {
    inCall: RateType;
    outCall: RateType;
}

interface RatesConfigurationProps {
    rates: Rates;
    setRates: (value: React.SetStateAction<Rates>) => void;
    currency: string;
    setCurrency: (value: string) => void;
    fieldReports: string;
    setFieldReports: (value: string) => void;
}

export const RatesConfiguration: React.FC<RatesConfigurationProps> = ({
    rates,
    setRates,
    currency,
    setCurrency,
    fieldReports,
    setFieldReports,
}) => {
    const timeSlots = [
        { id: '15mins', label: '15m' },
        { id: '30mins', label: '30m' },
        { id: '45mins', label: '45m' },
        { id: '1hour', label: '1h' },
        { id: '1.5hours', label: '1.5h' },
        { id: '2hours', label: '2h' },
        { id: '3hours', label: '3h' },
        { id: '4hours', label: '4h' },
        { id: 'overnight', label: 'O/N' },
    ];

    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'inCall' | 'outCall', timeSlot: string) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setRates(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [timeSlot]: value
            }
        }));
    };

    const RateCard = ({ type, rates }: { type: 'inCall' | 'outCall', rates: RateType }) => (
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3">{type === 'inCall' ? 'In-call' : 'Out-call'}</h3>
            <div className="grid grid-cols-2 gap-4">
                {timeSlots.map(({ id, label }) => (
                    <div key={id} className="flex items-center">
                        <span className="text-sm flex-1">{label}</span>
                        <Input
                            type="text"
                            value={rates[id]}
                            onChange={(e) => handleNumberInput(e, type, id)}
                            className="w-20 h-8 text-sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
    return (
        <CollapsibleSection
            title="Rate Configuration"
            icon={<Clock />}
            defaultOpen={false}
        >
            {/* Mobile View */}
            <div className="sm:hidden">
                <RateCard type="inCall" rates={rates.inCall} />
                <RateCard type="outCall" rates={rates.outCall} />
            </div>
            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left px-2 py-1 font-medium text-gray-900 dark:text-white">Duration</th>
                            {timeSlots.map(({ id, label }) => (
                                <th key={id} className="px-2 py-1 font-medium text-gray-900 dark:text-white">{label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-2 py-1 text-gray-900 dark:text-white">In-call</td>
                            {timeSlots.map(({ id }) => (
                                <td key={id} className="px-1 py-1">
                                    <Input
                                        type="text"
                                        value={rates.inCall[id]}
                                        onChange={(e) => handleNumberInput(e, 'inCall', id)}
                                        className="w-16 h-8 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="px-2 py-1 text-gray-900 dark:text-white">Out-call</td>
                            {timeSlots.map(({ id }) => (
                                <td key={id} className="px-1 py-1">
                                    <Input
                                        type="text"
                                        value={rates.outCall[id]}
                                        onChange={(e) => handleNumberInput(e, 'outCall', id)}
                                        className="w-16 h-8 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Field Reports</Label>
                    <Select value={fieldReports} onValueChange={setFieldReports}>
                        <SelectItem value="report1">Field Report 1</SelectItem>
                        <SelectItem value="report2">Field Report 2</SelectItem>
                    </Select>
                </div>
            </div>
        </CollapsibleSection>
    );
};
