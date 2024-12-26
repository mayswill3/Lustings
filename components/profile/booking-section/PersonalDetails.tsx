import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import * as Select from '@radix-ui/react-select';
import { Calendar, Clock, UserCircle, ChevronDownIcon, ChevronUpIcon, Users, Phone } from 'lucide-react';

interface FormData {
    nickname: string;
    first_name: string;
    last_name: string;
    contact_number: string;
    contact_date: string;
    time_start: string;
    time_end: string;
    [key: string]: any;
}

interface PersonalDetailsProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
    timeSlots: string[];
    user: any;
}

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit">
            {React.cloneElement(icon as React.ReactElement, {
                className: "w-5 w-5 text-blue-600 dark:text-blue-400"
            })}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

const TimeSelect = ({ value, onValueChange, placeholder, timeSlots }) => (
    <div className="relative w-full">
        <Select.Root value={value} onValueChange={onValueChange}>
            <Select.Trigger className="inline-flex items-center justify-between w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white dark:bg-zinc-800 pl-10">
                <Select.Value placeholder={placeholder} />
                <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4" />
                </Select.Icon>
            </Select.Trigger>
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <Select.Portal>
                <Select.Content position="popper" className="w-[var(--radix-select-trigger-width)] overflow-hidden bg-white dark:bg-zinc-800 rounded-md border border-gray-200 shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-6">
                        <ChevronUpIcon className="h-4 w-4" />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                        {timeSlots.map((time) => (
                            <Select.Item
                                key={time}
                                value={time}
                                className="relative flex items-center px-8 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 outline-none cursor-default"
                            >
                                <Select.ItemText>{time}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-6">
                        <ChevronDownIcon className="h-4 w-4" />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    </div>
);

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
    formData,
    setFormData,
    timeSlots,
    user
}) => {
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    useEffect(() => {
        if (user.user_metadata.full_name) {
            setFormData({ ...formData, nickname: user.user_metadata.full_name });
        }
    }, [user.user_metadata.full_name]);

    return (
        <Card className="p-4 sm:p-6">
            <SectionHeader
                icon={<Users />}
                title="Your Details"
                subtitle="Please provide your contact information"
            />

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nickname">Nickname</Label>
                        <div className="relative">
                            <Input
                                id="nickname"
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                placeholder="Your name"
                                className="pl-10 bg-gray-50 dark:bg-zinc-800"
                                disabled
                                readOnly
                            />
                            <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <div className="relative">
                                <Input
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className="w-full pl-10 bg-gray-50 dark:bg-zinc-800"
                                />
                                <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <div className="relative">
                                <Input
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className="w-full pl-10 bg-gray-50 dark:bg-zinc-800"
                                />
                                <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <div className="relative">
                            <Input
                                id="contact_number"
                                required
                                type="tel"
                                value={formData.contact_number}
                                onChange={(e) => handleInputChange('contact_number', e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-zinc-800"
                            />
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                </div>

                <Separator />

                <div className="space-y-4">
                    <Label>Preferred Contact Time</Label>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type="date"
                                value={formData.contact_date}
                                onChange={(e) => handleInputChange('contact_date', e.target.value)}
                                className="pl-10 bg-white dark:bg-zinc-800"
                                required
                            />
                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TimeSelect
                                value={formData.time_start}
                                onValueChange={(value) => handleInputChange('time_start', value)}
                                placeholder="Start time"
                                timeSlots={timeSlots}
                            />
                            <TimeSelect
                                value={formData.time_end}
                                onValueChange={(value) => handleInputChange('time_end', value)}
                                placeholder="End time"
                                timeSlots={timeSlots}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PersonalDetails;