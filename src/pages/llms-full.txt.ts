import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";
import { venueFaqs, bookerFaqs, betaFaqs } from "../data/faqs";
import { stripHtml } from "../lib/seo";

const section = (title: string, url: string, faqs: { question: string; answer: string }[]) =>
	`## ${title}\nSource: ${url}\n\n` +
	faqs.map((f) => `### ${f.question}\n${stripHtml(f.answer)}`).join("\n\n");

export const GET: APIRoute = () => {
	const body = [
		"# Haveaspot: full FAQ reference\n\n> Haveaspot is a UK community venue booking platform. Free for venues, no commission; bookers pay a small booking fee. See /llms.txt for the overview.",
		section("FAQs for venues (Spots)", `${SITE_URL}/for-spots`, venueFaqs),
		section("FAQs for bookers", `${SITE_URL}/for-bookers`, bookerFaqs),
		section("Beta programme FAQs", `${SITE_URL}/beta`, betaFaqs),
	].join("\n\n");
	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
