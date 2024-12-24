// components/booking/StatusBadge.tsx
import { Clock, CheckCircle, XCircle } from 'lucide-react';

type StatusType = 'pending' | 'accepted' | 'declined';

interface StatusBadgeProps {
    status: StatusType;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        accepted: 'bg-green-100 text-green-800 border-green-200',
        declined: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
        pending: <Clock className="w-4 h-4 mr-1" />,
        accepted: <CheckCircle className="w-4 h-4 mr-1" />,
        declined: <XCircle className="w-4 h-4 mr-1" />
    };

    return (
        <div
            className={`
                flex items-center 
                px-2.5 py-0.5 
                rounded-full text-xs font-medium 
                border 
                ${variants[status]}
            `}
        >
            {icons[status]}
            <span className="capitalize">{status}</span>
        </div>
    );
};

export default StatusBadge;