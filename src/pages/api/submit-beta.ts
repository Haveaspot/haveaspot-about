export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	const { name, email, spotName, role, gdprAgreed, repConfirmed, company_website, load_time } = body;

	if (company_website) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!load_time || Date.now() - Number(load_time) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!name || !email || !spotName || !gdprAgreed || !repConfirmed) {
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
			replyTo: { email, name },
			subject: `Beta signup: ${name} — ${spotName}`,
			htmlContent: `
				<h2>New Beta Signup</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Venue:</strong> ${spotName}</p>
				<p><strong>Role:</strong> ${role || 'Not specified'}</p>
				<hr>
				<p><small>GDPR agreed: yes | Authority confirmed: yes</small></p>
			`,
		}),
	});

	if (!res.ok) {
		return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
