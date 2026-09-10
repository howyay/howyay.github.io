/**
 * IPIP-50: 50-item IPIP Big-Five Factor Markers (Goldberg, 1992).
 *
 * Items and scoring key: International Personality Item Pool,
 * https://ipip.ori.org/New_IPIP-50-item-scale.htm and the official 10-item
 * broad-domain key at https://ipip.ori.org/newBigFive5broadKey.htm
 * (E 5+/5-, A 6+/4-, C 6+/4-, N 2+/8-, O 7+/3-). The IPIP is in the public
 * domain (https://ipip.ori.org/newPermission.htm).
 *
 * Scale: 1 = Inaccurate ... 5 = Accurate. Domain score = mean of (re)coded
 * items on the 1-5 scale; reverse-keyed items recoded as 6 - response.
 * Presentation order interleaves the five domains (E1,A1,C1,N1,O1,E2,...).
 *
 * Discretization: population tertiles, cutpoints at the 33.33rd/66.67th
 * percentiles = mean +/- z*SD with z(1/3) = 0.430727.
 *
 * Norms computed from the Open-Source Psychometrics Project public data
 * (1,015,342 collected 2016-2018; 1,015,342 minus skipped = 981,861 complete
 * cases for E; complete-case scoring per domain), distributed via
 * https://huggingface.co/datasets/Tetratics/2018-11-08-OpenPsychometrics-IPIP-FFM
 * (mirror of Kaggle "IPIP-FFM-data-8Nov2018"). Self-selected Internet sample -
 * not a probability sample; used because IPIP publishes no official norms
 * (https://ipip.ori.org/newNorms.htm). Means/SDs of the keyed 1-5 domain means:
 *   E M=2.97 SD=0.91, A M=3.77 SD=0.73, C M=3.36 SD=0.74,
 *   N M=3.07 SD=0.86, O M=3.89 SD=0.63.
 */

export const LIKERT = [
	{ value: 1, label: 'Very inaccurate', short: 'Inaccurate' },
	{ value: 2, label: 'Moderately inaccurate', short: 'Moderately inaccurate' },
	{ value: 3, label: 'Neither accurate nor inaccurate', short: 'Neutral' },
	{ value: 4, label: 'Moderately accurate', short: 'Moderately accurate' },
	{ value: 5, label: 'Very accurate', short: 'Accurate' }
] as const;

export type Domain = 'E' | 'A' | 'C' | 'N' | 'O';

export const DOMAINS: { key: Domain; name: string; blurb: string }[] = [
	{ key: 'E', name: 'Extraversion', blurb: 'Energy, assertiveness, sociability' },
	{ key: 'A', name: 'Agreeableness', blurb: 'Compassion, trust, cooperation' },
	{ key: 'C', name: 'Conscientiousness', blurb: 'Order, duty, self-discipline' },
	{ key: 'N', name: 'Neuroticism', blurb: 'Tension, worry, moodiness' },
	{ key: 'O', name: 'Openness', blurb: 'Imagination, curiosity, aesthetics' }
];

export type Item = { n: number; text: string; domain: Domain; reverse?: boolean };

