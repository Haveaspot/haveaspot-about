export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	const { forename, surname, email, message, marketingOptIn, honeypot, elapsed } = body;

	// Honeypot / timing bot protection
	if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!elapsed || Number(elapsed) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!forename || !surname || !email || !message) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
	}

	const apiKey = import.meta.env.BREVO_API_KEY;
	const res = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			'api-key': apiKey,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sender: { name: 'Haveaspot About', email: 'hello@haveaspot.com' },
			to: [{ email: 'hello@haveaspot.com', name: 'Haveaspot' }],
			replyTo: { email, name: `${forename} ${surname}` },
			subject: `Contact form: ${forename} ${surname}`,
			htmlContent: `
				<h2>New Contact Message</h2>
				<p><strong>Name:</strong> ${forename} ${surname}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p>${message.replace(/\n/g, '<br>')}</p>
				<hr>
				<p><small>Marketing opt-in: ${marketingOptIn ? 'yes' : 'no'}</small></p>
			`,
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		console.error('Brevo error (contact):', res.status, err);
		return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
