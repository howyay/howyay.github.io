import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
	const { questionnaires, scoreQuestionnaire, validAnswers } = await server.ssrLoadModule('/src/lib/questionnaires.ts');
	const { rice, sreit } = questionnaires;
	assert.equal(rice.questions.length, 100);
	assert.equal(sreit.questions.length, 33);
	assert.equal(rice.questions[68].text, '?', 'Preserve the original placeholder question');
	assert.deepEqual(sreit.questions.flatMap((question, index) => question.scale[0].score === 1 ? [index + 1] : []), [5, 28, 33]);

	for (const questionnaire of [rice, sreit]) {
		assert.ok(questionnaire.questions.every((question) => question.scoreDimension === 0));
		const minimumAnswers = questionnaire.questions.map((question) => question.scale.findIndex((option) => option.score === Math.min(...question.scale.map((entry) => entry.score))));
		const maximumAnswers = questionnaire.questions.map((question) => question.scale.findIndex((option) => option.score === Math.max(...question.scale.map((entry) => entry.score))));
		const minimum = questionnaire.id === 'rice' ? 0 : 33;
		const maximum = questionnaire.id === 'rice' ? 100 : 165;
		assert.equal(scoreQuestionnaire(questionnaire, minimumAnswers).score, minimum);
		assert.equal(scoreQuestionnaire(questionnaire, maximumAnswers).score, maximum);
		assert.equal(scoreQuestionnaire(questionnaire, minimumAnswers).minimum, minimum);
		assert.equal(scoreQuestionnaire(questionnaire, maximumAnswers).maximum, maximum);
		assert.ok(validAnswers(questionnaire, minimumAnswers));
		assert.throws(() => scoreQuestionnaire(questionnaire, Array(questionnaire.questions.length).fill(null)), /Answer every question/);
		assert.throws(() => scoreQuestionnaire(questionnaire, []), /Answer every question/);
		for (const invalid of [-1, 0.5, '0', undefined, NaN, Infinity, 99]) {
			const answers = [...minimumAnswers];
			answers[0] = invalid;
			assert.equal(validAnswers(questionnaire, answers), false);
			assert.throws(() => scoreQuestionnaire(questionnaire, answers), /Answer every question/);
		}
	}

	assert.equal(scoreQuestionnaire(rice, Array(100).fill(0)).score, 0, 'Yes = 0');
	assert.equal(scoreQuestionnaire(rice, Array(100).fill(1)).score, 100, 'No = 1');
	assert.equal(scoreQuestionnaire(rice, Array(100).fill(1)).percentile, null);
	assert.equal(scoreQuestionnaire(sreit, Array(33).fill(0)).score, 153, 'Strongly Agree includes three reversed items');
	assert.equal(scoreQuestionnaire(sreit, Array(33).fill(4)).score, 45, 'Strongly Disagree includes three reversed items');
	assert.equal(scoreQuestionnaire(sreit, Array(33).fill(2)).score, 99, 'Neutral = 3 on every item');

	const { default: jStat } = await import('jstat');
	for (let total = 33; total <= 165; total++) {
		let remainder = total - 33;
		const answers = sreit.questions.map((question) => {
			const extra = Math.min(remainder, 4);
			remainder -= extra;
			return question.scale.findIndex((option) => option.score === 1 + extra);
		});
		const result = scoreQuestionnaire(sreit, answers);
		assert.equal(result.score, total);
		assert.equal(result.percentile, jStat.normal.cdf((total - 124) / 13, 0, 1) * 100);
		if (total === 124) assert.equal(result.percentile, 50);
	}
	console.log('Legacy scoring passed: counts, reverse keys, ranges, neutral, validation, and every SREIT total/percentile.');
} finally {
	await server.close();
}