/** IPIP-50 Big-Five Factor Markers, interleaved presentation order. */
export const ITEMS: Item[] = [
	{ n: 1, text: 'Am the life of the party', domain: 'E' },
	{ n: 2, text: 'Feel little concern for others', domain: 'A', reverse: true },
	{ n: 3, text: 'Am always prepared', domain: 'C' },
	{ n: 4, text: 'Get stressed out easily', domain: 'N' },
	{ n: 5, text: 'Have a rich vocabulary', domain: 'O' },
	{ n: 6, text: 'Don\'t talk a lot', domain: 'E', reverse: true },
	{ n: 7, text: 'Am interested in people', domain: 'A' },
	{ n: 8, text: 'Leave my belongings around', domain: 'C', reverse: true },
	{ n: 9, text: 'Am relaxed most of the time', domain: 'N', reverse: true },
	{ n: 10, text: 'Have difficulty understanding abstract ideas', domain: 'O', reverse: true },
	{ n: 11, text: 'Feel comfortable around people', domain: 'E' },
	{ n: 12, text: 'Insult people', domain: 'A', reverse: true },
	{ n: 13, text: 'Pay attention to details', domain: 'C' },
	{ n: 14, text: 'Worry about things', domain: 'N' },
	{ n: 15, text: 'Have a vivid imagination', domain: 'O' },
	{ n: 16, text: 'Keep in the background', domain: 'E', reverse: true },
	{ n: 17, text: 'Sympathize with others\' feelings', domain: 'A' },
	{ n: 18, text: 'Make a mess of things', domain: 'C', reverse: true },
	{ n: 19, text: 'Seldom feel blue', domain: 'N', reverse: true },
	{ n: 20, text: 'Am not interested in abstract ideas', domain: 'O', reverse: true },
	{ n: 21, text: 'Start conversations', domain: 'E' },
	{ n: 22, text: 'Am not interested in other people\'s problems', domain: 'A', reverse: true },
	{ n: 23, text: 'Get chores done right away', domain: 'C' },
	{ n: 24, text: 'Am easily disturbed', domain: 'N' },
	{ n: 25, text: 'Have excellent ideas', domain: 'O' },
	{ n: 26, text: 'Have little to say', domain: 'E', reverse: true },
	{ n: 27, text: 'Have a soft heart', domain: 'A' },
	{ n: 28, text: 'Often forget to put things back in their proper place', domain: 'C', reverse: true },
	{ n: 29, text: 'Get upset easily', domain: 'N' },
	{ n: 30, text: 'Do not have a good imagination', domain: 'O', reverse: true },
	{ n: 31, text: 'Talk to a lot of different people at parties', domain: 'E' },
	{ n: 32, text: 'Am not really interested in others', domain: 'A', reverse: true },
	{ n: 33, text: 'Like order', domain: 'C' },
	{ n: 34, text: 'Change my mood a lot', domain: 'N' },
	{ n: 35, text: 'Am quick to understand things', domain: 'O' },
	{ n: 36, text: 'Don\'t like to draw attention to myself', domain: 'E', reverse: true },
	{ n: 37, text: 'Take time out for others', domain: 'A' },
	{ n: 38, text: 'Shirk my duties', domain: 'C', reverse: true },
	{ n: 39, text: 'Have frequent mood swings', domain: 'N' },
	{ n: 40, text: 'Use difficult words', domain: 'O' },
	{ n: 41, text: 'Don\'t mind being the center of attention', domain: 'E' },
	{ n: 42, text: 'Feel others\' emotions', domain: 'A' },
	{ n: 43, text: 'Follow a schedule', domain: 'C' },
	{ n: 44, text: 'Get irritated easily', domain: 'N' },
	{ n: 45, text: 'Spend time reflecting on things', domain: 'O' },
	{ n: 46, text: 'Am quiet around strangers', domain: 'E', reverse: true },
	{ n: 47, text: 'Make people feel at ease', domain: 'A' },
	{ n: 48, text: 'Am exacting in my work', domain: 'C' },
	{ n: 49, text: 'Often feel blue', domain: 'N' },
	{ n: 50, text: 'Am full of ideas', domain: 'O' }];

export const NORMS: Record<Domain, { mean: number; sd: number }> = {
	E: { mean: 2.97, sd: 0.91 },
	A: { mean: 3.77, sd: 0.73 },
	C: { mean: 3.36, sd: 0.74 },
	N: { mean: 3.07, sd: 0.86 },
	O: { mean: 3.89, sd: 0.63 }
};

/** z of the 1/3 and 2/3 normal quantiles: Phi^-1(1/3) = -0.430727... */
export const TERTILE_Z = 0.430727;

export type Third = 'bottom' | 'middle' | 'top';

export type Scores = Record<Domain, { mean: number; third: Third; low: number; high: number }>;

/** Reverse-keyed item: 6 - response. */
const recode = (item: Item, response: number) => (item.reverse ? 6 - response : response);

/** Tertile cutpoints for a domain: mean ± z*SD. */
export function tertileBounds(d: Domain): { low: number; high: number } {
	const { mean, sd } = NORMS[d];
	return { low: mean - TERTILE_Z * sd, high: mean + TERTILE_Z * sd };
}

/** Score responses (item number -> 1..5) into domain means + population tertiles. */
export function scoreIPIP(responses: Partial<Record<number, number>>): Scores {
	const out = {} as Scores;
	for (const { key } of DOMAINS) {
		const domainItems = ITEMS.filter((i) => i.domain === key);
		const coded = domainItems
			.map((i) => ({ i, v: responses[i.n] }))
			.filter((x): x is { i: Item; v: number } => typeof x.v === 'number')
			.map((x) => recode(x.i, x.v));
		const mean = coded.length ? coded.reduce((a, b) => a + b, 0) / coded.length : 0;
		const { low, high } = tertileBounds(key);
		const third: Third = mean < low ? 'bottom' : mean > high ? 'top' : 'middle';
		out[key] = { mean, third, low, high };
	}
	return out;
}
