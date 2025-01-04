import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, bookingDetails, type } = body;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 24px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            .logo {
              color: #4F46E5;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 16px;
            }
            .message {
              background-color: #F3F4F6;
              border-radius: 6px;
              padding: 16px;
              margin: 16px 0;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              margin: 16px 0;
            }
            .footer {
              text-align: center;
              color: #6B7280;
              font-size: 14px;
              margin-top: 24px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TinselLink</div>
            </div>
            
            <p>Hi,</p>
            
            <p>You've received a new message from the TinselLink.com website. Please take a moment to review it by clicking the link below:</p>
            
            <div style="text-align: center;">
              <a href="https://tinsellink.com/bookings" class="button">View Message</a>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The TinselLink Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'TinselLink <info@tinsellink.com>',
      to: recipientEmail,
      subject: 'New Message from TinselLink',
      html: emailTemplate
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
