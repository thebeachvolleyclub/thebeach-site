<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment — self-hosted (NOT Vercel)

The site is hosted on The Beach's own infrastructure: a Node container
(Node 20, `next start` on :3000) behind Apache. **Vercel is not used** — ignore
any old Vercel / `klyv/the-beach` references.

Flow (Henric owns the infra):
- **dev** — `beach.dev.thebeach.one`, this container = the workbench.
- Push to **`main`** → auto-deploys to **`staging.thebeach.one`** (prod-identical) for review.
- Promote **staging → prod** via the control panel in The Beach Admin UI
  (publish, restore staging, roll back, view diff/history).
- **No agent pushes straight to prod.** Always `npm run build` before pushing.

Repo: `Simonklyvare/thebeach-site` (moving into the GitHub org `thebeachvolleyclub`).
