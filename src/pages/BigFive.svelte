<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Separator } from '$lib/components/ui/separator';
	import { Progress } from '$lib/components/ui/progress';
	import { ITEMS, LIKERT, DOMAINS, scoreIPIP, type Third } from '$lib/ipip';

	const STORAGE_KEY = 'questionnaires:big-five:answers:v1';
	const validAnswer = (value: unknown): value is number =>
		typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
	let answers = $state<Record<number, number>>({});
	let finished = $state(false);
	const answeredCount = $derived(ITEMS.filter((item) => validAnswer(answers[item.n])).length);
	const complete = $derived(answeredCount === ITEMS.length);
	const nextUnanswered = $derived(ITEMS.find((item) => !validAnswer(answers[item.n]))?.n ?? null);
	const scores = $derived(complete ? scoreIPIP(answers) : null);
	const T: Record<Third, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
		bottom: { label: 'Bottom third', variant: 'secondary' },
		middle: { label: 'Middle third', variant: 'outline' },
		top: { label: 'Top third', variant: 'default' }
	};
	const pct = (v: number) => Math.max(0, Math.min(100, ((v - 1) / 4) * 100));

	onMount(() => {
		try {
			const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
			if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
			const restored: Record<number, number> = {};
			for (const item of ITEMS) {
				const value = (saved as Record<string, unknown>)[item.n];
				if (Object.hasOwn(saved, item.n) && validAnswer(value)) restored[item.n] = value;
			}
			answers = restored;
		} catch {
			// Storage may be unavailable or contain invalid JSON; the questionnaire still works.
		}
	});

	function restart() {
		answers = {};
		finished = false;
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// Retaking also works when browser storage is unavailable.
		}
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	// Auto-scroll: after each answer, bring the next unanswered question into view.
	function onAnswer(n: number, v: string) {
		const value = Number(v);
		if (!ITEMS.some((item) => item.n === n) || !validAnswer(value)) return;
		answers[n] = value;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
		} catch {
			// Keep answers in memory if saving is blocked or storage is full.
		}
		const next = ITEMS.find((item) => !validAnswer(answers[item.n]));
		if (next) {
			requestAnimationFrame(() => {
				document.getElementById(`q-${next.n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			});
		}
	}
</script>

<svelte:head>
	<title>Discrete Big Five</title>
	<meta name="description" content="IPIP-50 Big Five questionnaire scored into population tertiles" />
</svelte:head>

<main class="min-h-screen bg-background py-10">
	<div class="mx-auto max-w-2xl px-4">
		<a href="/" class="mb-6 inline-block text-sm underline underline-offset-4">All questionnaires</a>
		<header class="mb-8 text-center">
			<h1 class="text-3xl font-bold tracking-tight">Discrete Big Five</h1>
			<p class="mt-2 text-muted-foreground">
				IPIP-50 Big Five. 50 statements about you. For each, indicate how accurate it is as a description of you.
			</p>
			<p class="mt-2 text-sm text-muted-foreground">Answers are saved in this browser when storage is available, so you can return later.</p>
		</header>

		{#if !finished || !complete}
			<Progress value={(answeredCount / ITEMS.length) * 100} aria-label="Questionnaire progress" />
			<p class="mt-2 text-center text-sm text-muted-foreground" aria-live="polite">
				{answeredCount} / {ITEMS.length} answered
				{#if nextUnanswered && answeredCount > 0 && !complete}
					· next: item {nextUnanswered}
				{/if}
			</p>
			{#if answeredCount > 0}
				<Button variant="outline" class="mt-3" onclick={restart}>Start over</Button>
			{/if}

			<Card.Root class="mt-4">
				<Card.Content class="divide-y">
					{#each ITEMS as item (item.n)}
						<div id="q-{item.n}" class="py-4">
							<p id="question-{item.n}" class="text-base font-normal leading-snug">
								<span class="mr-1 text-muted-foreground">{item.n}.</span>
								I {item.text.charAt(0).toLowerCase() + item.text.slice(1)}
							</p>
							<RadioGroup.Root
								class="mt-2.5 flex flex-wrap gap-2"
								aria-labelledby="question-{item.n}"
								value={answers[item.n] !== undefined ? String(answers[item.n]) : undefined}
								onValueChange={(v) => onAnswer(item.n, v)}
							>
								{#each LIKERT as opt (opt.value)}
									<label for="answer-{item.n}-{opt.value}"
										class="flex cursor-pointer items-center whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring sm:text-sm has-[[data-checked]]:border-foreground has-[[data-checked]]:bg-primary has-[[data-checked]]:text-primary-foreground"
									>
										<RadioGroup.Item id="answer-{item.n}-{opt.value}" value={String(opt.value)} aria-label={opt.label} class="absolute size-0 sr-only" />
										{opt.short}
									</label>
								{/each}
							</RadioGroup.Root>
						</div>
					{/each}
					<Button class="w-full" disabled={!complete} onclick={() => { if (complete) finished = true; }}>
						{complete ? 'See my results' : `Answer all ${ITEMS.length - answeredCount} remaining`}
					</Button>
				</Card.Content>
			</Card.Root>
		{:else if scores}
			<div class="space-y-4">
				{#each DOMAINS as { key, name, blurb } (key)}
					{@const s = scores[key]}
					{@const t = T[s.third]}
					<Card.Root>
						<Card.Header class="pb-2">
							<div class="flex items-center justify-between gap-2">
								<div>
									<Card.Title class="text-xl">{name}</Card.Title>
									<Card.Description>{blurb}</Card.Description>
								</div>
								<Badge variant={t.variant}>{t.label}</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							<Progress value={pct(s.mean)} class="h-2" aria-label={`${name} score`} />
							<p class="mt-2 text-sm text-muted-foreground">
								Your score: {s.mean.toFixed(2)} / 5 ·
								{#if s.third === 'bottom'}
									bottom third = below {s.low.toFixed(2)}
								{:else if s.third === 'top'}
									top third = above {s.high.toFixed(2)}
								{:else}
									middle third = {s.low.toFixed(2)}–{s.high.toFixed(2)}
								{/if}
							</p>
						</Card.Content>
					</Card.Root>
				{/each}

				<Separator class="my-6" />
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-lg">How to read this</Card.Title>
						<Card.Description>
							Each domain mean (1–5) is compared with general-population norms (M ± 0.43 SD — the
							33rd/67th percentiles of an approximately normal distribution): E 2.97/0.91 · A
							3.77/0.73 · C 3.36/0.74 · N 3.07/0.86 · O 3.89/0.63. Below the lower cut = bottom
							third, above the upper cut = top third of the population, else middle.
						</Card.Description>
					</Card.Header>
					<Card.Content class="text-sm text-muted-foreground">
						Instrument: IPIP-50 Big-Five Factor Markers (Goldberg, 1992) — public domain, see
						ipip.ori.org. Reverse-keyed items are recoded (6 − response) before averaging. Scores
						are means of 1–5 responses; tertiles are relative to the reference population, not to
						your answers.
					</Card.Content>
					<Card.Footer>
						<Button variant="outline" onclick={restart}>Retake</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		{/if}

		<p class="mt-8 text-center text-xs text-muted-foreground">
			Items from the International Personality Item Pool (ipip.ori.org) — public domain.
		</p>
	</div>
</main>
