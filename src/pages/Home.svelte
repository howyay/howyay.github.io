<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

  const questionnaires = [
    { href: '/big-five/', category: 'Personality', name: 'Discrete Big Five', count: 50, time: '5–10 minutes', description: 'Explore five dimensions of your personality with the IPIP-50. See where each trait falls: bottom, middle, or top third.', note: 'Includes scoring methods and reference-population notes.' },
    { href: '/sreit/', category: 'Emotional intelligence', name: 'SREIT', count: 33, time: '5 minutes', description: 'Reflect on how you perceive, understand, and use emotions with the Schutte Self-Report Emotional Intelligence Test.', note: 'A self-report measure, not a clinical assessment.' },
    { href: '/rice/', category: 'Life experiences', name: 'Rice Purity Test', count: 100, time: '5–10 minutes', description: 'A familiar checklist of life experiences. Answer yes or no to receive your score out of 100.', note: 'Contains sensitive adult topics. For fun, not a judgment or a checklist of goals.' }
  ];
</script>

<svelte:head>
  <title>Questionnaires — Personality, emotions & experiences</title>
  <meta name="description" content="Choose from Discrete Big Five, SREIT emotional intelligence, and Rice Purity questionnaires. Free, private, and scored in your browser." />
</svelte:head>

<main class="min-h-screen bg-background py-10 sm:py-16">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <header class="mx-auto mb-10 max-w-2xl text-center">
      <Badge variant="secondary">A little self-discovery</Badge>
      <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">A few questions.<br />A new perspective.</h1>
      <p class="mt-4 text-lg text-muted-foreground">Explore your personality, emotional intelligence, and life experiences. Pick a questionnaire to get started.</p>
    </header>

    <section aria-label="Choose a questionnaire" class="grid gap-5 md:grid-cols-3">
      {#each questionnaires as questionnaire}
        <Card.Root class="flex h-full flex-col">
          <Card.Header>
            <p class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{questionnaire.category}</p>
            <Card.Title><h2 class="text-xl">{questionnaire.name}</h2></Card.Title>
            <Card.Description>{questionnaire.count} questions · {questionnaire.time}</Card.Description>
          </Card.Header>
          <Card.Content class="flex-1 space-y-4">
            <p class="text-sm leading-relaxed">{questionnaire.description}</p>
            <p class="text-sm leading-relaxed text-muted-foreground">{questionnaire.note}</p>
          </Card.Content>
          <Card.Footer>
            <Button href={questionnaire.href} class="w-full" aria-label={`Open ${questionnaire.name}`}>Start questionnaire <span aria-hidden="true">→</span></Button>
          </Card.Footer>
        </Card.Root>
      {/each}
    </section>

    <footer class="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
      <p>No account. No answer uploads. Your progress stays in this browser.</p>
      <p class="mt-2">These questionnaires are for reflection and education, not diagnosis. Scores describe a response pattern, not your worth.</p>
    </footer>
  </div>
</main>
