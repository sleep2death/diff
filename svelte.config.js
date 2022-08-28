import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: true
		}),
		prerender: {
			// This can be false if you're using a fallback (i.e. SPA mode)
			default: false
		}
	},
	preprocess: {
		postcss: true
	}
};

export default config;
