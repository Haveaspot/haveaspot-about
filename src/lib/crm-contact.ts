/**
 * Sending a website form submission to the Haveaspot CRM.
 *
 * The CRM (Website contacts) is where these are read, replied to and recorded, so
 * it is tried first. The old email to hello@ is kept only as a safety net: if the
 * CRM does not take a submission (it is down, a secret is wrong or missing), the
 * enquiry would otherwise vanish while the visitor is told it was received.
 *
 * CRM_CONTACT_API_URL / CRM_CONTACT_API_SECRET are optional on purpose: unset
 * means "the CRM is not wired up", which falls back to email rather than breaking
 * the form. Nothing here ever throws to the visitor.
 */

export function escapeHtml(value: unknown): string {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const EMAIL = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

/** Returns true only when the CRM accepted the submission. */
export async function logToCrm(payload: Record<string, unknown>): Promise<boolean> {
	const url = import.meta.env.CRM_CONTACT_API_URL;
	const secret = import.meta.env.CRM_CONTACT_API_SECRET;
	if (!url || !secret) return false;

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
			body: JSON.stringify(payload),
		});
		if (!res.ok) {
			console.error('[contact] CRM logging failed', res.status, await res.text().catch(() => ''));
			return false;
		}
		return true;
	} catch (err) {
		console.error('[contact] CRM logging failed', err);
		return false;
	}
}

/**
 * The email to hello@, used only when the CRM did not take the submission. Every
 * value is escaped: it all came from a public form and lands in an HTML email.
 */
export async function sendFallbackEmail(input: {
	subject: string;
	heading: string;
	replyTo: { email: string; name: string };
	rows: [label: string, value: unknown][];
	footnote?: string;
}): Promise<boolean> {
	const apiKey = import.meta.env.BREVO_API_KEY;
	if (!apiKey) return false;

	const replyTo = EMAIL.test(String(input.replyTo.email)) ? { email: String(input.replyTo.email), name: String(input.replyTo.name).slice(0, 100) } : undefined;
	const body = input.rows
		.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
		.join('');

	try {
		const res = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sender: { name: 'Haveaspot About', email: 'hello@haveaspot.com' },
				to: [{ email: 'hello@haveaspot.com', name: 'Haveaspot' }],
				...(replyTo ? { replyTo } : {}),
				subject: input.subject.replace(/[\r\n]+/g, ' ').slice(0, 200),
				htmlContent: `<h2>${escapeHtml(input.heading)}</h2>${body}${input.footnote ? `<hr><p><small>${escapeHtml(input.footnote)}</small></p>` : ''}<hr><p><small>Sent by email because the CRM did not accept it. It is not in the CRM.</small></p>`,
			}),
		});
		if (!res.ok) {
			console.error('[contact] Brevo error', res.status, await res.text().catch(() => ''));
			return false;
		}
		return true;
	} catch (err) {
		console.error('[contact] Brevo error', err);
		return false;
	}
}
