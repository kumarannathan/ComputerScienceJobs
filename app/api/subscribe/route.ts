import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with a test API key (you'll need to replace this with your actual API key)
const resend = new Resend('re_test_123');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, keywords, location, salary, frequency } = body;

    // Store subscription in localStorage (in a real app, this would go to a database)
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    subscriptions.push(body);
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

    // Send confirmation email
    await resend.emails.send({
      from: 'alerts@computersciencejobs.com',
      to: email,
      subject: 'Job Alert Subscription Confirmed',
      html: `
        <h1>Your Job Alert Subscription is Confirmed!</h1>
        <p>You will receive ${frequency} alerts for jobs matching:</p>
        <ul>
          ${keywords.map(k => `<li>${k}</li>`).join('')}
        </ul>
        ${location ? `<p>Location: ${location}</p>` : ''}
        ${salary ? `<p>Minimum Salary: ${salary}</p>` : ''}
        <p>You can update your preferences anytime by visiting our website.</p>
      `,
    });

    return NextResponse.json({ 
      message: 'Subscription successful',
      status: 200 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      error: 'Failed to subscribe',
      status: 500 
    });
  }
} 