import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      sentryVitePlugin({
        org: 'transcribe',
        project: 'transcribe-app',

        // Specify the directory containing build artifacts
        include: './dist',

        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and needs the `project:releases` and `org:read` scopes
        authToken: env.VITE_SENTRY_AUTH_TOKEN,

        // Optionally uncomment the line below to override automatic release name detection
        release: 'PRD',
      }),
      {
        // default settings on build (i.e. fail on error)
        ...eslint(),
        apply: 'build',
      },
      {
        // do not fail on serve (i.e. local development)
        ...eslint({
          failOnWarning: false,
          failOnError: false,
        }),
        apply: 'serve',
        enforce: 'post',
      },
    ],
    server: {
      proxy: {
        '/api/stripe': {
          target: 'https://transcribe.app/api/stripe',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/api/transcribe': {
          target: 'https://transcribe.app/api/transcribe',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/api/contact': {
          target: 'https://transcribe.app/api/contact',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
