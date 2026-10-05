import { postToCrm, NOT_IN_CRM_NOTE } from './_crm.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ ok: false, error: 'Method not allowed' });
	}

	const {
		forename, surname, spot, role, email,
		authorityConfirmed, marketingOptIn,
		honeypot, elapsed, captchaA, captchaB, captchaAnswer,
	} = req.body;

	if (honeypot) return res.status(400).json({ ok: false, error: 'Spam detected.' });
	if (!elapsed || elapsed < 3000) return res.status(400).json({ ok: false, error: 'Submission too fast.' });
	if (captchaAnswer !== captchaA + captchaB) return res.status(400).json({ ok: false, error: 'Incorrect security answer.' });

	const urlRegex = /https?:\/\/|www\./i;
	if (urlRegex.test(forename) || urlRegex.test(surname) || urlRegex.test(spot)) {
		return res.status(400).json({ ok: false, error: 'Invalid content detected.' });
	}

	if (!forename || !surname || !spot || !email || !authorityConfirmed) {
		return res.status(400).json({ ok: false, error: 'Please fill in all required fields.' });
	}

	// The CRM first: Website contacts is where this is read and replied to. The
	// email below is only the safety net for when the CRM does not take it.
	if (
		await postToCrm({
			kind: 'onboarding',
			forename,
			surname,
			email,
			spot,
			role: role || 'Not given',
			authorityConfirmed: Boolean(authorityConfirmed),
			marketingOptIn: Boolean(marketingOptIn),
		})
	) {
		return res.status(200).json({ ok: true });
	}

	const htmlContent = `
		<h2>New Managed Onboarding Enquiry</h2>
		<p><strong>Name:</strong> ${esc(forename)} ${esc(surname)}</p>
		<p><strong>Spot:</strong> ${esc(spot)}</p>
		<p><strong>Role at Venue:</strong> ${esc(role)}</p>
		<p><strong>Email:</strong> ${esc(email)}</p>
		<p><strong>Authority Confirmed:</strong> Yes</p>
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
				sender: { name: 'Haveaspot Onboarding Form', email: 'noreply@haveaspot.com' },
				to: [{ email: 'support@haveaspot.com', name: 'Haveaspot Support' }],
				replyTo: { email, name: `${forename} ${surname}` },
				subject: `Managed Onboarding Enquiry — ${spot}`,
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
		console.error('Submit onboarding error:', err);
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
