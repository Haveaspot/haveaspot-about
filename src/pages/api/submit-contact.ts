export const prerender = false;

import type { APIRoute } from 'astro';
import { logToCrm, sendFallbackEmail } from '../../lib/crm-contact';

export const POST: APIRoute = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400 });
	}
	const { forename, surname, email, message, marketingOptIn, honeypot, elapsed } = body as Record<string, string>;

	// Honeypot / timing bot protection
	if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!elapsed || Number(elapsed) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!forename || !surname || !email || !message) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
	}

	// The CRM is where these are read and replied to. The email below is only the
	// safety net for when it does not take the submission.
	const logged = await logToCrm({
		kind: 'contact',
		forename,
		surname,
		email,
		message,
		marketingOptIn: Boolean(marketingOptIn),
		submissionId: crypto.randomUUID(),
	});
	if (logged) return new Response(JSON.stringify({ ok: true }), { status: 200 });

	const sent = await sendFallbackEmail({
		subject: `Contact form: ${forename} ${surname}`,
		heading: 'New Contact Message',
		replyTo: { email, name: `${forename} ${surname}` },
		rows: [
			['Name', `${forename} ${surname}`],
			['Email', email],
			['Message', message],
		],
		footnote: `Marketing opt-in: ${marketingOptIn ? 'yes' : 'no'}`,
	});
	if (!sent) return new Response(JSON.stringify({ error: 'Failed to send.' }), { status: 500 });
	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
