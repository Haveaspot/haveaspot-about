export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const {
		forename,
		surname,
		email,
		message,
		marketingOptIn,
		honeypot,
		elapsed,
		captchaA,
		captchaB,
		captchaAnswer,
	} = req.body;

	// ── Trap 1: Honeypot ─────────────────────────────────────────────────────
	if (honeypot) {
		return res.status(200).json({ ok: true });
	}

	// ── Trap 2: Time trap ────────────────────────────────────────────────────
	if (!elapsed || Number(elapsed) < 3000) {
		return res.status(400).json({
			error: 'Form submitted too quickly. Please take a moment and try again.',
		});
	}

	// ── Trap 3: CAPTCHA validation ───────────────────────────────────────────
	const expectedAnswer = Number(captchaA) + Number(captchaB);
	if (Number(captchaAnswer) !== expectedAnswer) {
		return res.status(400).json({
			error: 'Incorrect answer to the security check. Please try again.',
		});
	}

	// ── Trap 4: URL / link injection ─────────────────────────────────────────
	const urlRegex = /(https?:\/\/|www\.|<a[\s>])/i;
	if (urlRegex.test(forename) || urlRegex.test(surname) || urlRegex.test(message)) {
		return res.status(400).json({
			error: 'For security reasons, please do not include links in your submission.',
		});
	}

	// ── Required fields ──────────────────────────────────────────────────────
	if (!forename || !surname || !email || !message) {
		return res.status(400).json({ error: 'Please fill in all required fields.' });
	}

	// ── Send via Brevo ───────────────────────────────────────────────────────
	const htmlContent = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #021300;">
			<h2 style="border-bottom: 2px solid #021300; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
				New Contact Enquiry
			</h2>
			<table style="width: 100%; border-collapse: collapse; font-size: 15px;">
				<tr>
					<td style="padding: 0.6rem 0; font-weight: bold; width: 160px; vertical-align: top;">Name</td>
					<td style="padding: 0.6rem 0;">${esc(forename)} ${esc(surname)}</td>
				</tr>
				<tr>
					<td style="padding: 0.6rem 0; font-weight: bold; vertical-align: top;">Email</td>
					<td style="padding: 0.6rem 0;"><a href="mailto:${esc(email)}" style="color: #021300;">${esc(email)}</a></td>
				</tr>
				<tr>
					<td style="padding: 0.6rem 0; font-weight: bold; vertical-align: top;">Message</td>
					<td style="padding: 0.6rem 0; white-space: pre-wrap;">${esc(message)}</td>
				</tr>
				<tr>
					<td style="padding: 0.6rem 0; font-weight: bold; vertical-align: top;">Marketing opt-in</td>
					<td style="padding: 0.6rem 0;">${marketingOptIn ? 'Yes' : 'No'}</td>
				</tr>
			</table>
			<p style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
				Submitted via the Haveaspot Contact Form
			</p>
		</div>
	`;

	try {
		const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'api-key': process.env.BREVO_API_KEY,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				sender: { name: 'Haveaspot Contact Form', email: 'support@haveaspot.com' },
				to: [{ email: 'support@haveaspot.com', name: 'Haveaspot Support' }],
				replyTo: { email: esc(email), name: `${esc(forename)} ${esc(surname)}` },
				subject: `New Enquiry from ${esc(forename)} ${esc(surname)}`,
				htmlContent,
			}),
		});

		if (!brevoRes.ok) {
			const err = await brevoRes.json().catch(() => ({}));
			console.error('Brevo error:', err);
			return res.status(500).json({ error: 'Failed to send your message. Please try again.' });
		}

		return res.status(200).json({ ok: true });
	} catch (err) {
		console.error('Function error:', err);
		return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
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
