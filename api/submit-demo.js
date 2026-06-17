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

	const formattedDate = preferredDate
		? new Date(preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		: 'Not specified';

	const htmlContent = `
		<h2>New Demo Request</h2>
		<p><strong>Name:</strong> ${forename} ${surname}</p>
		<p><strong>Email:</strong> ${email}</p>
		<p><strong>Spot:</strong> ${spot}</p>
		<p><strong>Preferred Date:</strong> ${formattedDate}</p>
		<p><strong>Preferred Time:</strong> ${preferredTime}</p>
		<p><strong>Marketing Opt-in:</strong> ${marketingOptIn ? 'Yes' : 'No'}</p>
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
