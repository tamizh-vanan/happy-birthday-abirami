<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The birthday experience is one page (`/`) composed of one component per chapter in `src/components/birthday/`; all copy lives in `src/lib/content.ts` so text edits never touch layout.
- Confetti/fireworks and music are owned by `ExperienceProvider` (one canvas, one Web Audio instance); chapters call `useExperience()` instead of creating their own, so effects never stack.
- Music is synthesised with Web Audio (`src/lib/music.ts`) and starts only from the sound toggle — no audio files, no autoplay.

- The page body lives in `BirthdayExperience`, shared by the Lovable route and a separate static GitHub Pages build (`vite.pages.config.ts`, `pages/`, `.github/workflows/deploy-pages.yml`); keep it free of router/server code so both builds work.
