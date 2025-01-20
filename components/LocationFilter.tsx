import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationFilterProps {
    escorts: any[];
    selectedRegion: string | null;
    selectedCounty: string | null;
    selectedTown: string | null;
    onRegionSelect: (region: string | null) => void;
    onCountySelect: (county: string | null) => void;
    onTownSelect: (town: string | null) => void;
    onClearFilters: () => void;
    ukRegions: Record<string, { counties: string[] }>;
}

const LocationFilter = ({
    escorts,
    selectedRegion,
    selectedCounty,
    selectedTown,
    onRegionSelect,
    onCountySelect,
    onTownSelect,
    onClearFilters,
    ukRegions
}: LocationFilterProps) => {
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showCountyDropdown, setShowCountyDropdown] = useState(false);
    const [showTownDropdown, setShowTownDropdown] = useState(false);

    const getCurrentRegionCounties = () => {
        return selectedRegion ? ukRegions[selectedRegion]?.counties || [] : [];
    };

    const getCurrentCountyTowns = () => {
        if (!selectedRegion || !selectedCounty) return [];
        const escortsInCounty = escorts.filter(e =>
            e.location?.region === selectedRegion &&
            e.location?.county === selectedCounty
        );
        return [...new Set(escortsInCounty.map(e => e.location?.town).filter(Boolean))];
    };

    const handleRegionClick = (region: string) => {
        onRegionSelect(region === selectedRegion ? null : region);
        setShowRegionDropdown(false);
    };

    const handleCountyClick = (county: string) => {
        onCountySelect(county === selectedCounty ? null : county);
        setShowCountyDropdown(false);
    };

    const handleTownClick = (town: string) => {
        onTownSelect(town === selectedTown ? null : town);
        setShowTownDropdown(false);
    };

    return (
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Location:</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    {/* Region Dropdown */}
                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRegionDropdown(!showRegionDropdown);
                                setShowCountyDropdown(false);
                                setShowTownDropdown(false);
                            }}
                            className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                        border border-gray-200 dark:border-gray-600
                        bg-white dark:bg-gray-800 
                        hover:bg-gray-50 dark:hover:bg-gray-700
                        text-gray-900 dark:text-gray-100"
                        >
                            <span className="truncate">{selectedRegion || 'Select Region'}</span>
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        </button>

                        {showRegionDropdown && (
                            <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                            bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-600 
                            rounded-md shadow-lg">
                                {Object.entries(ukRegions).map(([regionName, regionData]) => {
                                    const escortsInRegion = escorts.filter(e => e.location?.region === regionName);
                                    const hasEscorts = escortsInRegion.length > 0;

                                    return (
                                        <button
                                            key={regionName}
                                            onClick={() => {
                                                if (hasEscorts) {
                                                    handleRegionClick(regionName);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between p-3 text-left
                                ${selectedRegion === regionName ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                ${hasEscorts ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}
                                text-gray-900 dark:text-gray-100`}
                                            disabled={!hasEscorts}
                                        >
                                            <span className="truncate font-medium">{regionName}</span>
                                            <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                {escortsInRegion.length}
                                            </Badge>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {selectedRegion && (
                        <>
                            <ChevronRight className="hidden sm:block h-4 w-4 text-gray-400 dark:text-gray-500" />

                            {/* County Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCountyDropdown(!showCountyDropdown);
                                        setShowTownDropdown(false);
                                    }}
                                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                            border border-gray-200 dark:border-gray-600
                            bg-white dark:bg-gray-800 
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            text-gray-900 dark:text-gray-100"
                                >
                                    <span className="truncate">{selectedCounty || 'Select County'}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                </button>

                                {showCountyDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                                bg-white dark:bg-gray-800 
                                border border-gray-200 dark:border-gray-600 
                                rounded-md shadow-lg">
                                        {getCurrentRegionCounties().map(county => {
                                            const escortsInCounty = escorts.filter(e =>
                                                e.location?.region === selectedRegion &&
                                                e.location?.county === county
                                            );
                                            const hasCountyEscorts = escortsInCounty.length > 0;

                                            return (
                                                <button
                                                    key={county}
                                                    onClick={() => {
                                                        if (hasCountyEscorts) {
                                                            handleCountyClick(county);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center justify-between p-3 text-left
                                    ${selectedCounty === county ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                    ${hasCountyEscorts ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}
                                    text-gray-900 dark:text-gray-100`}
                                                    disabled={!hasCountyEscorts}
                                                >
                                                    <span className="truncate">{county}</span>
                                                    <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                        {escortsInCounty.length}
                                                    </Badge>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {selectedCounty && (
                        <>
                            <ChevronRight className="hidden sm:block h-4 w-4 text-gray-400 dark:text-gray-500" />

                            {/* Town Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowTownDropdown(!showTownDropdown);
                                    }}
                                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-md
                            border border-gray-200 dark:border-gray-600
                            bg-white dark:bg-gray-800 
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            text-gray-900 dark:text-gray-100"
                                >
                                    <span className="truncate">{selectedTown || 'Select Town'}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                </button>

                                {showTownDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 sm:right-auto mt-1 sm:w-64 max-h-64 overflow-y-auto
                                bg-white dark:bg-gray-800 
                                border border-gray-200 dark:border-gray-600 
                                rounded-md shadow-lg">
                                        {getCurrentCountyTowns().map(town => {
                                            const escortsInTown = escorts.filter(e =>
                                                e.location?.region === selectedRegion &&
                                                e.location?.county === selectedCounty &&
                                                e.location?.town === town
                                            );

                                            return (
                                                <button
                                                    key={town}
                                                    onClick={() => handleTownClick(town)}
                                                    className={`w-full flex items-center justify-between p-3 text-left
                                    ${selectedTown === town ? 'bg-purple-50 dark:bg-purple-900' : ''}
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    text-gray-900 dark:text-gray-100`}
                                                >
                                                    <span className="truncate">{town}</span>
                                                    <Badge variant="primary" className="ml-2 flex-shrink-0">
                                                        {escortsInTown.length}
                                                    </Badge>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Clear Button */}
                    {(selectedRegion || selectedCounty || selectedTown) && (
                        <button
                            onClick={onClearFilters}
                            className="flex items-center justify-center p-2 rounded-md
                        border border-gray-200 dark:border-gray-600
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        sm:ml-2"
                            title="Clear location filters"
                        >
                            <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default LocationFilter;