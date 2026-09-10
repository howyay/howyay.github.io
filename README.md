# Questionnaires

A static questionnaire collection built with **Svelte 5, Vite, Tailwind CSS 4, and shadcn-svelte**, using the Discrete Big Five project's components, Inter typography, and neutral design tokens.

## Run locally

Requires Node.js 24 and pnpm 11 (`packageManager` pins the version).

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm preview
```

`pnpm build` builds a Vite multi-page site to `build/`. The GitHub Pages workflow installs from the frozen pnpm lockfile, checks, tests, builds, and deploys that directory. Each route has its own HTML entry point, so clean URLs, direct links, and refreshes work without a router dependency or server-side routing. Svelte renders the questionnaire content in the browser; JavaScript is required. `src/main.ts` selects the component using each entry point's `data-page` attribute. There is no SvelteKit, SSR, or prerender step.

## Questionnaires

- `/` — shared questionnaire landing page.
- `/big-five/` — full 50-item IPIP questionnaire, five domain scores, population tertiles, and method notes. Original instrument, reference parameters, and limitations: [Discrete Big Five documentation](docs/discrete-big-five.md).
- `/sreit/` — all 33 Schutte Self-Report Emotional Intelligence items, including reverse-keyed scoring and the original approximate percentile (mean 124, standard deviation 13).
- `/rice/` — all 100 existing Rice Purity items, scored as the number of “No” answers. The source's item 69 is literally `?`; retained rather than silently inventing a replacement.

Legacy questions remain in `public/sreit.yaml` and `public/rice.yaml`, including their original answer options and scoring keys. Shared legacy flow/scoring live in `src/lib/Questionnaire.svelte` and `src/lib/questionnaires.ts`. Big Five scoring lives in `src/lib/ipip.ts`. All routes share the same UI components and `src/app.css` theme. All three questionnaires display their full question list on one page, with inline answer editing and results available after every question is answered.

Answers are scored in the browser and are not uploaded. Progress is saved separately for each questionnaire in this browser's local storage; restarting clears that questionnaire's saved progress. Do not use a shared browser for sensitive answers unless you clear your progress afterward. These are reflection/education tools, not diagnoses. Rice Purity includes sensitive adult topics.
