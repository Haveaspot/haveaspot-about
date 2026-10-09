// Single source of truth for the FAQs: rendered by the FAQ components, and fed to the
// FAQPage structured data and llms.txt so they never drift apart.
export interface Faq {
	question: string;
	answer: string;
}

export const betaFaqs: Faq[] = [
	{
		question: "What types of venues can join?",
		answer: "The Beta Programme is open to any community space looking to manage bookings more efficiently. This includes village halls, community centres, church halls, sports clubs, schools, arts spaces, and independent hire venues. If you have a space that can be booked by others, we would love to hear from you.",
	},
	{
		question: "Is it really free?",
		answer: "It is completely free. There are no setup fees, monthly subscriptions, or hidden costs for you to use the platform, both during the Beta Program and after. We want to remove cost as a barrier to helping your community space thrive.",
	},
	{
		question: "Will being on Haveaspot help me get more bookings?",
		answer: "Yes — and for many venues, significantly so. Listing on Haveaspot puts your space in front of people who are actively searching for somewhere to book, something a standalone website rarely achieves without significant investment in SEO or advertising. Booking platforms aggregate demand, meaning Bookers arrive already intending to book rather than just browsing. Add in real-time availability, instant online payments, and a professional booking experience, and venues consistently convert more enquiries than those relying on phone calls or email forms alone. For many community spaces, a well-optimised Haveaspot listing will do more for their bookings than a website ever could.",
	},
	{
		question: "Can Haveaspot reduce the time we spend on admin?",
		answer: "Significantly. Managing a community venue involves a surprising amount of administration — deciphering enquiry emails, maintaining a shared calendar, collecting payments, and chasing bank transfers can easily consume hours every week. Haveaspot replaces all of that with one streamlined system. Enquiries are captured and tracked automatically. Your calendar updates in real time as bookings are confirmed. Payments are collected securely at the point of booking, so there are no invoices to send and no transfers to chase. Booking confirmations and reminders go out automatically, keeping both you and your Bookers informed. For many venues, the time saved on administration alone makes Haveaspot invaluable.",
	},
	{
		question: "Can more than one person manage our account?",
		answer: "Yes. You can invite multiple team members to access and manage your venue account, each with their own permission level. This means day-to-day management is not dependent on a single person — committee members, volunteers, and staff can all be given appropriate access to keep things running smoothly. It gives committees and management teams broader oversight without everything falling on whoever set up the account.",
	},
	{
		question: "How do you make money?",
		answer: "We charge the Booker a small Booking Fee at checkout — the same model used by platforms like Ticketmaster, Airbnb, and Eventbrite that people book through every day. Bookers are already familiar with this and expect it. It means your income is never touched, you pay nothing, and Bookers get the reassurance of a secure, professional booking experience while supporting a local space they care about.",
	},
	{
		question: "What's expected of me?",
		answer: "Primarily, to use the platform for your bookings and provide us with honest feedback. We're looking for your insights on what you love and what could be improved. Your experience will directly shape the future of Haveaspot for all community spaces.",
	},
	{
		question: "How will feedback be collected?",
		answer: "We collect feedback in a few ways. You will receive occasional surveys to share your thoughts on specific features and your overall experience. We also welcome anecdotal feedback — simply tell us what's working and what isn't during our conversations. When you join the programme, we will also provide you with a dedicated feedback email address so you can reach us directly at any time.",
	},
	{
		question: "How long is setup?",
		answer: "The initial setup is very quick. After you sign up, we'll schedule a one-on-one session to get your page built, which usually takes less than an hour. We do all the heavy lifting to get your photos, details, and pricing online.",
	},
	{
		question: "Is it exclusive?",
		answer: "Not at all. There is no requirement for exclusivity. You are free to continue using any existing booking methods you have, like taking bookings over the phone or by email. You can simply add those bookings to your Haveaspot calendar manually to avoid clashes.",
	},
	{
		question: "Can I leave the beta at any time?",
		answer: "Yes, completely. There is no contract, minimum term, or exit penalty. If you decide the programme is not right for you, simply let us know and we will close your account. We hope you won't want to leave, but we believe in making it easy for you to make that choice freely.",
	},
	{
		question: "How do payments work?",
		answer: "The Booker pays the Hire Cost securely through Stripe — a globally trusted payment processor used by millions of businesses worldwide. Stripe handles all funds directly and pays your Hire Cost straight into your designated bank account. Haveaspot never touches your money. You don't have to chase a single invoice.",
	},
	{
		question: "Can I block out dates?",
		answer: "Absolutely. You have full control over your calendar. It's easy to block out any dates or times you need to reserve the hall for committee meetings, local fayres, maintenance, or any other reason.",
	},
	{
		question: "What happens after the beta?",
		answer: "You will be able to continue using the full Haveaspot platform for free, just as you were during the program. As one of our founding partners, you may also get early access to new features we develop in the future.",
	},
];

