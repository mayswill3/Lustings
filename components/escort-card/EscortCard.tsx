'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle } from 'lucide-react';
import PlaceholderImage from '@/public/placeholder-image.jpg';

interface EscortCardProps {
    escort: any;
    isAvailable?: boolean;
    calculateAge: (dob: string) => number;
}

export function EscortCard({ escort, isAvailable, calculateAge }: EscortCardProps) {
    return (
        <Link href={`/profile/${encodeURIComponent(escort.full_name)}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-2 h-full">
                <div className="relative aspect-[3/4]">
                    <img
                        src={escort.profile_pictures?.[0] || PlaceholderImage.src}
                        alt={escort.full_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {isAvailable && (
                            <Badge className="bg-green-500 text-white">
                                Available Today
                            </Badge>
                        )}
                        {escort.verification?.verified && (
                            <Badge className="bg-blue-500 text-white flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white">{escort.full_name}</h3>
                    </div>
                </div>

                <div className="p-2 h-28 flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[14px] text-gray-700 dark:text-gray-200">
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
                            <div className="flex items-center gap-1 text-[14px] text-gray-700 dark:text-gray-200">
                                <span>
                                    <span className="font-semibold capitalize">{escort.location.region || ''}</span>
                                    {escort.location.county && (
                                        <span className="font-semibold capitalize">, {escort.location.county}</span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {escort?.summary && (
                        <div className="h-12 overflow-hidden">
                            <p className="text-[14px] line-clamp-2 capitalize text-gray-600 dark:text-gray-300">
                                {escort.summary}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}