import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { CreditPurchaseDialog } from '@/components/credit-purchase/CreditPurchaseDialog';

interface MultiDayConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (useTrialCredits: boolean) => Promise<void>;
    selectedDays: number;
    credits: {
        regular: number;
        trial: number;
    };
    userId?: string;
}

export const MultiDayConfirmationDialog: React.FC<MultiDayConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    selectedDays,
    credits,
    userId
}) => {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = React.useState(false);

    const handleConfirm = async (useTrialCredits: boolean) => {
        setIsProcessing(true);
        try {
            await onConfirm(useTrialCredits);
            onClose();
        } catch (error) {
            console.error('Error processing confirmation:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const canUseRegularCredits = credits.regular >= selectedDays;
    const canUseTrialCredits = credits.trial >= selectedDays;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Availability Selection</DialogTitle>
                        <DialogDescription>
                            You are about to set availability for {selectedDays} day{selectedDays !== 1 ? 's' : ''}.
                            This will require {selectedDays} credit{selectedDays !== 1 ? 's' : ''}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {!canUseRegularCredits && !canUseTrialCredits && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-5 w-5" />
                                    <p>Insufficient credits. Please purchase more credits to set availability.</p>
                                </div>
                                <Button
                                    onClick={() => setIsPurchaseDialogOpen(true)}
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buy Credits
                                </Button>
                            </div>
                        )}

                        <button
                            onClick={() => handleConfirm(false)}
                            disabled={isProcessing || !canUseRegularCredits}
                            className={`w-full p-4 rounded-lg border transition-colors duration-200 flex items-center justify-between
                                ${canUseRegularCredits
                                    ? 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    : 'opacity-50 cursor-not-allowed'}
                                ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Coins className="h-5 w-5 text-blue-500" />
                                <div className="text-left">
                                    <p className="font-medium">Use Regular Credits</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {credits.regular} available / {selectedDays} required
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleConfirm(true)}
                            disabled={isProcessing || !canUseTrialCredits}
                            className={`w-full p-4 rounded-lg border transition-colors duration-200 flex items-center justify-between
                                ${canUseTrialCredits
                                    ? 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                    : 'opacity-50 cursor-not-allowed'}
                                ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-purple-500" />
                                <div className="text-left">
                                    <p className="font-medium">Use Trial Credits</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {credits.trial} available / {selectedDays} required
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CreditPurchaseDialog
                isOpen={isPurchaseDialogOpen}
                onClose={() => setIsPurchaseDialogOpen(false)}
                userId={userId}
            />
        </>
    );
};