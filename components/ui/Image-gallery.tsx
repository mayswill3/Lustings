import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

interface ImageGalleryProps {
    images: (string | null)[];
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
        // Find first non-null image index, default to 0
        images.findIndex(img => img !== null) ?? 0
    );

    // Filter out null images and get valid image URLs
    const validImages = images.map((img, index) => ({
        url: img,
        index
    })).filter(img => img.url !== null);

    const selectedImageUrl = images[selectedImageIndex] || '/placeholder.jpg';
    const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = event.currentTarget;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        setAspectRatio(naturalWidth / naturalHeight);
    };


    return (
        <div className={classNames('space-y-4', className)}>
            {/* Main Image */}
            <div
                className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                style={{ aspectRatio: aspectRatio }}
            >
                <Image
                    src={selectedImageUrl}
                    alt="Selected profile picture"
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 ease-in-out"
                    priority
                    onLoad={handleImageLoad}
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={classNames(
                            'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200',
                            'group hover:opacity-90',
                            selectedImageIndex === index && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900',
                            !image && 'bg-gray-100 dark:bg-gray-800'
                        )}
                        onClick={() => image && setSelectedImageIndex(index)}
                    >
                        {image ? (
                            <>
                                <Image
                                    src={image}
                                    alt={`Profile picture ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className={classNames(
                                        'transition-transform duration-300',
                                        'group-hover:scale-105'
                                    )}
                                />
                                <div className={classNames(
                                    'absolute inset-0 bg-black/0 transition-all duration-200',
                                    'group-hover:bg-black/10'
                                )} />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm text-gray-400 dark:text-gray-500">
                                    No Image
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;