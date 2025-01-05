// File: components/profile/delete-profile-section.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const supabase = createClient();

interface DeleteProfileSectionProps {
    userId: string;
}

export const DeleteProfileSection: React.FC<DeleteProfileSectionProps> = ({ userId }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDeleteProfile = async () => {
        if (!userId) return;
        
        setIsDeleting(true);
        try {
            const { data, error } = await supabase.functions.invoke('delete-user-profile', {
                body: { userId }, // Just pass the object directly, supabase.functions.invoke will handle stringification
            });
    
            console.log('Response:', { data, error }); // Add logging
    
            if (error) throw error;
    
            toast.success('Your profile has been deleted');
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error deleting profile:', error);
            toast.error('Failed to delete profile');
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
            <Card className="p-6 shadow-sm border-red-200 dark:border-red-800">
                <SectionHeader
                    icon={<Trash2 size={24} className="text-red-500" />}
                    title="Delete Profile"
                />
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Delete Your Profile
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                This action cannot be undone. All your data, including profile information,
                                credits, and activity history will be permanently deleted.
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Delete My Profile
                    </Button>
                </div>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>
                                This action cannot be undone. This will permanently delete your profile
                                and remove all associated data from our servers.
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Your profile information</li>
                                <li>All credits and credit history</li>
                                <li>All availability settings</li>
                                <li>All verification data</li>
                                <li>All feedback and ratings</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProfile}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, delete my profile'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};