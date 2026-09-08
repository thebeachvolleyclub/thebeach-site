# Shared workshop browser transport (HQ #270)

This feature branch is a development-only adapter based on the deployed website
revision `4cdc7667f205eb3c085d7ff71c6622bd9d35ef7c`. It must not be published to
the production website or David's normal staging workflow as part of starting
the shared environment.

Next 16.2.9 sends React development debug data over the HMR WebSocket. Missing
that data can block hydration even after all JavaScript files have downloaded.
The shared hostname `arena.dev.thebeach.one` therefore joins the existing exact
`staging.thebeach.one` development-origin allowlist. No wildcard is allowed.
This Next option applies to development mode; standalone production output,
routes, account APIs and payment behavior are unchanged.

The platform runtime must also forward `/_next/webpack-hmr?id=...` as a real
authenticated WebSocket, including text and binary frames, through its existing
SSO proxy and shared container edge. Do not bypass SSO to make HMR work: React
debug data can include rendered business records. This repository change alone
does not supply that transport.

Source evidence: installed Next 16.2.9 documentation at
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md`,
and the installed `dist/esm/client/app-index.js`, `dev/debug-channel.js`, and
`dev/hot-reloader/app/web-socket.js` implementation. The debug-channel source
explicitly notes that unresolved debug dependencies block hydration.
