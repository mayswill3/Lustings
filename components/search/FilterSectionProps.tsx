import React from "react";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search } from "lucide-react";
import { NATIONALITIES } from "@/constants/nationalities";
import PHYSICAL_OPTIONS from "@/constants/physical";
import GENDERS from "@/constants/gender";
import AGE_RANGES from "@/constants/age-ranges";
import BOOKING_LENGTHS from "@/constants/booking-length";
import ActivityMultiSelect from "@/components/search/ActivityMultiSelect";
import { DISTANCE_OPTIONS } from "@/utils/location";

interface FilterSectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedGender: string;
    setSelectedGender: (value: string) => void;
    selectedAge: string;
    setSelectedAge: (value: string) => void;
    selectedEthnicity: string;
    setSelectedEthnicity: (value: string) => void;
    selectedNationality: string;
    setSelectedNationality: (value: string) => void;
    selectedActivities: string[];
    setSelectedActivities: (activities: string[]) => void;
    selectedBookingLength: string;
    setSelectedBookingLength: (value: string) => void;
    selectedDistance: number | "";
    setSelectedDistance: (value: number | "") => void;
    searchPostcode: string;
    setSearchPostcode: (value: string) => void;
    postcodeError: string;
    isLoadingPostcode: boolean;
    searchCoordinates: any;
    filterByDistance: () => void;
    clearFilters: () => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    loading: boolean;
}

export function FilterSection({
    searchTerm,
    setSearchTerm,
    selectedGender,
    setSelectedGender,
    selectedAge,
    setSelectedAge,
    selectedEthnicity,
    setSelectedEthnicity,
    selectedNationality,
    setSelectedNationality,
    selectedActivities,
    setSelectedActivities,
    selectedBookingLength,
    setSelectedBookingLength,
    selectedDistance,
    setSelectedDistance,
    searchPostcode,
    setSearchPostcode,
    postcodeError,
    isLoadingPostcode,
    searchCoordinates,
    filterByDistance,
    clearFilters,
    showFilters,
    setShowFilters,
    loading,
}: FilterSectionProps) {
    return (
        <div className="mb-3 p-2 sm:p-3 bg-white rounded">
            {/* Primary Search - Always visible */}
            <div className="relative mb-2">
                <label className="text-xs font-medium text-gray-600">Search</label>
                <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-7 w-full h-8 text-xs"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 h-8 border rounded-md text-xs flex items-center gap-1 bg-gray-50 hover:bg-gray-100"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Filters</span>
                    </button>
                </div>
            </div>

            {/* Primary Filters - Always visible */}
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Gender</label>
                    <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                    >
                        <option value="">All Genders</option>
                        {GENDERS.map((gender) => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Age</label>
                    <select
                        value={selectedAge}
                        onChange={(e) => setSelectedAge(e.target.value)}
                        className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                    >
                        <option value="">Any Age</option>
                        {AGE_RANGES.map((range) => (
                            <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Secondary Filters - Collapsible */}
            <div className={`space-y-2 ${showFilters ? "" : "hidden"}`}>
                {/* Location Search */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Postcode</label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Enter postcode..."
                                value={searchPostcode}
                                onChange={(e) => setSearchPostcode(e.target.value)}
                                className={`h-8 w-full text-xs ${postcodeError ? "border-red-500" : ""}`}
                            />
                            {isLoadingPostcode && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Distance</label>
                        <select
                            value={selectedDistance}
                            onChange={(e) => setSelectedDistance(e.target.value ? Number(e.target.value) : "")}
                            className="h-8 border rounded-md px-2 bg-white text-xs w-full disabled:bg-gray-100"
                            disabled={!searchPostcode || !searchCoordinates}
                        >
                            <option value="">Select radius</option>
                            {DISTANCE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">&nbsp;</label>
                        <button
                            onClick={filterByDistance}
                            disabled={!searchCoordinates || !selectedDistance || loading}
                            className="w-full h-8 bg-purple-600 text-white px-3 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Ethnicity</label>
                        <select
                            value={selectedEthnicity}
                            onChange={(e) => setSelectedEthnicity(e.target.value)}
                            className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                        >
                            <option value="">Any Ethnicity</option>
                            {PHYSICAL_OPTIONS.ETHNICITY.map((ethnicity) => (
                                <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Nationality</label>
                        <select
                            value={selectedNationality}
                            onChange={(e) => setSelectedNationality(e.target.value)}
                            className="h-8 border rounded-md px-2 bg-white text-xs w-full"
                        >
                            <option value="">Any Nationality</option>
                            {NATIONALITIES.map((nation) => (
                                <option key={nation} value={nation}>{nation}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Services</label>
                        <ActivityMultiSelect
                            selectedActivities={selectedActivities}
                            setSelectedActivities={setSelectedActivities}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Duration</label>
                        <select
                            value={selectedBookingLength}
                            onChange={(e) => setSelectedBookingLength(e.target.value)}
                            className="w-full h-8 border rounded-md px-2 bg-white text-xs"
                        >
                            <option value="">Any Duration</option>
                            {BOOKING_LENGTHS.map((length) => (
                                <option key={length.value} value={length.value}>{length.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={clearFilters}
                className="w-full h-8 bg-gray-100 text-gray-700 px-3 rounded-md hover:bg-gray-200 transition-colors text-xs mt-2"
            >
                Clear All
            </button>

            {/* Error messages */}
            {postcodeError && (
                <p className="text-red-500 text-xs mt-1">{postcodeError}</p>
            )}
        </div>
    );
}