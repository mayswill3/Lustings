import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImagePlus, Camera, Clock, Info, Trash2 } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import Toggle from '@/components/ui/toggle';

const supabase = createClient();

interface Props {
    user: User | null | undefined;
}

const VerificationUploader = ({ user }: Props) => {
    const [uploadedFiles, setUploadedFiles] = useState<(string | null)[]>([null, null, null]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBritish, setIsBritish] = useState(false);
    const [randomNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));
    const [verificationStatus, setVerificationStatus] = useState<'not_verified' | 'submitted' | 'verified'>('not_verified');
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const verificationCategories = [
        {
            title: 'Government-issued ID',
            description: 'Passport with edges and all 4 corners visible. Must be clear and legible. No handwritten documents.',
            icon: <ImagePlus className="mb-2" size={24} />,
            show: true
        },
        {
            title: 'Verification Photo & Photo ID',
            description: `Hold your ID and a sign showing: ${randomNumber}, ${new Date().toLocaleDateString()}, and Tinsellink.com`,
            icon: <Camera className="mb-2" size={24} />,
            show: true
        },
        {
            title: 'Proof of Presence',
            description: 'Recent British newspaper or local shop receipt with date, time, and address visible',
            icon: <Info className="mb-2" size={24} />,
            show: !isBritish // Hide if British citizen
        }
    ];

    useEffect(() => {
        if (!user) return;

        // Fetch user's verification data
        const fetchVerificationStatus = async () => {
            const { data, error } = await supabase
                .from('verification')
                .select('images_submitted, verified')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching verification data:', error.message);
                return;
            }

            if (data) {
                if (data.verified) {
                    setVerificationStatus('verified');
                } else if (data.images_submitted) {
                    setVerificationStatus('submitted');
                } else {
                    setVerificationStatus('not_verified');
                }
            }
        };

        fetchVerificationStatus();
    }, [user]);

    const handleUpload = async (index: number) => {
        if (!user) {
            toast.error('Please log in to upload verification documents');
            return;
        }

        const inputElement = inputRefs.current[index];
        const selectedFile = inputElement?.files?.[0];

        if (selectedFile) {
            try {
                const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    toast.error('Unsupported file type. Please use JPG, PNG, WEBP, or PDF.');
                    return;
                }

                // Add random number to filename for uniqueness
                const fullFilename = `user_${user.id}/verification_${index + 1}_${randomNumber}.${fileExtension}`;

                const { data, error } = await supabase.storage
                    .from('verifications')
                    .upload(fullFilename, selectedFile, { upsert: true });

                if (error) {
                    console.error(`Error uploading file ${index + 1}:`, error.message);
                    toast.error(`Error uploading file ${index + 1}`);
                    return;
                }

                // Get the public URL for the uploaded file
                const { data: publicUrlData } = await supabase.storage
                    .from('verifications')
                    .getPublicUrl(fullFilename);

                if (publicUrlData) {
                    const updatedUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
                    const newUploadedFiles = [...uploadedFiles];
                    newUploadedFiles[index] = updatedUrl;
                    setUploadedFiles(newUploadedFiles);
                    toast.success(`File ${index + 1} uploaded successfully!`);
                }
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
        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[index] = null;
        setUploadedFiles(newUploadedFiles);
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error('Please log in to save verification files');
            return;
        }

        setIsSubmitting(true);

        const allImagesUploaded = isBritish
            ? uploadedFiles.slice(0, 2).every(file => file !== null)  // For British, check only the first two files
            : uploadedFiles.every(file => file !== null);  // For non-British, check all three files

        try {
            const { error } = await supabase
                .from('verification')
                .upsert(
                    {
                        id: user.id,
                        files: uploadedFiles,
                        is_british: isBritish,
                        verification_number: randomNumber,
                        images_submitted: allImagesUploaded
                    },
                    { onConflict: 'id' }
                );

            if (error) {
                console.error('Error saving verification files:', error);
                toast.error('Failed to save verification files');
            } else {
                toast.success('Verification files saved successfully!');
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
                <p className="text-gray-600">Please log in to upload verification documents</p>
            </div>
        );
    }

    if (verificationStatus === 'verified') {
        return (
            <div className="flex justify-center items-center h-64 bg-green-50 rounded-lg">
                <p className="text-green-600 font-semibold">You are already verified!</p>
            </div>
        );
    }

    if (verificationStatus === 'submitted') {
        return (
            <div className="flex justify-center items-center h-64 bg-yellow-50 rounded-lg">
                <p className="text-yellow-600 font-semibold">Verification submitted, awaiting approval.</p>
            </div>
        );
    }

    return (
        <CollapsibleSection title="Identity Verification" icon={<Clock />} defaultOpen={false}>
            <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm font-medium">Are you a British citizen?</span>
                    <Toggle
                        checked={isBritish}
                        onCheckedChange={setIsBritish}
                        aria-label="Toggle British citizenship"
                    />
                </div>

                <div className="text-sm mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    Your verification number is: <span className="font-semibold">{randomNumber}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verificationCategories.map(
                        (category, index) =>
                            category.show && (
                                <div
                                    key={index}
                                    className="flex flex-col bg-gray-50 dark:bg-zinc-800 rounded-xl p-6 border border-dashed border-gray-300 dark:border-zinc-700 transition-all hover:border-blue-500 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        {category.description}
                                    </p>

                                    <input
                                        type="file"
                                        ref={(el) => (inputRefs.current[index] = el!)}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        id={`file-input-${index}`}
                                        onChange={() => handleUpload(index)}
                                    />

                                    <label
                                        htmlFor={`file-input-${index}`}
                                        className="cursor-pointer flex flex-col items-center justify-center w-full"
                                    >
                                        {uploadedFiles[index] ? (
                                            <div className="relative w-full aspect-square">
                                                <div className="w-full h-full rounded-lg border-4 border-blue-500 overflow-hidden">
                                                    {uploadedFiles[index]?.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                            <p className="text-sm text-gray-600">PDF Document</p>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={uploadedFiles[index] || ''}
                                                            alt={`Uploaded ${category.title}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        clearFile(index);
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full aspect-square bg-gray-200 dark:bg-zinc-700 rounded-lg">
                                                {category.icon}
                                                <span className="text-sm text-gray-600 dark:text-zinc-300">
                                                    Click to upload
                                                </span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            )
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        variant='default'
                        disabled={isSubmitting || uploadedFiles.every((url) => url === null)}
                    >
                        {isSubmitting ? 'Saving...' : 'Submit Verification'}
                    </Button>
                </div>
            </div>
        </CollapsibleSection>
    );
};

export default VerificationUploader;