export const bookerFaqs: Faq[] = [
	{
		question: "How do you support community Venues?",
		answer: "We are passionate about these spaces! We built Haveaspot to bridge the gap between community venues and the people who need them. Most importantly, we don't take any commission from the venue's hire fee. Every penny you pay for the venue goes directly to them, helping them cover costs and keep their doors open.",
	},
	{
		question: "How does Haveaspot make money?",
		answer: "We charge a small Booking Fee on top of the Hire Cost. This allows us to offer our platform for free to community venues, ensuring they have access to the digital tools they need to thrive without eating into their income.",
	},
	{
		question: "Is my booking confirmed straight away?",
		answer: "Not automatically. When you submit a Booking Request, you are asking the Venue to confirm your reservation. A Booking is only created once the Venue accepts your request through the Platform. Until then, your date is not guaranteed. If the Venue rejects your request or it expires without a response, any hold on your payment is automatically released.",
	},
	{
		question: "When does payment actually leave my account?",
		answer: "When you submit a Booking Request, we place a pre-authorisation hold on your payment method for the Total Fee. This reserves the funds but does not charge you. Payment is only captured once the Venue confirms your Booking. If your request is rejected or expires, the hold is released — though the time it takes to clear depends on your bank or card provider.",
	},
	{
		question: "Is my payment secure?",
		answer: "Absolutely. To ensure transactions are processed safely and securely, we use Stripe, the global leader in payment processing. We do not store your card details directly.",
	},
	{
		question: "Are you responsible for my booking?",
		answer: "Think of Haveaspot as the matchmaker. We connect you with the venue and handle the secure payment, but your actual booking agreement is directly with the Venue itself. They are responsible for the condition of the space, honoring the date, and following safety laws.",
	},
	{
		question: "Do you provide insurance?",
		answer: "No, Haveaspot does not provide general liability insurance for bookings. It is the sole responsibility of the venue owner or operator to maintain appropriate liability insurance for their space.",
	},
	{
		question: "Can I cancel or amend my booking?",
		answer: "Yes. If you cancel within 48 hours of your Booking being confirmed (and the event is more than 14 days away), you receive a full refund of the Total Fee minus a small Cancellation Administration Fee of 3% + £0.30 to cover payment processing costs. Outside of that grace period: cancellations more than 14 days before the event receive a 100% refund of the Hire Cost; 7–14 days receives a 50% refund; less than 7 days is non-refundable. The Haveaspot Booking Fee is non-refundable outside the grace period. To amend a booking, you can submit a reschedule request up to 14 days before the scheduled start time.",
	},
	{
		question: "What if the Venue cancels my booking?",
		answer: "If a Venue cancels your confirmed Booking at any time, you will receive a full 100% refund of the Total Fee — including both the Hire Cost and the Haveaspot Booking Fee. We will also do our best to help you find alternative premises, though we are not obligated to do so.",
	},
	{
		question: "Are there specific rules for using a spot?",
		answer: "Yes! Each venue has its own 'House Rules' which you will see during the booking process. Generally, we ask you to treat the venue with care, leave it tidy, be considerate of neighbours, and follow standard laws. Being a 'good guest' helps these community spaces thrive!",
	},
	{
		question: "Am I responsible if my guests cause damage?",
		answer: "Yes. As the Booker, you are responsible for the conduct of all guests, attendees, and anyone else you bring to the Listed Premises during your Booking. If you or your guests cause damage beyond normal wear and tear, you are liable for the cost of repairs. It is worth keeping this in mind when planning events with large numbers of attendees.",
	},
];

