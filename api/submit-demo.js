import { postToCrm, NOT_IN_CRM_NOTE } from './_crm.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ ok: false, error: 'Method not allowed' });
	}

	const {
		forename, surname, email, spot, preferredDate, preferredTime,
		marketingOptIn, honeypot, elapsed,
		captchaA, captchaB, captchaAnswer,
	} = req.body;

	// Honeypot
	if (honeypot) return res.status(400).json({ ok: false, error: 'Spam detected.' });

	// Time trap — less than 3 seconds
	if (!elapsed || elapsed < 3000) return res.status(400).json({ ok: false, error: 'Submission too fast.' });

	// CAPTCHA
	if (captchaAnswer !== captchaA + captchaB) {
		return res.status(400).json({ ok: false, error: 'Incorrect security answer.' });
	}

	// URL check
	const urlRegex = /https?:\/\/|www\./i;
	if (urlRegex.test(forename) || urlRegex.test(surname) || urlRegex.test(spot)) {
		return res.status(400).json({ ok: false, error: 'Invalid content detected.' });
	}

	// Required fields
	if (!forename || !surname || !email || !spot || !preferredDate || !preferredTime) {
		return res.status(400).json({ ok: false, error: 'Please fill in all required fields.' });
	}

	// The CRM first: Website contacts is where this is read and replied to. The
	// email below is only the safety net for when the CRM does not take it.
	if (
		await postToCrm({
			kind: 'demo',
			forename,
			surname,
			email,
			spot,
			preferredDate,
			preferredTime,
			marketingOptIn: Boolean(marketingOptIn),
		})
	) {
		return res.status(200).json({ ok: true });
	}

	const formattedDate = preferredDate
		? new Date(preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		: 'Not specified';

	const htmlContent = `
		<h2>New Demo Request</h2>
		<p><strong>Name:</strong> ${esc(forename)} ${esc(surname)}</p>
		<p><strong>Email:</strong> ${esc(email)}</p>
		<p><strong>Spot:</strong> ${esc(spot)}</p>
		<p><strong>Preferred Date:</strong> ${esc(formattedDate)}</p>
		<p><strong>Preferred Time:</strong> ${esc(preferredTime)}</p>
		<p><strong>Marketing Opt-in:</strong> ${marketingOptIn ? 'Yes' : 'No'}</p>
		<hr>
		<p><small>${NOT_IN_CRM_NOTE}</small></p>
	`;

	try {
		const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': process.env.BREVO_API_KEY,
			},
			body: JSON.stringify({
				sender: { name: 'Haveaspot Demo Form', email: 'noreply@haveaspot.com' },
				to: [{ email: 'support@haveaspot.com', name: 'Haveaspot Support' }],
				replyTo: { email, name: `${forename} ${surname}` },
				subject: `Demo Request from ${forename} ${surname} — ${spot}`,
				htmlContent,
			}),
		});

		if (!brevoRes.ok) {
			const err = await brevoRes.text();
			console.error('Brevo error:', err);
			return res.status(500).json({ ok: false, error: 'Failed to send email.' });
		}

		return res.status(200).json({ ok: true });
	} catch (err) {
		console.error('Submit demo error:', err);
		return res.status(500).json({ ok: false, error: 'Server error. Please try again.' });
	}
}

function esc(str) {
	return String(str ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
