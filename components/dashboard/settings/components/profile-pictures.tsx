import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GalleryUploader from './gallery-uploader';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: {
        profile_pictures?: (string | null)[];
        id?: string;
    } | null;
}

export default function ProfilePictureUploader({ user, userDetails }: Props) {
    const [profilePics, setProfilePics] = useState<(string | null)[]>([null, null, null]);
    const [uploadedUrls, setUploadedUrls] = useState<(string | null)[]>([null, null, null]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        // Ensure profilePics and uploadedUrls are always 3 slots
        const pics = userDetails?.profile_pictures || [];
        setProfilePics([
            pics[0] || null,
            pics[1] || null,
            pics[2] || null,
        ]);
        setUploadedUrls([
            pics[0] || null,
            pics[1] || null,
            pics[2] || null,
        ]);
    }, [userDetails]);

    const handleUpload = async (index: number) => {
        if (!user) {
            toast.error('Please log in to upload profile pictures');
            return;
        }

        const inputElement = inputRefs.current[index];
        const selectedFile = inputElement?.files?.[0];

        if (selectedFile) {
            try {
                const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

                // Validate file extension
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    toast.error('Unsupported file type. Please use JPG, PNG, WEBP, or GIF.');
                    return;
                }

                // Create filename
                const fullFilename = `user_${user?.id}/profile_pic_${index + 1}.${fileExtension}`;

                const { data, error } = await supabase.storage
                    .from('profile-pictures')
                    .upload(fullFilename, selectedFile, { upsert: true });

                if (error) {
                    console.error(`Error uploading file ${index + 1}:`, error.message);
                    toast.error(`Error uploading file ${index + 1}`);
                    return;
                }

                const { data: file } = await supabase.storage
                    .from('profile-pictures')
                    .getPublicUrl(data?.path);

                // Add cache-busting query parameter
                const updatedUrl = `${file?.publicUrl}?t=${Date.now()}`;

                const newProfilePics = [...profilePics];
                const newUploadedUrls = [...uploadedUrls];
                newProfilePics[index] = updatedUrl;
                newUploadedUrls[index] = updatedUrl;
                setProfilePics(newProfilePics);
                setUploadedUrls(newUploadedUrls);

                toast.success(`Profile picture ${index + 1} uploaded successfully!`);
            } catch (err) {
                console.error(`Unexpected error uploading file ${index + 1}:`, err);
                toast.error('Unexpected error occurred while uploading');
            }
        }
    };


    const clearFile = (index: number) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].value = '';
        }
        const newProfilePics = [...profilePics];
        const newUploadedUrls = [...uploadedUrls];
        newProfilePics[index] = null;
        newUploadedUrls[index] = null;
        setProfilePics(newProfilePics);
        setUploadedUrls(newUploadedUrls);
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error('Please log in to save profile pictures');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('users')
                .upsert(
                    {
                        id: userDetails?.id || user.id,
                        profile_pictures: uploadedUrls,
                    },
                    { onConflict: 'id' }
                );

            if (error) {
                console.error('Error saving profile pictures:', error);
                toast.error('Failed to save profile pictures');
            } else {
                toast.success('Profile pictures saved successfully!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred');
        }

        setIsSubmitting(false);
    };

    if (!user) {
        return <div>Please log in to upload profile pictures</div>;
    }

    return (
        <>
            <div className="container mx-auto mt-8 max-w-[800px]">
                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-6">
                    Profile Pictures
                </h2>

                <div className="grid grid-cols-3 gap-4">
                    {profilePics.map((pic, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div>
                                <input
                                    type="file"
                                    ref={(el) => (inputRefs.current[index] = el!)}
                                    accept="image/*"
                                    className="hidden"
                                    id={`file-input-${index}`}
                                    onChange={() => handleUpload(index)}
                                />
                                <label
                                    htmlFor={`file-input-${index}`}
                                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                >
                                    Choose File
                                </label>
                            </div>
                            {pic ? (
                                <div className="mt-4 relative">
                                    <Image
                                        src={pic}
                                        alt={`Profile pic ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className="w-28 h-28 object-cover rounded-full border border-gray-300"
                                    />
                                    <button
                                        onClick={() => clearFile(index)}
                                        className="mt-2 text-sm text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 w-28 h-28 flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-full">
                                    <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full mt-6 flex justify-center rounded-lg px-4 py-2 text-base font-medium"
                    disabled={isSubmitting || uploadedUrls.every((url) => url === null)}
                >
                    {isSubmitting ? 'Saving...' : 'Save Profile Pictures'}
                </Button>
            </div>
            <GalleryUploader user={user} userDetails={userDetails || {}} />
        </>
    );
}
