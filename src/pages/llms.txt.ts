import type { APIRoute } from "astro";
import { SITE_URL, CONTACT_EMAIL } from "../consts";

export const GET: APIRoute = () => {
	const body = `# Haveaspot

> Haveaspot is a UK online booking platform for community venues (village halls, schools, sports and leisure spaces, arts and culture venues and some commercial spaces). Venues list for free and pay no commission: bookers pay a small booking fee on top of the venue's hire cost, and the venue keeps 100% of its hire fee. Payments are handled by Stripe. Strapline: "Book a spot, support a spot." A "Spot" is a venue; a "Booker" is someone hiring one.

Key facts:
- Free for venues: no setup fees, subscriptions or commission.
- Bookers pay a small Booking Fee on top of the Hire Cost; venues set their own Hire Cost and can include VAT if registered.
- A booking is only created once the venue accepts the request; venues can block dates and set their own house rules.
- Payments go through Stripe Connect straight to the venue's bank account; Haveaspot never holds venue funds.
- Contact: ${CONTACT_EMAIL}

## Pages
- [About Haveaspot](${SITE_URL}/): what Haveaspot is, venue types and platform features
- [For Spots (venues)](${SITE_URL}/for-spots): how venues list, take bookings and get paid, with FAQs
- [For Bookers](${SITE_URL}/for-bookers): how to find and book a community venue, with FAQs
- [Beta programme](${SITE_URL}/beta): join the free beta for venues, with FAQs
- [Managed onboarding](${SITE_URL}/managed-onboarding): the Haveaspot team sets up your listing for you
- [Book a demo](${SITE_URL}/book-a-demo)
- [Contact](${SITE_URL}/contact)

## Legal
- [Venue Service Agreement](${SITE_URL}/legal/venue-service-agreement)
- [Booker Terms of Service](${SITE_URL}/legal/booker-terms-of-service)
- [Privacy Policy](${SITE_URL}/legal/privacy-policy)
- [Cookie Policy](${SITE_URL}/legal/cookie-policy)
- [Website Terms of Use](${SITE_URL}/legal/website-terms-of-use)

## Optional
- [Full FAQ text for LLMs](${SITE_URL}/llms-full.txt)
- [Blog](https://blog.haveaspot.com): advice for running and promoting community venues
- [Support centre / knowledge base](https://support.haveaspot.com)
- [Sitemap](${SITE_URL}/sitemap-index.xml)
`;
	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
