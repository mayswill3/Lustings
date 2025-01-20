import React, { useState } from 'react';
import { Clock, PlusIcon, MinusIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

const RateControl = ({
    value,
    onChange,
    currency,
    increment
}: {
    value: string;
    onChange: (value: string) => void;
    currency: string;
    increment: number;
}) => {
    const numValue = value ? parseInt(value) : 0;

    const updateValue = (amount: number) => {
        const newValue = Math.max(0, numValue + amount);
        onChange(newValue.toString());
    };

    return (
        <div className="flex items-center w-full gap-3">
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => updateValue(-increment)}
                disabled={numValue < increment}
            >
                <span className="text-base">-</span>
            </Button>
            <div className="font-medium flex-1 text-center">
                {numValue} {currency}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => updateValue(increment)}
            >
                <span className="text-base">+</span>
            </Button>
        </div>
    );
};

const IncrementToggle = ({
    value,
    onChange
}: {
    value: number;
    onChange: (value: number) => void;
}) => (
    <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Step:</span>
        <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => onChange(10)}
                className={`px-3 h-7 text-xs font-medium transition-colors ${value === 10
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700'
                    }`}
            >
                10
            </button>
            <button
                onClick={() => onChange(50)}
                className={`px-3 h-7 text-xs font-medium transition-colors ${value === 50
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700'
                    }`}
            >
                50
            </button>
        </div>
    </div>
);

export const RatesConfiguration: React.FC<RatesConfigurationProps> = ({
    rates,
    setRates,
    currency,
    setCurrency,
    fieldReports,
    setFieldReports,
}) => {
    const [inCallIncrement, setInCallIncrement] = useState<number>(10);
    const [outCallIncrement, setOutCallIncrement] = useState<number>(10);

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

    const handleRateChange = (value: string, type: 'inCall' | 'outCall', timeSlot: string) => {
        setRates(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [timeSlot]: value
            }
        }));
    };

    const RateCard = ({
        type,
        rates,
        increment,
        setIncrement
    }: {
        type: 'inCall' | 'outCall';
        rates: RateType;
        increment: number;
        setIncrement: (value: number) => void;
    }) => (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        {type === 'inCall' ? 'In-call' : 'Out-call'} Rates
                    </h3>
                    <IncrementToggle value={increment} onChange={setIncrement} />
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    {timeSlots.map(({ id, label }) => (
                        <div key={id} className="flex items-center justify-between gap-4">
                            <Label className="text-sm text-gray-600 dark:text-gray-400 w-14">
                                {label}
                            </Label>
                            <div className="flex-1 max-w-[180px]">
                                <RateControl
                                    value={rates[id] || '0'}
                                    onChange={(value) => handleRateChange(value, type, id)}
                                    currency={currency}
                                    increment={increment}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <CollapsibleSection
            title="Rate Configuration"
            icon={<Clock />}
            defaultOpen={false}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="USD">US Dollar</SelectItem>
                            <SelectItem value="EUR">Euro</SelectItem>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RateCard
                        type="inCall"
                        rates={rates.inCall}
                        increment={inCallIncrement}
                        setIncrement={setInCallIncrement}
                    />
                    <RateCard
                        type="outCall"
                        rates={rates.outCall}
                        increment={outCallIncrement}
                        setIncrement={setOutCallIncrement}
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};