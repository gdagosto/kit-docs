import kitDocs from '@gdagosto/kit-docs/node';
import { sveltekit } from '@sveltejs/kit/vite';
import icons from 'unplugin-icons/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()],
};

export default config;
