// types/booking.ts

export interface User {
  id: string;
  email?: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  nickname: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  contact_date: string;
  time_start: string;
  time_end: string;
  duration: number;
  overnight: boolean;
  meeting_type: 'in-call' | 'out-call';
  proposed_fee: number;
  address1: string;
  address2: string;
  town: string;
  county: string;
  post_code: string;
  comments: string;
  status: BookingStatus;
  created_at: string;
  recipient_id: string;
  sender_id: string;
  recipient_nickname: string;
  sender_email: string;
  recipient_email: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'declined';
export type ViewFilter = 'all' | 'sent' | 'received';
export type StatusFilter = 'all' | BookingStatus;

export interface BookingFiltersProps {
  viewFilter: ViewFilter;
  statusFilter: StatusFilter;
  setViewFilter: (filter: ViewFilter) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export interface BookingListProps {
  bookings: Booking[];
  user: User;
  handleStatusChange: (id: string, status: BookingStatus) => Promise<void>;
  handleEmailNotification: (booking: Booking, type: 'update') => Promise<void>;
}

export interface BookingCardProps {
  booking: Booking;
  user: User;
  isSentBooking: boolean;
  handleStatusChange: (id: string, status: BookingStatus) => Promise<void>;
  handleEmailNotification: (booking: Booking, type: 'update') => Promise<void>;
}

export interface Feedback {
  id: string;
  booking_id: string;
  sender_id: string;
  recipient_id: string;
  feedback_type: FeedbackType;
  comment: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
}

export type FeedbackType = 'positive' | 'neutral' | 'negative';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  user: User;
}

export interface StatusBadgeProps {
  status: BookingStatus;
}

export interface EmailNotification {
  recipientEmail: string;
  bookingDetails: Booking;
  type: 'new' | 'update';
}

export interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  user: User | null;
  handleStatusChange: (id: string, status: BookingStatus) => Promise<void>;
  handleEmailNotification: (booking: Booking, type: 'update') => Promise<void>;
}
