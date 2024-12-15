// components/profile/gallery-section.tsx
import { ImageIcon, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import GalleryGrid from '@/components/ui/gallery-grid';

interface GallerySectionProps {
    images: (string | null)[];
    isPrivate?: boolean;
}

export const GallerySection = ({ images, isPrivate = false }: GallerySectionProps) => {
    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                {isPrivate ? (
                    <Lock className="w-5 h-5 text-blue-500" />
                ) : (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                )}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isPrivate ? 'Private Gallery' : 'Public Gallery'}
                </h2>
            </div>

            {isPrivate && (!images || images.length === 0) ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Lock className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium">Private Gallery</p>
                    <p className="text-sm">Contact to view private content</p>
                </div>
            ) : (
                <GalleryGrid images={images || []} />
            )}
        </Card>
    );
};
