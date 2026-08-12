import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages serves a project site from a sub-path:
 *   https://<user>.github.io/<repo>/
 * so the built asset URLs have to be prefixed with /<repo>/ or every file 404s
 * and the page renders blank.
 *
 * GitHub Actions sets GITHUB_REPOSITORY to "<user>/<repo>", so we derive the
 * prefix automatically. Locally the variable is absent and base stays "/",
 * which is what `npm run dev` needs. Nothing to configure by hand.
 */
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: repository ? `/${repository}/` : '/',
  plugins: [react(), tailwindcss()],
});
