import { SITE_URL, PLATFORM_URL, SITE_NAME, CONTACT_EMAIL, SOCIAL_LINKS } from "../consts";
import type { Faq } from "../data/faqs";

const ORG_ID = `${PLATFORM_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export const organizationSchema = {
	"@type": "Organization",
	"@id": ORG_ID,
	name: SITE_NAME,
	url: PLATFORM_URL,
	logo: `${SITE_URL}/logo.png`,
	description:
		"Haveaspot is an online booking platform for community venues such as village halls, schools, sports clubs and arts spaces in the UK. Venues list for free and take no commission; bookers pay a small booking fee.",
	email: CONTACT_EMAIL,
	areaServed: { "@type": "Country", name: "United Kingdom" },
	sameAs: SOCIAL_LINKS,
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "customer support",
		email: CONTACT_EMAIL,
		availableLanguage: "English",
	},
};

export const websiteSchema = {
	"@type": "WebSite",
	"@id": SITE_ID,
	url: SITE_URL,
	name: `${SITE_NAME} | About`,
	publisher: { "@id": ORG_ID },
	inLanguage: "en-GB",
};

export function webPageSchema(opts: { path: string; title: string; description: string; type?: string }) {
	return {
		"@type": opts.type ?? "WebPage",
		"@id": `${SITE_URL}${opts.path}#webpage`,
		url: `${SITE_URL}${opts.path}`,
		name: opts.title,
		description: opts.description,
		isPartOf: { "@id": SITE_ID },
		about: { "@id": ORG_ID },
		inLanguage: "en-GB",
	};
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: c.name,
			item: `${SITE_URL}${c.path}`,
		})),
	};
}

export function faqSchema(faqs: Faq[]) {
	return {
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.question,
			acceptedAnswer: { "@type": "Answer", text: stripHtml(f.answer) },
		})),
	};
}

export { stripHtml };
