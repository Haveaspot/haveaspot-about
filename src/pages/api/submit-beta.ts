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
	const { name, email, spotName, role, honeypot, elapsed } = body as Record<string, string>;

	if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!elapsed || Number(elapsed) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!name || !email || !spotName) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
	}

	const logged = await logToCrm({
		kind: 'beta',
		name,
		email,
		spotName,
		role,
		submissionId: crypto.randomUUID(),
	});
	if (logged) return new Response(JSON.stringify({ ok: true }), { status: 200 });

	const sent = await sendFallbackEmail({
		subject: `Beta signup: ${name} — ${spotName}`,
		heading: 'New Beta Signup',
		replyTo: { email, name },
		rows: [
			['Name', name],
			['Email', email],
			['Venue', spotName],
			['Role', role || 'Not specified'],
		],
	});
	if (!sent) return new Response(JSON.stringify({ error: 'Failed to send.' }), { status: 500 });
	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
