@AGENTS.md

# Git-regler (obligatoriska — flera bidragsgivare)

Det här repot är navet för thebeach.one. **GitHub `main` är hubben**: staging-
workshoppen (beachinfo-azure) är EN bidragsgivare bland flera — Henric och
Mattias pushar också från sina egna miljöer (t.ex. signupformulär, bansystem).
Förvänta dig uppströmsändringar när som helst.

- **Pull FÖRE allt nytt arbete**: `git pull` (rebase är förkonfigurerat).
- **Committa + pusha när ett moment är klart.** Lämna aldrig ocommittat arbete
  — det blockerar andras pull och kan gå förlorat.
- **Aldrig force-push. Aldrig `reset --hard`/`checkout --` över arbete du inte
  själv gjort** — committa eller stash:a det i stället.
- **Prod publiceras BARA från pushade commits på main** — publish-verktyget/
  panelen vägrar vid smutsigt eller opushat träd.
- Workshoppens standard-identitet är "The Beach Staging <github@thebeach.one>";
  sätt gärna din egen: `git config --global user.name/user.email`.

## Appägarskap och plattformsgräns

Webbägaren och dennes agent får självständigt ändra och publicera layout,
innehåll, intern implementation, affärslogik och buggrättningar inom sajtens
befintliga API- och dataåtkomst. Henric eller Supervisor behöver inte godkänna
vanlig sajtutveckling.

Om arbetet kräver en delad tabell/kolumn/migrering, ny åtkomst till en annan
tjänsts data, ändrat publikt API/MCP-kontrakt, identitet eller behörighet:
skapa ett plattformsärende i Klubbhuset med Business MCP-verktyget
`hq_create_platform_request` och `requesting_project="site"`. Fortsätt med det
arbete som inte korsar gränsen medan Supervisor granskar ärendet.

## Miljöer
- **Workshop/staging (valfri)**: /work/thebeach-site i staging-containern,
  `next dev` med hot reload på https://staging.thebeach.one
  (Google-SSO-gated). Permanent staging är inte ett publiceringskrav och kan
  avvecklas separat.
- **Prod**: https://thebeach.one — publiceras via Site Deploy-panelen
  (https://admin.thebeach.one/deploy) eller MCP-verktyget `publish_to_prod`.
- Detaljer: [DEPLOY.md](DEPLOY.md).
