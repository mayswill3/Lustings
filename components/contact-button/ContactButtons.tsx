import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const ContactButtons = ({ phoneNumber, userName }) => {
    const formatPhoneNumber = (number) => {
        const cleaned = number?.replace(/\D/g, '') || '';
        return cleaned.startsWith('44') ? cleaned : `44${cleaned.substring(1)}`;
    };

    const formattedNumber = formatPhoneNumber(phoneNumber || '07123456789');
    const displayNumber = phoneNumber || '07123 456789';

    // Default message for WhatsApp
    const defaultMessage = `Hi ${userName}, I saw your profile on Tinsellink and would like to meet with you.`;
    const encodedMessage = encodeURIComponent(defaultMessage);

    return (
        <div className="flex flex-col gap-3 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700">
            {/* Phone Number Display */}
            <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 dark:bg-zinc-900 rounded-md">
                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {displayNumber}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {/* Phone Call Button */}
                <a
                    href={`tel:${displayNumber}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md transition-colors duration-200"
                >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Call</span>
                </a>

                {/* WhatsApp Button */}
                <a
                    href={`https://wa.me/${formattedNumber}?text=${encodedMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md transition-colors duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                </a>
            </div>
        </div>
    );
};

export default ContactButtons;