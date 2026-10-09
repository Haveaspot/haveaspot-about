// @ts-check

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://about.haveaspot.com',
	output: 'static',
	adapter: vercel(),
	integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
	build: { inlineStylesheets: 'always' },
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Poppins',
			cssVariable: '--font-poppins',
			weights: [300, 400, 500, 600, 700, 800],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
