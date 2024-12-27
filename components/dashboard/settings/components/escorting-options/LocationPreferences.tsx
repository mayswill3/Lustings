// LocationPreferences.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Toggle from '@/components/ui/toggle';
import { CollapsibleSection } from '@/components/ui/collapsible-section';

interface LocationInfo {
    canAccommodate: boolean;
    willTravel: boolean;
}

interface LocationPreferencesProps {
    locationInfo: LocationInfo;
    setLocationInfo: (value: React.SetStateAction<LocationInfo>) => void;
}

export const LocationPreferences: React.FC<LocationPreferencesProps> = ({
    locationInfo,
    setLocationInfo,
}) => {
    return (
        <CollapsibleSection
            title="Location Preferences"
            icon={<MapPin />}
            defaultOpen={true}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between space-x-4">
                    <Label htmlFor="accommodate">In-call Services</Label>
                    <Toggle
                        id="accommodate"
                        checked={locationInfo.canAccommodate}
                        onCheckedChange={(checked) =>
                            setLocationInfo(prev => ({ ...prev, canAccommodate: checked }))
                        }
                    />
                </div>
                <div className="flex items-center justify-between space-x-4">
                    <Label htmlFor="travel">Out-call Services</Label>
                    <Toggle
                        id="travel"
                        checked={locationInfo.willTravel}
                        onCheckedChange={(checked) =>
                            setLocationInfo(prev => ({ ...prev, willTravel: checked }))
                        }
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};
