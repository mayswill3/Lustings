// GalleryGrid.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryGridProps {
    images: (string | null)[];
    className?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, className }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const validImages = images?.filter(img => img !== null) || [];

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        // Prevent scrolling on body when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    };

    const navigateToNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) =>
            prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const navigateToPreviousImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
        );
    };

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    setCurrentImageIndex((prevIndex) =>
                        prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
                    );
                    break;
                case 'ArrowLeft':
                    setCurrentImageIndex((prevIndex) =>
                        prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
                    );
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, validImages.length]);

    if (!validImages.length) {
        return (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <ImagePlus className="w-12 h-12 mb-4" />
                <p>No images available</p>
            </div>
        );
    }

    return (
        <>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className || ''}`}>
                {validImages.map((image, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                        onClick={() => openLightbox(index)}
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

            {/* Lightbox Overlay */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                        onClick={closeLightbox}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Previous button */}
                    {validImages.length > 1 && (
                        <button
                            className="absolute left-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                            onClick={navigateToPreviousImage}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Next button */}
                    {validImages.length > 1 && (
                        <button
                            className="absolute right-4 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
                            onClick={navigateToNextImage}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    {/* Image container */}
                    <div
                        className="relative max-w-[90%] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full overflow-hidden">
                            <Image
                                src={validImages[currentImageIndex]}
                                alt={`Enlarged gallery image ${currentImageIndex + 1}`}
                                layout="intrinsic"
                                width={1200}
                                height={800}
                                objectFit="contain"
                                className="max-h-[90vh] w-auto"
                            />
                        </div>

                        {/* Image counter */}
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                            {currentImageIndex + 1} / {validImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryGrid;