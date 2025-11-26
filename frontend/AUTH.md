Authentication flow (added)

This project now includes a complete authentication flow:

- Registration UI: /signup page (calls POST /api/auth/register)
- Login UI: /login page (calls POST /api/auth/login)
- Protected endpoint example: GET /api/auth/me

The frontend automatically attaches the JWT token saved in localStorage to outgoing API requests via an axios interceptor, so admin-only requests (for example creating products) will send the Authorization header automatically after sign-in.

Notes:
- To create an admin account the backend must have ADMIN_SECRET set; the signup form accepts an optional adminSecret which will create an admin if it matches the server ADMIN_SECRET.
- Avoid exposing ADMIN_SECRET in the browser or committing it to client-side assets.
 - Avoid exposing ADMIN_SECRET in the browser or committing it to client-side assets.
