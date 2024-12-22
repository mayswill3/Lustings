import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, bookingDetails, type } = body;

    const { data, error } = await resend.emails.send({
      from: 'Bookings <hello@crowdfighter.com>', // Use this for testing
      to: recipientEmail,
      subject: type === 'new' ? 'New Booking Request' : 'Booking Status Update',
      html:
        type === 'new'
          ? `
          <h1>New Booking Request</h1>
          <p>You have received a new booking request:</p>
          <ul>
            <li>Date: ${bookingDetails.contact_date}</li>
            <li>Time: ${bookingDetails.time_start} - ${bookingDetails.time_end}</li>
            <li>Duration: ${bookingDetails.duration} hours</li>
            <li>Type: ${bookingDetails.meeting_type}</li>
          </ul>
        `
          : `
          <h1>Booking Status Update</h1>
          <p>Your booking status has been updated to: ${bookingDetails.status}</p>
          <p>Booking Details:</p>
          <ul>
            <li>Date: ${bookingDetails.contact_date}</li>
            <li>Time: ${bookingDetails.time_start} - ${bookingDetails.time_end}</li>
          </ul>
        `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
