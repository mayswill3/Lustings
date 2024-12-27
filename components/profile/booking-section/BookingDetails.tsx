import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Clock, MapPin, PoundSterling } from 'lucide-react';
import Toggle from '@/components/ui/toggle';

interface FormData {
    duration: string;
    proposed_fee: string;
    overnight: boolean;
    meeting_type: 'in-call' | 'out-call';
    address1: string;
    address2: string;
    town: string;
    county: string;
    post_code: string;
    [key: string]: any;
}

interface BookingDetailsProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
}

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5 text-blue-600 dark:text-blue-400"
            })}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

const AddressFields = ({
    formData,
    handleInputChange
}: {
    formData: FormData;
    handleInputChange: (field: string, value: string) => void;
}) => (
    <div className="space-y-4">
        {/* Address Line 1 & 2 on separate rows */}
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-900">Address Line 1</Label>
                <Input
                    value={formData.address1}
                    onChange={(e) => handleInputChange('address1', e.target.value)}
                    placeholder="Enter your street address"
                    required
                    className="mt-2 ml-2 bg-white dark:bg-zinc-800"
                />
            </div>
            <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-900">Address Line 2</Label>
                <Input
                    value={formData.address2}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="mt-2 ml-2 bg-white dark:bg-zinc-800"
                />
            </div>
        </div>

        {/* Town & County */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Town</Label>
                <Input
                    value={formData.town}
                    onChange={(e) => handleInputChange('town', e.target.value)}
                    required
                    className="w-full mt-2 bg-white dark:bg-zinc-800"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">County</Label>
                <Input
                    value={formData.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                    required
                    className="w-full mt-2 bg-white dark:bg-zinc-800"
                />
            </div>
        </div>


        {/* Post Code */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label className="text-sm font-medium text-gray-900">Post Code</Label>
                <Input
                    value={formData.post_code}
                    onChange={(e) => handleInputChange('post_code', e.target.value)}
                    required
                    className="mt-2 bg-white dark:bg-zinc-800"
                />
            </div>
            <div className="hidden md:block">
                {/* Empty div for grid alignment */}
            </div>
        </div>
    </div>
);

export const BookingDetails: React.FC<BookingDetailsProps> = ({
    formData,
    setFormData
}) => {
    const handleInputChange = (field: keyof FormData, value: any) => {
        if (field === 'overnight') {
            // If overnight is being turned on, set duration to 24
            // If overnight is being turned off, reset duration to empty string
            setFormData({
                ...formData,
                overnight: value,
                duration: value ? '24' : ''  // Set to 24 hours for overnight
            });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    return (
        <div className="w-full space-y-8">
            <Card className="p-4 sm:p-6">
                <SectionHeader
                    icon={<Clock />}
                    title="Booking Details"
                    subtitle="Specify your booking preferences"
                />

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Duration (hours)</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    required={!formData.overnight}
                                    disabled={formData.overnight}
                                    className="w-full appearance-none pl-10 bg-white dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder={formData.overnight ? "24 hours for overnight" : "Enter duration"}
                                />
                                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            {formData.overnight && (
                                <p className="text-sm text-gray-500 mt-1">Duration automatically set to 24 hours for overnight bookings</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Proposed Fee (GBP)</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.proposed_fee}
                                    onChange={(e) => handleInputChange('proposed_fee', e.target.value)}
                                    required
                                    className="w-full appearance-none pl-10 bg-white dark:bg-zinc-800"
                                />
                                <PoundSterling className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <Toggle
                        name="overnight"
                        checked={formData.overnight}
                        onCheckedChange={(checked) => handleInputChange('overnight', checked)}
                        label="Overnight"
                    />

                    {/* Rest of the component remains the same */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium block">Meeting Type</Label>
                        <RadioGroup.Root
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            value={formData.meeting_type}
                            onValueChange={(value) =>
                                handleInputChange('meeting_type', value as 'in-call' | 'out-call')
                            }
                            required
                        >
                            {[
                                { value: 'in-call', label: 'In-call' },
                                { value: 'out-call', label: 'Out-call' }
                            ].map(({ value, label }) => (
                                <div
                                    key={value}
                                    className="flex items-center space-x-2 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    <RadioGroup.Item
                                        value={value}
                                        id={value}
                                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <RadioGroup.Indicator
                                            className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600"
                                        />
                                    </RadioGroup.Item>
                                    <Label
                                        className="text-sm cursor-pointer flex-grow"
                                        htmlFor={value}
                                    >
                                        {label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup.Root>
                    </div>
                </div>
            </Card>

            {formData.meeting_type === 'out-call' && (
                <Card className="p-6">
                    <SectionHeader
                        icon={<MapPin />}
                        title="Out-call Address"
                        subtitle="Where would you like to meet?"
                    />
                    <AddressFields
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                </Card>
            )}
        </div>
    );
};


export default BookingDetails;