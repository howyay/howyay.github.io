# discrete-big-five

A complete IPIP-50 Big Five questionnaire built with SvelteKit + shadcn-svelte.
Scores all five personality dimensions and discretizes each into the **bottom / middle / top
third of the population** for that dimension.

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static site written to build/ — no server required
pnpm preview
```

Fully static: deploys to GitHub Pages (push `build/` or add a Pages workflow), Netlify, etc.
The `index.html` fallback also works under subpaths (e.g. `<user>.github.io/<repo>/`).

## Instrument

- **Items:** IPIP-50 — the 50-item IPIP Big-Five Factor Markers (Goldberg, 1992), from the
  [International Personality Item Pool](https://ipip.ori.org/New_IPIP-50-item-scale.htm). The IPIP
  is **in the public domain** — permission is granted for any use, commercial or non-commercial
  ([IPIP permission statement](https://ipip.ori.org/newPermission.htm)). We chose it over the BFI
  because the BFI is copyrighted (Berkeley Personality Lab) and the 44-item version predates the
  BFI-2 (Soto & John, 2017).
- **Response scale:** 5-point accuracy Likert (1 = Very inaccurate … 5 = Very accurate); items are
  first-person statements ("I am the life of the party …").
- **Scoring key:** official IPIP 10-item-per-domain broad key
  ([newBigFive5broadKey.htm](https://ipip.ori.org/newBigFive5broadKey.htm)). Domain score =
  **mean** of the (re)coded items on the 1–5 scale; reverse-keyed items recoded as `6 − response`:
  - Extraversion: 1, 6R, 11, 16, 21R, 26, 31R, 36, 41, 46R
  - Agreeableness: 2R, 7, 12R, 17, 22, 27R, 32, 37, 42, 47
  - Conscientiousness: 3, 8R, 13, 18R, 23, 28, 33, 38, 43R, 48
  - Neuroticism: 4, 9R, 14, 19R, 24, 29, 34, 39, 44, 49
  - Openness: 5, 10R, 15, 20, 25, 30, 35R, 40, 45, 50

  (In the official key Neuroticism's "+" items are "Am relaxed most of the time" and "Seldom feel
  blue"; they are reverse-keyed here so a high N score means high negative emotionality.)

## Tertile discretization

Bins are relative to the **population**, not to your answers. IPIP publishes no official norms by
policy ([ipip.ori.org/newNorms.htm](https://ipip.ori.org/newNorms.htm): "most 'norms' are
misleading"). Reference values below were therefore **computed** from the Open-Source Psychometrics
Project public dataset (1,015,342 test responses collected 2016–2018; complete-case scoring per
domain, n ≈ 973k–982k), distributed via the
[Hugging Face mirror](https://huggingface.co/datasets/Tetratics/2018-11-08-OpenPsychometrics-IPIP-FFM)
of Kaggle's `IPIP-FFM-data-8Nov2018`. **Caveat:** that sample is a self-selected Internet sample,
not a probability sample — treat the tertile labels as approximate reference points.

| Domain | M | SD |
|---|---|---|
| Extraversion | 2.97 | 0.91 |
| Agreeableness | 3.77 | 0.73 |
| Conscientiousness | 3.36 | 0.74 |
| Neuroticism | 3.07 | 0.86 |
| Openness | 3.89 | 0.63 |

Assuming an approximately normal distribution, the 33⅓rd/66⅔rd percentiles sit at
**M ± 0.430727·SD** (z = Φ⁻¹(1/3)). A domain mean below the lower cut is *bottom third*,
above the upper cut is *top third*, otherwise *middle third*.

Example cutpoints: E 2.58–3.36 · A 3.46–4.08 · C 3.04–3.68 · N 2.70–3.44 · O 3.62–4.16.

## Code map

- `src/lib/ipip.ts` — item bank, Likert labels, scoring key, norms, tertile logic
- `src/lib/components/ui/` — shadcn-svelte components (button, card, radio-group, …)
- `src/routes/+page.svelte` — questionnaire + results UI
- `scripts/scoring-check.ts` — scoring sanity checks (`node --experimental-strip-types scripts/scoring-check.ts`)

IPIP items © Lewis R. Goldberg / International Personality Item Pool — public domain
([permission statement](https://ipip.ori.org/newPermission.htm)).
