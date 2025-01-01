// GalleryGrid.tsx
import React from 'react';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

interface GalleryGridProps {
    images: (string | null)[];
    className?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
    const validImages = images?.filter(img => img !== null) || [];

    if (!validImages.length) {
        return (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <ImagePlus className="w-12 h-12 mb-4" />
                <p>No images available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {validImages.map((image, index) => (
                <div
                    key={index}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                    <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </div>
            ))}
        </div>
    );
};

export default GalleryGrid;