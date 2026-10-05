/**
 * Sending a website form submission to the Haveaspot CRM (Website contacts).
 *
 * The CRM is where these are read and replied to, so each handler tries it first.
 * The email each handler already sends to support@ is kept as the safety net: if
 * the CRM does not take a submission (it is down, a secret is wrong or missing),
 * the enquiry would otherwise vanish while the visitor is told it was received.
 *
 * The file name starts with an underscore so Vercel does not publish it as an
 * endpoint of its own. Reads its settings at request time. Never throws.
 */
export async function postToCrm(payload) {
	const url = process.env.CRM_CONTACT_API_URL;
	const secret = process.env.CRM_CONTACT_API_SECRET;
	if (!url || !secret) {
		console.warn('[crm] CRM_CONTACT_API_URL / CRM_CONTACT_API_SECRET not set; sending by email only');
		return false;
	}

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
			body: JSON.stringify({ ...payload, submissionId: crypto.randomUUID() }),
		});
		if (!res.ok) {
			console.error('[crm] CRM did not accept the submission', res.status, await res.text().catch(() => ''));
			return false;
		}
		console.log(`[crm] ${payload.kind} submission recorded`);
		return true;
	} catch (err) {
		console.error('[crm] could not reach the CRM', err);
		return false;
	}
}

/** Appended to the fallback email so it is clear this one is not in the CRM. */
export const NOT_IN_CRM_NOTE = 'Sent by email only: the CRM did not accept this submission, so it is not in Website contacts.';
