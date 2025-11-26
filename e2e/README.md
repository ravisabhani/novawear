Playwright E2E tests

How to run locally

1. Install dependencies at the repo root and in subprojects:

```powershell
cd backend; npm ci
cd ..\frontend; npm ci
cd ..
npm ci
```

2. Install Playwright browsers:

```powershell
npx playwright install --with-deps
```

3. Start both servers and run tests (the provided script starts frontend (Vite) on :5173 and backend dev on :5000):

```powershell
npm run e2e:install    # (install browsers)
npm run e2e:test       # runs Playwright tests (will start the dev servers automatically)
```

Notes
- Tests expect the server to use ADMIN_SECRET=e2e_secret (start script sets this automatically when using `npm run start:dev`).
- On CI we'll use the same scripts. See .github/workflows/e2e.yml for example setup.
