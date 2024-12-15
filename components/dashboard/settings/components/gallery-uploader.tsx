import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImagePlus, Trash2, Lock, Globe, Plus } from 'lucide-react';
import Image from 'next/image';

const supabase = createClient();

interface Props {
    user: { id: string } | null | undefined;
    userDetails: { profile_pictures?: (string | null)[] } | null;
}

export default function GalleryUploader(props: Props) {
    const [freeGallery, setFreeGallery] = useState<(string | null)[]>([]);
    const [privateGallery, setPrivateGallery] = useState<(string | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const freeInputRefs = useRef<HTMLInputElement[]>([]);
    const privateInputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        const fetchGalleries = async () => {
            if (!props.user) return;

            const { data, error } = await supabase
                .from('users')
                .select('free_gallery, private_gallery')
                .eq('id', props.user.id)
                .single();

            if (error) {
                console.error('Error fetching gallery data:', error);
            } else {
                setFreeGallery(data?.free_gallery || []);
                setPrivateGallery(data?.private_gallery || []);
            }
        };

        fetchGalleries();
    }, [props.user]);

    const handleUpload = async (index: number, gallery: 'free' | 'private') => {
        if (!props.user) {
            toast.error('Please log in to upload images');
            return;
        }

        const inputElement =
            gallery === 'free' ? freeInputRefs.current[index] : privateInputRefs.current[index];
        const selectedFile = inputElement?.files?.[0];

        if (selectedFile) {
            try {
                const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    toast.error('Unsupported file type. Please use JPG, PNG, WEBP, or GIF.');
                    return;
                }

                const fullFilename = `${gallery}-gallery/user_${props.user.id}/image_${Date.now()}.${fileExtension}`;

                const { data, error } = await supabase.storage
                    .from(`${gallery}-gallery`)
                    .upload(fullFilename, selectedFile, { upsert: true });

                if (error) {
                    console.error(`Error uploading file to ${gallery} gallery:`, error.message);
                    toast.error(`Error uploading file to ${gallery} gallery`);
                    return;
                }

                const { data: file } = await supabase.storage
                    .from(`${gallery}-gallery`)
                    .getPublicUrl(data?.path);

                const newGallery = gallery === 'free' ? [...freeGallery] : [...privateGallery];
                newGallery[index] = file?.publicUrl || null;
                gallery === 'free' ? setFreeGallery(newGallery) : setPrivateGallery(newGallery);

                const updateData =
                    gallery === 'free' ? { free_gallery: newGallery } : { private_gallery: newGallery };
                const { error: updateError } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', props.user.id);

                if (updateError) {
                    toast.error(`Failed to save ${gallery} gallery to database`);
                } else {
                    toast.success(`Image uploaded to ${gallery} gallery successfully!`);
                }
            } catch (err) {
                toast.error(`Unexpected error occurred while uploading to ${gallery} gallery`);
            }
        }
    };

    const deleteImage = async (index: number, gallery: 'free' | 'private') => {
        const galleryState = gallery === 'free' ? [...freeGallery] : [...privateGallery];
        galleryState.splice(index, 1);

        gallery === 'free' ? setFreeGallery(galleryState) : setPrivateGallery(galleryState);

        const updateData = gallery === 'free' ? { free_gallery: galleryState } : { private_gallery: galleryState };

        try {
            const { error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', props.user.id);

            if (error) {
                toast.error(`Failed to update ${gallery} gallery in database`);
            } else {
                toast.success(`Image removed from ${gallery} gallery successfully!`);
            }
        } catch (err) {
            toast.error('Unexpected error occurred');
        }
    };

    const handleSubmit = async () => {
        if (!props.user) {
            toast.error('Please log in to save your galleries');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    free_gallery: freeGallery,
                    private_gallery: privateGallery,
                })
                .eq('id', props.user.id);

            if (error) {
                toast.error('Failed to save galleries');
            } else {
                toast.success('Galleries saved successfully!');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        }

        setIsSubmitting(false);
    };

    const addImageSlot = (gallery: 'free' | 'private') => {
        if (gallery === 'free') {
            setFreeGallery([...freeGallery, null]);
        } else {
            setPrivateGallery([...privateGallery, null]);
        }
    };

    const GallerySection = ({ type, images, inputRefs }: {
        type: 'free' | 'private',
        images: (string | null)[],
        inputRefs: React.MutableRefObject<HTMLInputElement[]>
    }) => (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    {type === 'free' ? (
                        <Globe className="w-5 h-5 text-green-500" />
                    ) : (
                        <Lock className="w-5 h-5 text-purple-500" />
                    )}
                    <h3 className="text-lg sm:text-xl font-bold">
                        {type === 'free' ? 'Public Gallery' : 'Private Gallery'}
                    </h3>
                </div>
                <Button
                    onClick={() => addImageSlot(type)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Image
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative group bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 border border-gray-200 dark:border-zinc-700"
                    >
                        {image ? (
                            <div className="relative w-full h-48 sm:h-56">
                                <Image
                                    src={image}
                                    alt={`${type} gallery ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                                <button
                                    onClick={() => deleteImage(index, type)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    ref={(el) => (inputRefs.current[index] = el!)}
                                    accept="image/*"
                                    className="hidden"
                                    id={`${type}-file-input-${index}`}
                                    onChange={() => handleUpload(index, type)}
                                />
                                <label
                                    htmlFor={`${type}-file-input-${index}`}
                                    className="flex flex-col items-center justify-center w-full h-48 sm:h-56 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Upload Image</span>
                                </label>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                    Image Galleries
                </h2>
                {/* <Button
                    onClick={handleSubmit}
                    className="mt-4 sm:mt-0 px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center"
                    disabled={isSubmitting || (freeGallery.every((url) => !url) && privateGallery.every((url) => !url))}
                >
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                </Button> */}
            </div>

            <div className="space-y-6">
                <GallerySection type="free" images={freeGallery} inputRefs={freeInputRefs} />
                <GallerySection type="private" images={privateGallery} inputRefs={privateInputRefs} />
            </div>
        </div>
    );
}