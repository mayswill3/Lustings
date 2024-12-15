'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UK_REGIONS } from '@/constants/locations';

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
        <span className="min-w-[180px] text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex-1">{children}</div>
    </label>
);

const LocationDetailsSection = ({ userDetails }) => {
    const [selectedRegion, setSelectedRegion] = useState(userDetails?.location?.region || '');
    const [selectedCounty, setSelectedCounty] = useState(userDetails?.location?.county || '');
    const [selectedTown, setSelectedTown] = useState(userDetails?.location?.town || '');
    const [availableCounties, setAvailableCounties] = useState<string[]>([]);
    const [availableTowns, setAvailableTowns] = useState<string[]>([]);

    useEffect(() => {
        if (selectedRegion) {
            setAvailableCounties(UK_REGIONS[selectedRegion]?.counties || []);
        } else {
            setAvailableCounties([]);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedRegion && selectedCounty) {
            setAvailableTowns(UK_REGIONS[selectedRegion]?.towns[selectedCounty] || []);
        } else {
            setAvailableTowns([]);
        }
    }, [selectedRegion, selectedCounty]);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRegion = e.target.value;
        setSelectedRegion(newRegion);
        setSelectedCounty(''); // Reset county when region changes
        setSelectedTown(''); // Reset town when region changes
    };

    const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCounty = e.target.value;
        setSelectedCounty(newCounty);
        setSelectedTown(''); // Reset town when county changes
    };

    const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTown(e.target.value);
    };

    return (
        <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <MapPin size={24} />
                <h2 className="text-lg font-semibold">Location Details</h2>
            </div>
            <div className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="Country">
                        <select
                            name="country"
                            defaultValue="United Kingdom"
                            disabled
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="United Kingdom">United Kingdom</option>
                        </select>
                    </FormField>
                    <FormField label="Region">
                        <select
                            name="region"
                            value={selectedRegion}
                            onChange={handleRegionChange}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="">Select Region</option>
                            {Object.keys(UK_REGIONS).map(region => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="County">
                        <select
                            name="county"
                            value={selectedCounty}
                            onChange={handleCountyChange}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="">Select County</option>
                            {availableCounties.map(county => (
                                <option key={county} value={county}>
                                    {county}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Town">
                        <select
                            name="town"
                            value={selectedTown}
                            onChange={handleTownChange}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        >
                            <option value="">Select Town</option>
                            {availableTowns.map(town => (
                                <option key={town} value={town}>
                                    {town}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField label="Postcode">
                        <Input
                            type="text"
                            name="postcode"
                            defaultValue={userDetails?.location?.postcode ?? ''}
                            placeholder="Enter postcode"
                            className="w-full h-9 sm:h-10"
                        />
                    </FormField>
                    <FormField label="Nearest Station">
                        <Input
                            type="text"
                            name="nearestStation"
                            defaultValue={userDetails?.location?.nearest_station ?? ''}
                            placeholder="Enter nearest station"
                            className="w-full h-9 sm:h-10"
                        />
                    </FormField>
                </div>
            </div>
        </Card>
    );
};

export default LocationDetailsSection;