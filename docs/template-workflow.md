# Templates Portfolio Workflow

Use this workflow only for sites you own, licensed templates, or pages you have permission to analyze and recreate.

1. Run `npm run template:intake -- --url URL --slug SLUG --name NAME`.
2. Review `templates/SLUG/design` output before reconstruction.
3. Point `TARGET.md` to the authorized source URL and `templates/SLUG/app` output directory.
4. Start the browser-capable coding environment required by the existing workflow.
5. Run the existing single-URL reconstruction command for the authorized target.
6. Set template status to `rebuilding` while implementation is underway.
7. Set status to `qa` when the implementation is ready for comparison.
8. Save build, responsive, interaction, and visual notes under `templates/SLUG/qa`.
9. Set status to `complete` only after build, desktop/mobile, interaction, and visual review pass.

## Dembrandt prerequisite

Before the first extraction on a machine, install its matching browser:

```bash
npx -y dembrandt install-browser
```

Dembrandt records DOM-derived design-system data. Canvas/WebGL areas may need screenshot-driven reference instead.

## Commercialization boundary

Reference records may retain source information for internal analysis. Before any template is marked `ready-to-commercialize`, remove third-party trademarks, source copy, and protected or unlicensed media, use original naming, confirm independent reuse, and pass QA.
