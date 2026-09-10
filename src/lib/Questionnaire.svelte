<script lang="ts">
	import { tick } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Progress } from '$lib/components/ui/progress';
	import { questionnaires, scoreQuestionnaire, validAnswers, type Answers, type QuestionnaireId } from './questionnaires';

	let { id }: { id: QuestionnaireId } = $props();
	const questionnaire = $derived(questionnaires[id]);
	const storageKey = $derived(`questionnaire:${id}:v1`);
	let loadedId = $state<QuestionnaireId | null>(null);
	let answers = $state<Answers>([]);
	let view = $state<'questions' | 'results'>('questions');
	let storageUnavailable = $state(false);
	let confirmRestart = $state(false);
	let heading = $state<HTMLHeadingElement>();
	const answeredCount = $derived(answers.filter((answer) => answer !== null).length);
	const complete = $derived(answers.length === questionnaire.questions.length && answeredCount === answers.length);
	const result = $derived(complete ? scoreQuestionnaire(questionnaire, answers) : null);

	$effect(() => {
		const currentId = id;
		const current = questionnaires[currentId];
		answers = Array(current.questions.length).fill(null);
		view = 'questions';
		confirmRestart = false;
		storageUnavailable = false;
		try {
			const raw = localStorage.getItem(`questionnaire:${currentId}:v1`);
			if (raw) {
				const saved = JSON.parse(raw);
				if (saved?.version === 1 && validAnswers(current, saved.answers)) {
					answers = saved.answers;
					view = saved.view === 'results' && saved.answers.every((answer: number | null) => answer !== null)
						? 'results' : 'questions';
				}
			}
		} catch {
			storageUnavailable = true;
		}
		loadedId = currentId;
	});

	$effect(() => {
		if (loadedId !== id) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify({ version: 1, answers, view }));
		} catch {
			storageUnavailable = true;
		}
	});

	async function showResults(finished: boolean) {
		if (finished && !complete) return;
		view = finished ? 'results' : 'questions';
		confirmRestart = false;
		await tick();
		heading?.focus();
	}

	function restart() {
		try { localStorage.removeItem(storageKey); } catch { storageUnavailable = true; }
		answers = Array(questionnaire.questions.length).fill(null);
		void showResults(false);
	}
</script>

<svelte:head>
	<title>{questionnaire.title}</title>
	<meta name="description" content={questionnaire.description} />
</svelte:head>

<main class="min-h-screen bg-background py-10 text-foreground">
	<div class="mx-auto max-w-2xl px-4">
		<a href="/" class="text-sm text-muted-foreground underline-offset-4 hover:underline">← All questionnaires</a>
		<header class="my-8 text-center">
			<Badge variant="secondary">{id.toUpperCase()}</Badge>
			<h1 class="mt-3 text-3xl font-bold tracking-tight">{questionnaire.title}</h1>
			<p class="mt-2 text-muted-foreground">{questionnaire.description}</p>
			<p class="mt-4 leading-relaxed text-muted-foreground">{questionnaire.instructions}</p>
			<p class="mt-2 text-sm text-muted-foreground">Progress is saved separately for each questionnaire in this browser. Answers are not submitted to a server. On a shared device, use Restart to clear your saved answers.</p>
			{#if id === 'rice'}<p class="mt-2 text-sm text-muted-foreground">The original question 69 is just “?”. Its wording and scoring are preserved unchanged.</p>{/if}
		</header>

		<Progress value={(answeredCount / questionnaire.questions.length) * 100} aria-label="Questionnaire progress" />
		<p class="mt-2 text-center text-sm text-muted-foreground" aria-live="polite">{answeredCount} / {questionnaire.questions.length} answered</p>
		{#if storageUnavailable}<p role="status" class="mt-4 text-sm text-muted-foreground">Saved progress could not be read or written. You can continue, but progress may not survive closing this page.</p>{/if}

		<Card.Root class="mt-4">
			<Card.Header>
				<h2 bind:this={heading} tabindex="-1" class="text-xl font-semibold tracking-tight outline-none">{view === 'results' && result ? 'Your results' : 'Your answers'}</h2>
			</Card.Header>
			{#if view !== 'results' || !result}
				<Card.Content class="divide-y">
					{#each questionnaire.questions as item, index (index)}
						<div id="{id}-q-{index + 1}" class="py-4">
							<p id="{id}-question-{index + 1}" class="text-base font-normal leading-snug">
								<span class="mr-1 text-muted-foreground">{index + 1}.</span>
								{item.text}
							</p>
							<RadioGroup.Root
								class="mt-2.5 flex flex-wrap gap-2"
								name="{id}-question-{index + 1}"
								aria-labelledby="{id}-question-{index + 1}"
								value={answers[index] != null ? String(answers[index]) : undefined}
								onValueChange={(value) => { if (value !== '') answers[index] = Number(value); }}
							>
								{#each item.scale as option, optionIndex (optionIndex)}
									<label for="{id}-answer-{index + 1}-{optionIndex}"
										class="flex cursor-pointer items-center whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring sm:text-sm has-[[data-checked]]:border-foreground has-[[data-checked]]:bg-primary has-[[data-checked]]:text-primary-foreground"
									>
										<RadioGroup.Item id="{id}-answer-{index + 1}-{optionIndex}" value={String(optionIndex)} aria-label={option.option} class="absolute size-0 sr-only" />
										{option.option}
									</label>
								{/each}
							</RadioGroup.Root>
						</div>
					{/each}
					<Button class="w-full" disabled={!complete} onclick={() => showResults(true)}>
						{complete ? 'See my results' : `Answer all ${questionnaire.questions.length - answeredCount} remaining`}
					</Button>
				</Card.Content>
			{:else}
				<Card.Content class="space-y-6">
					<div class="rounded-lg bg-muted p-6 text-center">
						<p class="text-sm text-muted-foreground">{id === 'rice' ? 'Rice Purity Score' : 'Emotional Intelligence Score'}</p>
						<p class="my-2 text-5xl font-semibold tracking-tight">{result.score}<span class="text-lg text-muted-foreground"> / {result.maximum}</span></p>
						<p class="text-sm text-muted-foreground">Possible range: {result.minimum}–{result.maximum}</p>
					</div>
					{#if result.percentile !== null}
						<p>Your EI score is higher than approximately <strong>{result.percentile.toFixed(2)}%</strong> of scores in the original comparison model.</p>
						<p class="text-sm leading-relaxed text-muted-foreground">This preserves the original normal-distribution estimate (mean 124, standard deviation 13). It is not a verified percentile for every population. Scores sum all 33 answers; items 5, 28 and 33 are reverse-scored using the original answer scales.</p>
					{:else}
						<p class="leading-relaxed text-muted-foreground">Each No contributes 1 point and each Yes contributes 0. A higher score means fewer of the listed experiences, not a better or worse person. No emotional-intelligence percentile applies to this test.</p>
					{/if}
					<Button variant="outline" onclick={() => showResults(false)}>Review or change answers</Button>
				</Card.Content>
			{/if}
		</Card.Root>

		{#if answeredCount > 0}
			<div class="mt-6 text-center">
				{#if confirmRestart}
					<p class="mb-3 text-sm">Clear all saved {id.toUpperCase()} answers and results on this device?</p>
					<div class="flex justify-center gap-2">
						<Button variant="destructive" onclick={restart}>Clear and restart</Button>
						<Button variant="outline" onclick={() => confirmRestart = false}>Cancel</Button>
					</div>
				{:else}
					<Button variant="ghost" onclick={() => confirmRestart = true}>Restart questionnaire</Button>
				{/if}
			</div>
		{/if}
	</div>
</main>
