@AGENTS.md

# Claude-Specific Instructions

De kanoniska instruktionerna för det här repot finns i `AGENTS.md` (importeras
ovan): projektstruktur, kommandon, deployment, git-regler, appägarskap och
plattformsgräns, miljöer, säkerhet och handoff-protokollet. De flyttades dit
oförändrade från den här filen så att även Codex och andra leverantörer får
samma regler. Lägg durabel projektkunskap i `AGENTS.md`, inte här.

- Aktuellt uppgiftsläge hör hemma i `.agent/HANDOFF.md`, inte i den här filen.
- `.claude/launch.json` definierar dev-servern (`npm run dev`, port 3000) för
  Claude Code.
- Visuella ändringar (layout, responsivt, styling) följer
  `~/supervisor/platform/visual-change-workflow.md` — använd
  `visual-review-loop`-skillen i stället för att godkänna dem själv.
