import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImagePlus, Trash2, Camera } from 'lucide-react';
import GalleryUploader from './gallery-uploader';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
    userDetails: {
        profile_pictures?: (string | null)[];
        id?: string;
    } | null;
}

export default function ProfilePictureUploader(props: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<{ profile_pictures?: (string | null)[]; id?: string } | null>(null);
    const [profilePics, setProfilePics] = useState<(string | null)[]>([null, null, null]);
    const [uploadedUrls, setUploadedUrls] = useState<(string | null)[]>([null, null, null]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Fetch user and userDetails on load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error('Error fetching user:', userError);
                    return;
                }

                setUser(user);

                const { data: userDetails, error: detailsError } = await supabase
                    .from('users')
                    .select('id, profile_pictures')
                    .eq('id', user.id)
                    .single();

                if (detailsError) {
                    console.error('Error fetching user details:', detailsError);
                    return;
                }

                setUserDetails(userDetails);

                const pics = userDetails?.profile_pictures || [];
                setProfilePics([pics[0] || null, pics[1] || null, pics[2] || null]);
                setUploadedUrls([pics[0] || null, pics[1] || null, pics[2] || null]);
            } catch (error) {
                console.error('Unexpected error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

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

                const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    toast.error('Unsupported file type. Please use JPG, PNG, WEBP, or GIF.');
                    return;
                }

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
        return (
            <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Please log in to upload profile pictures</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Profile Pictures
                    </h2>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        Upload up to 3 profile pictures
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {profilePics.map((pic, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-dashed border-gray-300 dark:border-zinc-700 transition-all hover:border-blue-500 hover:shadow-md"
                        >
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
                                className="cursor-pointer flex flex-col items-center justify-center w-full"
                            >
                                {pic ? (
                                    <div className="relative">
                                        <Image
                                            src={pic}
                                            alt={`Profile pic ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="w-40 h-40 object-cover rounded-full border-4 border-blue-500"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                clearFile(index);
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-40 h-40 bg-gray-200 dark:bg-zinc-700 rounded-full">
                                        <Camera size={32} className="text-gray-500 dark:text-zinc-400 mb-2" />
                                        <span className="text-sm text-gray-600 dark:text-zinc-300">
                                            Upload Picture {index + 1}
                                        </span>
                                    </div>
                                )}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-lg flex items-center space-x-2"
                        disabled={isSubmitting || uploadedUrls.every((url) => url === null)}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Profile Pictures'}
                    </Button>
                </div>
            </div>

            <div className="mt-8">
                <GalleryUploader user={user} userDetails={userDetails || {}} />
            </div>
        </div>
    );
}