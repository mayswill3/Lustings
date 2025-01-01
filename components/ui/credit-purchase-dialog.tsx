import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { creditPackages } from '@/components/credit-purchase/credit-packages';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const supabase = createClient();

interface CreditPurchaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    credits: {
        regular: number;
        trial: number;
    };
    userId?: string;
}

export const CreditPurchaseDialog: React.FC<CreditPurchaseDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    credits,
    userId
}) => {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [view, setView] = useState<'use' | 'purchase'>('use');

    const canUseRegularCredits = credits.regular > 0;
    const canUseTrialCredits = credits.trial > 0;

    const handlePurchase = async (useTrialCredits: boolean) => {
        if (!userId) return;

        setIsProcessing(true);
        try {
            const creditType = useTrialCredits ? 'trial_credits' : 'credits';
            const currentAmount = useTrialCredits ? credits.trial : credits.regular;

            if (currentAmount <= 0) {
                throw new Error(`No ${useTrialCredits ? 'trial' : 'regular'} credits available`);
            }

            const { error } = await supabase
                .from('users')
                .update({ [creditType]: currentAmount - 1 })
                .eq('id', userId);

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error processing credit purchase:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBuyCredits = async (packageId: string) => {
        try {
            setLoading(packageId);
            console.log('Initiating purchase:', { packageId, userId });

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageId,
                    userId,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error response from checkout API:', error);
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();
            console.log('Checkout session created:', sessionId);

            const stripe = await stripePromise;
            const { error } = await stripe!.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Stripe redirect error:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error initiating purchase:', error);
        } finally {
            setLoading(null);
        }
    };

    const UseCreditsView = () => (
        <>
            <DialogHeader>
                <DialogTitle>Use Credits</DialogTitle>
                <DialogDescription>
                    Choose which type of credits to use for setting your availability status.
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
                            onClick={() => setView('purchase')}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Buy Credits
                        </Button>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => handlePurchase(false)}
                        disabled={isProcessing || credits.regular <= 0}
                        className={`w-full p-4 rounded-lg border transition-colors duration-200 flex items-center justify-between
                            ${credits.regular > 0
                                ? 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'opacity-50 cursor-not-allowed'}
                            ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Coins className="h-5 w-5 text-blue-500" />
                            <div className="text-left">
                                <p className="font-medium">Regular Credits</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {credits.regular} remaining
                                </p>
                            </div>
                        </div>
                        <span className="text-blue-500 font-medium">Use 1 Credit</span>
                    </button>

                    <button
                        onClick={() => handlePurchase(true)}
                        disabled={isProcessing || credits.trial <= 0}
                        className={`w-full p-4 rounded-lg border transition-colors duration-200 flex items-center justify-between
                            ${credits.trial > 0
                                ? 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                : 'opacity-50 cursor-not-allowed'}
                            ${isProcessing ? 'opacity-50 cursor-wait' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-purple-500" />
                            <div className="text-left">
                                <p className="font-medium">Trial Credits</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {credits.trial} remaining
                                </p>
                            </div>
                        </div>
                        <span className="text-purple-500 font-medium">Use 1 Credit</span>
                    </button>
                </div>
            </div>
        </>
    );

    const PurchaseCreditsView = () => (
        <>
            <DialogHeader>
                <DialogTitle>Purchase Credits</DialogTitle>
                <DialogDescription>
                    Select a credit package to purchase. Credits will be added to your account immediately after successful payment.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                {creditPackages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
                    >
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{pkg.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300">{pkg.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-900 dark:text-white">
                                £{pkg.price.toFixed(2)}
                            </span>
                            <Button
                                onClick={() => handleBuyCredits(pkg.id)}
                                disabled={loading === pkg.id}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                {loading === pkg.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Purchase'
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                {view === 'use' ? <UseCreditsView /> : <PurchaseCreditsView />}

                <DialogFooter className="sm:justify-start flex gap-2">
                    {view === 'purchase' && (
                        <Button
                            type="button"
                            onClick={() => setView('use')}
                            disabled={isProcessing}
                        >
                            Back
                        </Button>
                    )}
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
    );
};