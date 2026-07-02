<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment (redeploy ONLY when the user explicitly asks)

⚠️ Auto-redeploy is PAUSED. Do **not** deploy or prompt for a token after making changes. Only redeploy when the user explicitly says to (e.g. "deploy now", "push it live").

When the user does ask, redeploy to Vercel production:

- Live URL: **https://the-beach-psi.vercel.app**
- Vercel project: `klyv/the-beach` (already linked via `.vercel/project.json`).
- Deploy command:
  ```
  npx vercel@latest deploy --prod --yes --scope klyv --token="<FRESH_TOKEN>"
  ```
- **Never store the token.** It is intentionally not saved anywhere. Ask the user for a fresh Vercel token at deploy time, run the deploy, then remind them they can revoke it at https://vercel.com/account/tokens.
- Run `npm run build` first to confirm the change compiles before deploying.
