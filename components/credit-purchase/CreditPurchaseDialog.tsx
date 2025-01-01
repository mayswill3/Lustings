// components/credit-purchase/CreditPurchaseDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { creditPackages } from './credit-packages';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const supabase = createClient();

interface CreditPurchaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => Promise<void>; // Add this line
}

export function CreditPurchaseDialog({ isOpen, onClose, userId, onSuccess }: CreditPurchaseDialogProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        try {
            setLoading(packageId);
            console.log('Initiating purchase:', { packageId, userId });

            // Create Stripe Checkout Session
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

            // Store callback in localStorage
            if (onSuccess) {
                localStorage.setItem('creditPurchaseCallback', 'true');
            }

            // Redirect to Stripe Checkout
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
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
                                    onClick={() => handlePurchase(pkg.id)}
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
            </DialogContent>
        </Dialog>
    );
}