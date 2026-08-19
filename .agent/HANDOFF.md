# Current Work State

## Objective

No active task is currently recorded.

## Current Status

Repository is available for a new task. The working tree was clean when this
handoff was created (apart from the agent-infrastructure files that introduced
it).

The checkout is on the feature branch `codex/stripe-payments`, not `main`. Its
recent commits add Stripe checkout and make Swish the primary website payment.
Whether that work is finished, reviewed or merged is not documented in the
repository, so do not assume it is.

## Repository State

Branch: `codex/stripe-payments`, in sync with `origin/codex/stripe-payments`.
Reference commit: `5fadf62` — "Make Swish the primary website payment"
(2026-08-16).
Relevant modified/untracked files: none.

## Next Action

Establish the objective for the next task before making task-specific changes.
If the task continues the payment work on this branch, first confirm with the
requester whether the branch should be continued, merged to `main` or dropped;
`main` is the hub that publishing works from (see `AGENTS.md`).

## Verification

Commands run: none for a task (this handoff was created while adopting the
cross-provider agent handoff standard).
Not yet run: `npm run test:unit`, `npm run build`.

## Relevant Documentation

- `AGENTS.md` — canonical agent instructions for this repository
- `DEPLOY.md` — container/port map, publishing, rollback
