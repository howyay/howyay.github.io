import assert from 'node:assert/strict';
import { DOMAINS, ITEMS, NORMS, TERTILE_Z, scoreIPIP, tertileBounds } from '../src/lib/ipip.ts';

const responses = (value: number): Record<number, number> =>
	Object.fromEntries(ITEMS.map((item) => [item.n, value]));
const close = (actual: number, expected: number) =>
	assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);

assert.equal(ITEMS.length, 50);
assert.deepEqual(ITEMS.map((item) => item.n), Array.from({ length: 50 }, (_, i) => i + 1));
assert.equal(DOMAINS.length, 5);
const reverseCounts = { E: 5, A: 4, C: 4, N: 2, O: 3 };
const neutralThirds = { E: 'middle', A: 'bottom', C: 'bottom', N: 'middle', O: 'bottom' };
const allFiveMeans = { E: 3, A: 3.4, C: 3.4, N: 4.2, O: 3.8 };
const allFiveThirds = { E: 'middle', A: 'bottom', C: 'middle', N: 'top', O: 'middle' };
const neutral = scoreIPIP(responses(3));
const allFive = scoreIPIP(responses(5));

for (const { key } of DOMAINS) {
	const items = ITEMS.filter((item) => item.domain === key);
	assert.equal(items.length, 10);
	assert.equal(items.filter((item) => item.reverse).length, reverseCounts[key]);
	assert.equal(neutral[key].mean, 3);
	assert.equal(neutral[key].third, neutralThirds[key]);
	close(allFive[key].mean, allFiveMeans[key]);
	assert.equal(allFive[key].third, allFiveThirds[key]);
	const bounds = tertileBounds(key);
	close(bounds.low, NORMS[key].mean - TERTILE_Z * NORMS[key].sd);
	close(bounds.high, NORMS[key].mean + TERTILE_Z * NORMS[key].sd);
	assert.ok(bounds.low > 1 && bounds.low < bounds.high && bounds.high < 5);
	assert.equal(neutral[key].low, bounds.low);
	assert.equal(neutral[key].high, bounds.high);
}

// Check every forward/reverse item, including the reference item 6 => E = 3.2.
for (const item of ITEMS) {
	const answers = responses(3);
	answers[item.n] = 1;
	const scores = scoreIPIP(answers);
	for (const { key } of DOMAINS) {
		close(scores[key].mean, key === item.domain ? 3 + (item.reverse ? 0.2 : -0.2) : 3);
	}
}

// Key-aware endpoint responses yield all bottom or all top, unlike uniform 1s/5s.
for (const target of [1, 5]) {
	const answers = Object.fromEntries(ITEMS.map((item) => [item.n, item.reverse ? 6 - target : target]));
	for (const score of Object.values(scoreIPIP(answers))) {
		assert.equal(score.mean, target);
		assert.equal(score.third, target === 1 ? 'bottom' : 'top');
	}
}

console.log('Big Five checks passed: 50 items, domain keys, all item directions, means, norms, and tertiles.');