export const venueFaqs: Faq[] = [
	{
		question: "Is It Really Free?",
		answer: "It is completely free. There are no setup fees, monthly subscriptions, or hidden costs for you to use the platform, both during the Beta Program and after.",
	},
	{
		question: "Do You Charge A Commission?",
		answer: "No. We do not charge the Venue any commission whatsoever. Every penny of your Hire Cost goes directly to you. Instead, we charge the Booker a small Booking Fee on top of your Hire Cost at the time of booking. This means your income is never touched, and the platform remains completely free for community spots.",
	},
	{
		question: "What Do You Do To Make Payments Secure?",
		answer: "We use Stripe, a globally trusted payment processor, to handle all transactions. This ensures that your income is processed securely and deposited directly into your account.",
	},
	{
		question: "What Is Stripe And Why Do I Need It?",
		answer: "Stripe is the payment processor we use to handle all transactions on the Platform. To list your space and receive payments, you must create a free Stripe Connect Account and complete their identity verification process. Your Hire Cost is paid from Stripe straight into your nominated bank account — Haveaspot never holds your funds. You will be guided through setting up your Stripe account as part of the onboarding process.",
	},
	{
		question: "When Will I Receive My Money?",
		answer: "Payment is taken at the time of booking, so your money is secured up front. Funds typically land in your Stripe account around 7 days after a booking is confirmed, and your balance is then paid out to your bank account every 30 days. Need it sooner? You can release a payout yourself at any time from your Stripe dashboard — though most spots prefer to let the regular cycle run, as keeping a balance available makes refunds effortless if a booker ever needs one. Haveaspot never holds your money: payouts are handled entirely by Stripe.",
	},
	{
		question: "How Do I Set My Hire Cost?",
		answer: "You have full control over your Hire Cost — you set your own rates and can update them at any time. If you are VAT registered, your Hire Cost must include the applicable VAT. If you are not VAT registered, simply set your rate without it. Our system handles the calculation and collection automatically at the time of booking.",
	},
	{
		question: "Do You Provide Insurance?",
		answer: "While we provide the platform for bookings, venues are responsible for their own public liability and building insurance. We recommend checking with your provider to ensure you are covered for third-party hires.",
	},
	{
		question: "How Do You Support Spots?",
		answer: "We offer a suite of free tools to manage bookings, payments, and promotion. Additionally, our support team is available to help with onboarding and any technical queries you may have.",
	},
	{
		question: "How Do I Add A Spot?",
		answer: "Adding a spot is simple. Click the 'Add A Spot' button, follow the step-by-step onboarding wizard to input your venue details, upload photos, and set your availability.",
	},
	{
		question: "Do I Have To Accept Every Booking Request?",
		answer: "No. When a Booker submits a request for your Listed Premises, you are responsible for reviewing it and deciding whether to confirm or decline. A Booking is only created once you accept the request. This gives you full control over who uses your space.",
	},
	{
		question: "Can I Set My Own Rules For My Space?",
		answer: "Yes. You can publish your own House Rules and Venue Terms as part of your listing, which Bookers must acknowledge before completing a Booking. Please be aware that in the event of any conflict between your rules and our Venue Service Agreement — including our Cancellation Policy — our terms take precedence. For full details, please refer to our Venue Service Agreement.",
	},
	{
		question: "Why Have I Already Received An Enquiry?",
		answer: "We may have pre-listed your venue using publicly available information to help bookers find you. You can claim your listing at any time to take full control of your profile. If you would prefer your venue is not listed, simply contact us and we will remove it promptly.",
	},
	{
		question: "Can I Block Out Dates For My Own Use?",
		answer: "Absolutely. You have a 'Block Date' feature in your dashboard that instantly removes availability from the public calendar, ensuring you never get double-booked.",
	},
	{
		question: "What Happens If I Need To Cancel A Confirmed Booking?",
		answer: "You can cancel a confirmed Booking, but please be aware of the financial consequences. If you cancel, the Booker is entitled to a full 100% refund of the Total Fee — including the Hire Cost and the Haveaspot Booking Fee. Because Stripe's payment processing costs are non-refundable, you will be liable to reimburse Haveaspot the Booking Fee for the cancelled booking. We strongly recommend only accepting bookings you are confident you can honour. For full details, please refer to our <a href='/legal/venue-service-agreement' class='vf-answer-link'>Venue Service Agreement</a>.",
	},
];
