# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
## Deployment notes (Vercel)

When deploying the frontend to Vercel (or any static host) you must set the API base URL at build time using an environment variable that starts with `VITE_` so Vite will expose it to the client.

- Environment variable name: `VITE_API_URL`
- Value: full base API endpoint for your backend including `/api` (for example `https://my-backend.onrender.com/api`)

Important: Vite substitutes `import.meta.env.VITE_API_URL` into the build at compile time. If you don't set `VITE_API_URL` in Vercel before building, the production bundle will contain whatever value was present at build-time (often a localhost fallback seen during development) and the site will attempt to talk to the wrong host.

Steps to fix a failing production build that uses the wrong API host:

1. In your Vercel project settings -> Environment Variables, add `VITE_API_URL` (Production) set to your backend URL (e.g. `https://my-backend.onrender.com/api`).
2. Redeploy (re-run the build) so the environment variable is substituted into the production bundle.
3. Verify in browser devtools (Network tab) the requests go to the backend you expect.

If login still fails after setting the API URL, check the backend CORS and allowed origins (the backend must allow your Vercel app's origin). See the backend README for tips.

