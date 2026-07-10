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

## Miljöer
- **Workshop/staging**: /work/thebeach-site i staging-containern, `next dev`
  med hot reload på https://staging.thebeach.one (Google-SSO-gated).
- **Prod**: https://thebeach.one — publiceras via Site Deploy-panelen
  (https://admin.thebeach.one/deploy) eller MCP-verktyget `publish_to_prod`.
- Detaljer: [DEPLOY.md](DEPLOY.md).
