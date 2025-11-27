# Deployment checklist & how I can help

This document explains exactly what I can do for you and what I need from you to deploy the frontend to Vercel and the backend to Render (the repository already contains CI workflows to help).

If you want me to finish everything, read the options below and provide the details or follow the secure local steps to set repo secrets.

---

## What I can do for you (repo-side)
- Add or update CI workflows in this repository to deploy frontend to Vercel and notify Render to redeploy the backend.
- Add or update documentation and helper scripts to make adding secrets easier.
- Confirm the app builds and tests pass locally.
- Once you set the secrets in GitHub, trigger and monitor the GitHub Actions runs and share results.

What I cannot (safely) do without your credentials or access:
- Create a Vercel project or Render service in your account (I can show exact steps — or you can provide tokens and I can set secrets if you prefer).
- Add values directly into your Vercel/Render account without your authorization.

---

## Two ways you can give me the info (pick one)

1) Secure & recommended (you do this):
   - Use the helper script `scripts/setup-deploy.ps1` locally (requires GitHub CLI `gh` authenticated) to add the required repo secrets. This keeps tokens out of chat.
   - After you run the helper, push to `main` and the GitHub Action will deploy automatically.

2) Provide tokens here (less secure):
   - If you **do** provide tokens and IDs here, I can add them to the repo workflows or give step-by-step instructions. However, sending secrets in chat is not recommended.

---

## Exactly what I need (secrets & values)

Frontend (Vercel) — these are used only by the GitHub Action that triggers Vercel deploys:
- `VERCEL_TOKEN` — a Personal/Team token that the Vercel Action will use.
- `VERCEL_ORG_ID` — your Vercel org ID.
- `VERCEL_PROJECT_ID` — the specific Vercel project ID for the `frontend` project.

Client runtime envs (set in Vercel UI) — not GitHub secrets:
- `VITE_API_URL` — production URL of your deployed backend API (e.g. `https://api.example.com/api`).

Backend (Render) — optionally used for the backend deployment GitHub Action:
- `RENDER_API_KEY` — Render's API key to trigger service re-deploys.
- `RENDER_SERVICE_ID` — the service id of the Render service.

Backend runtime environment variables (set inside Render dashboard for your service):
- `MONGODB_URI` — Mongo Atlas / Mongo connection string (production DB). Use a managed DB; include credentials.
- `JWT_SECRET` — your JWT secret (secure value).
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — if your app needs to send real emails from the backend (optional; you can leave email off or use a separate mail provider/Render secrets).

---

## How to add the GitHub repo secrets safely (recommended)

Option A — Run the helper (quick & safe):
1. Install GitHub CLI and login:
   - `gh auth login`
2. From the repo root run the helper script (PowerShell):
```powershell
cd C:\Users\ravis\novawear-mern
.\scripts\setup-deploy.ps1
```
3. The script will prompt you for the values and call `gh secret set` for each secret.

Option B — Add via GitHub repo UI:
1. Go to your repository → Settings → Secrets and variables → Actions → New repository secret
2. Add each of the secrets names above and paste their values.

---

## After secrets are added — what I will do for you
1. Confirm the secrets are present (you can tell me you added them, or I'll see successful workflow runs).
2. Push a small repository update (if necessary) to ensure the workflow runs and deploys the frontend to Vercel.
3. Verify the Vercel build succeeded and confirm final site URL.
4. For the backend, I will help you set render service env vars, or verify the Render redeploy is triggered from GitHub Actions and confirm the deployment logs.

---

## Important notes on security
- Do NOT store DB connection strings or long-lived secret tokens in the repo files. Always use host provider's environment variable mechanisms (Render/Vercel/GH Secrets).
- If you want me to set secrets, the safest approach is to run the helper script locally (Option A) so values remain on your machine and GitHub handles secret storage.

---

If you want me to finish everything for you now, tell me:
1) Which option you prefer to provide secrets (Option A — you run helper locally; Option B — you paste secrets here right now),
2) If you already created a Vercel project for `frontend` and/or a Render service for `backend` (share project/service names if yes),
3) Whether you want the backend hosted on Render (recommended because I included a workflow) or somewhere else.

I’ll handle the repo-side work (update docs, verify CI workflows, push any required tweaks) once you confirm how you want to provide secrets. 
