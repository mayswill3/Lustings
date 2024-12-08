import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

    // Fetch galleries from user metadata on mount
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

                // Update the users table
                const updateData =
                    gallery === 'free' ? { free_gallery: newGallery } : { private_gallery: newGallery };
                const { error: updateError } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', props.user.id);

                if (updateError) {
                    console.error(`Error saving ${gallery} gallery to database:`, updateError.message);
                    toast.error(`Failed to save ${gallery} gallery to database`);
                } else {
                    toast.success(`Image uploaded to ${gallery} gallery successfully!`);
                }
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

        const updateData = gallery === 'free' ? { free_gallery: galleryState } : { private_gallery: galleryState };

        try {
            const { error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', props.user.id);

            if (error) {
                console.error(`Error updating ${gallery} gallery in database:`, error.message);
                toast.error(`Failed to update ${gallery} gallery in database`);
            } else {
                toast.success(`Image removed from ${gallery} gallery successfully!`);
            }
        } catch (err) {
            console.error('Unexpected error updating gallery:', err);
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
                console.error('Error saving galleries:', error);
                toast.error('Failed to save galleries');
            } else {
                toast.success('Galleries saved successfully!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred');
        }

        setIsSubmitting(false);
    };

    const addImageSlot = (gallery: 'free' | 'private') => {
        if (gallery === 'free') {
            setFreeGallery([...freeGallery, null]); // Adds an empty slot for new uploads
        } else {
            setPrivateGallery([...privateGallery, null]);
        }
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
                                        onClick={() => deleteImage(index, 'free')} // Deletes from state and database
                                        className="mt-2 text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        ref={(el) => (freeInputRefs.current[index] = el!)} // Input reference for uploads
                                        accept="image/*"
                                        className="hidden"
                                        id={`free-file-input-${index}`}
                                        onChange={() => handleUpload(index, 'free')} // Uploads to state and database
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
