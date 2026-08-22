# Current Work State

## Objective

Provide current website production source plus its isolated demo adapters for
the HQ #85 restricted training-group review candidate.

## Current Status

The branch is based on current `origin/main` and contains only the established
demo runtime, boundary hardening, synthetic login and immutable image adapter
commits. Stripe remains real hosted test-mode Checkout in demo. No production
branch or deployment was changed.

## Verification

- `npm run test:unit`: 130 passed
- `npm run build`: passed, including TypeScript and 87 static pages
- `npm run lint`: reports seven existing React/immutability errors and 18
  warnings on the integrated production source; the build and tests pass
- `git diff --check`: passed

## Next Action

Use this exact pushed commit only as the website source in the immutable HQ #85
demo release manifest. Do not merge it to `main` and do not start demo without
the separate exact `START DEMO` authorization.
