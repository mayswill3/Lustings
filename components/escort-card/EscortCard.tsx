'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface EscortCardProps {
    escort: any;
    isAvailable?: boolean;
    calculateAge: (dob: string) => number;
}

export function EscortCard({ escort, isAvailable, calculateAge }: EscortCardProps) {
    return (
        <Link href={`/profile/${encodeURIComponent(escort.full_name)}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-2 h-full">
                {/* Fixed aspect ratio container */}
                <div className="relative aspect-[3/4]">
                    <img
                        src={escort.profile_pictures?.[0] || '/placeholder-image.jpg'}
                        alt={escort.full_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                        {isAvailable && (
                            <Badge className="bg-green-500 text-white">
                                Available Today
                            </Badge>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white">{escort.full_name}</h3>
                    </div>
                </div>

                {/* Fixed height content container */}
                <div className="p-2 h-28 flex flex-col justify-between">
                    {/* Personal details with fixed height */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[14px]">
                            {escort.personal_details?.dob && (
                                <span>
                                    {calculateAge(escort.personal_details.dob)},
                                </span>
                            )}
                            {escort.personal_details?.gender && (
                                <span className="capitalize">
                                    {escort.personal_details.gender},
                                </span>
                            )}
                            {escort.personal_details?.orientation && (
                                <span className="capitalize">
                                    {escort.personal_details.orientation}
                                </span>
                            )}
                        </div>
                        {escort.location && (
                            <div className="flex items-center gap-1 text-[14px]">
                                <span>
                                    <span className="font-semibold capitalize">{escort.location.region || ''}</span>
                                    {escort.location.county && (
                                        <span className="font-semibold capitalize">, {escort.location.county}</span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Summary with fixed height and ellipsis */}
                    {escort?.summary && (
                        <div className="h-12 overflow-hidden">
                            <p className="text-[14px] line-clamp-2 capitalize">
                                {escort.summary}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}