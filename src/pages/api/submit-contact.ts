export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	const { forename, surname, email, message, gdprAgreed, marketingOptIn, website, load_time } = body;

	// Honeypot / timing checks
	if (website) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!load_time || Date.now() - Number(load_time) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!forename || !surname || !email || !message || !gdprAgreed) {
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
				<p><small>GDPR agreed: yes | Marketing opt-in: ${marketingOptIn ? 'yes' : 'no'}</small></p>
			`,
		}),
	});

	if (!res.ok) {
		return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
