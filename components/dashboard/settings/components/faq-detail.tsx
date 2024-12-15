// components/faq-details.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { HelpCircle, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient();

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5 text-blue-600 dark:text-blue-400"
            })}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

export default function FAQDetails() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                setUser(user);

                // Fetch user details including faqs
                const { data: userData, error: userDataError } = await supabase
                    .from('users')
                    .select('faqs')
                    .eq('id', user?.id)
                    .single();

                if (userDataError) throw userDataError;

                // Set FAQs from user data
                setFaqs(userData?.faqs || []);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Add resetForm function
    const resetForm = () => {
        setEditingFaq(null);
        // Find and reset the form
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const question = formData.get('question')?.toString().trim();
            const answer = formData.get('answer')?.toString().trim();

            if (!question || !answer) {
                toast.error('Please provide both question and answer');
                return;
            }

            let updatedFaqs: FAQItem[];

            if (editingFaq) {
                updatedFaqs = faqs.map(faq =>
                    faq.id === editingFaq.id
                        ? { ...faq, question, answer }
                        : faq
                );
            } else {
                const newFaq: FAQItem = {
                    id: crypto.randomUUID(),
                    question,
                    answer
                };
                updatedFaqs = [...faqs, newFaq];
            }

            const { error } = await supabase
                .from('users')
                .update({ faqs: updatedFaqs })
                .eq('id', user?.id);

            if (error) throw error;

            setFaqs(updatedFaqs);
            resetForm(); // Add this line to reset the form
            toast.success(editingFaq ? 'FAQ updated successfully' : 'FAQ added successfully');
        } catch (error) {
            console.error('Error saving FAQ:', error);
            toast.error('Failed to save FAQ');
        }

        setIsSubmitting(false);
    };
    const deleteFaq = async (id: string) => {
        try {
            const updatedFaqs = faqs.filter(faq => faq.id !== id);

            const { error } = await supabase
                .from('users')
                .update({ faqs: updatedFaqs })
                .eq('id', user?.id);

            if (error) throw error;

            setFaqs(updatedFaqs);
            toast.success('FAQ deleted successfully');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ');
        }
    };

    return (
        <div className="space-y-8 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Add/Edit FAQ Card */}
                <Card className="p-4 sm:p-6">
                    <SectionHeader
                        icon={<HelpCircle />}
                        title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
                        subtitle="Create or modify frequently asked questions"
                    />
                    <div className="grid gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                Question
                            </label>
                            <Input
                                name="question"
                                defaultValue={editingFaq?.question || ''}
                                placeholder="Enter your question here"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                Answer
                            </label>
                            <textarea
                                name="answer"
                                defaultValue={editingFaq?.answer || ''}
                                placeholder="Enter your answer here"
                                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 text-sm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Add FAQ')}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Existing FAQs */}
                <Card className="p-4 sm:p-6">
                    <SectionHeader
                        icon={<HelpCircle />}
                        title="Existing FAQs"
                    />
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <h3 className="font-medium">{faq.question}</h3>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingFaq(faq)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteFaq(faq.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                        {faqs.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                No FAQs added yet
                            </p>
                        )}
                    </div>
                </Card>
            </form>
        </div>
    );
}