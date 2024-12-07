import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
}

export default function GalleryUploader({ user }: Props) {
    const [freeGallery, setFreeGallery] = useState<(string | null)[]>([]);
    const [privateGallery, setPrivateGallery] = useState<(string | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const freeInputRefs = useRef<HTMLInputElement[]>([]);
    const privateInputRefs = useRef<HTMLInputElement[]>([]);

    // Fetch galleries from user metadata on mount
    useEffect(() => {
        if (user?.user_metadata?.freeGallery) {
            setFreeGallery(user.user_metadata.freeGallery);
        }
        if (user?.user_metadata?.privateGallery) {
            setPrivateGallery(user.user_metadata.privateGallery);
        }
    }, [user]);

    const handleUpload = async (index: number, gallery: 'free' | 'private') => {
        if (!user) {
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

                const fullFilename = `${gallery}-gallery/user_${user.id}/image_${Date.now()}.${fileExtension}`;

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

                toast.success(`Image uploaded to ${gallery} gallery successfully!`);
            } catch (err) {
                console.error(`Unexpected error uploading file to ${gallery} gallery:`, err);
                toast.error(`Unexpected error occurred while uploading to ${gallery} gallery`);
            }
        }
    };

    const deleteImage = async (index: number, gallery: 'free' | 'private') => {
        const galleryState = gallery === 'free' ? [...freeGallery] : [...privateGallery];
        galleryState.splice(index, 1);

        gallery === 'free' ? setFreeGallery(galleryState) : setPrivateGallery(galleryState);

        const updateData = gallery === 'free' ? { freeGallery: galleryState } : { privateGallery: galleryState };

        try {
            const { error } = await supabase.auth.updateUser({ data: updateData });
            if (error) {
                console.error(`Error updating ${gallery} gallery metadata:`, error.message);
                toast.error(`Failed to update ${gallery} gallery metadata`);
            } else {
                toast.success(`Image removed from ${gallery} gallery successfully!`);
            }
        } catch (err) {
            console.error('Unexpected error updating gallery metadata:', err);
            toast.error('Unexpected error occurred');
        }
    };

    const addImageSlot = (gallery: 'free' | 'private') => {
        if (gallery === 'free') {
            setFreeGallery([...freeGallery, null]);
        } else {
            setPrivateGallery([...privateGallery, null]);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error('Please log in to save your galleries');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: freeError } = await supabase.auth.updateUser({
                data: { freeGallery },
            });

            if (freeError) {
                console.error('Error saving free gallery:', freeError);
                toast.error('Failed to save free gallery');
            }

            const { error: privateError } = await supabase.auth.updateUser({
                data: { privateGallery },
            });

            if (privateError) {
                console.error('Error saving private gallery:', privateError);
                toast.error('Failed to save private gallery');
            }

            if (!freeError && !privateError) {
                toast.success('Galleries saved successfully!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-6">Galleries</h2>

            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Free Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                    {freeGallery.map((image, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {image ? (
                                <>
                                    <img src={image} alt={`Free gallery ${index + 1}`} className="w-28 h-28" />
                                    <button
                                        onClick={() => deleteImage(index, 'free')}
                                        className="mt-2 text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        ref={(el) => (freeInputRefs.current[index] = el!)}
                                        accept="image/*"
                                        className="hidden"
                                        id={`free-file-input-${index}`}
                                        onChange={() => handleUpload(index, 'free')}
                                    />
                                    <label
                                        htmlFor={`free-file-input-${index}`}
                                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        Upload Image
                                    </label>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <Button onClick={() => addImageSlot('free')} className="mt-4">
                    Add Image
                </Button>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Private Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                    {privateGallery.map((image, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {image ? (
                                <>
                                    <img src={image} alt={`Private gallery ${index + 1}`} className="w-28 h-28" />
                                    <button
                                        onClick={() => deleteImage(index, 'private')}
                                        className="mt-2 text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        ref={(el) => (privateInputRefs.current[index] = el!)}
                                        accept="image/*"
                                        className="hidden"
                                        id={`private-file-input-${index}`}
                                        onChange={() => handleUpload(index, 'private')}
                                    />
                                    <label
                                        htmlFor={`private-file-input-${index}`}
                                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        Upload Image
                                    </label>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <Button onClick={() => addImageSlot('private')} className="mt-4">
                    Add Image
                </Button>
            </div>

            <Button
                onClick={handleSubmit}
                className="w-full flex justify-center rounded-lg px-4 py-2 text-base font-medium"
                disabled={isSubmitting || (freeGallery.every((url) => !url) && privateGallery.every((url) => !url))}
            >
                {isSubmitting ? 'Saving...' : 'Save Galleries'}
            </Button>
        </div>
    );
}
