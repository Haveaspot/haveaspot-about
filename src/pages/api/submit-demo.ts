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
	const { forename, surname, email, spot, preferredDate, preferredTime, marketingOptIn, honeypot, elapsed } = body as Record<string, string>;

	if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!elapsed || Number(elapsed) < 3000) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!forename || !surname || !email || !spot || !preferredDate || !preferredTime) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
	}

	const logged = await logToCrm({
		kind: 'demo',
		forename,
		surname,
		email,
		spot,
		preferredDate,
		preferredTime,
		marketingOptIn: Boolean(marketingOptIn),
		submissionId: crypto.randomUUID(),
	});
	if (logged) return new Response(JSON.stringify({ ok: true }), { status: 200 });

	const sent = await sendFallbackEmail({
		subject: `Demo request: ${forename} ${surname} — ${spot}`,
		heading: 'New Demo Request',
		replyTo: { email, name: `${forename} ${surname}` },
		rows: [
			['Name', `${forename} ${surname}`],
			['Email', email],
			['Venue', spot],
			['Preferred date', preferredDate],
			['Preferred time', preferredTime],
		],
		footnote: `Marketing opt-in: ${marketingOptIn ? 'yes' : 'no'}`,
	});
	if (!sent) return new Response(JSON.stringify({ error: 'Failed to send.' }), { status: 500 });
	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
