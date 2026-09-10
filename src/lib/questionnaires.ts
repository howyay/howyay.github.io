import { parse } from 'yaml';
// @ts-expect-error jstat does not ship TypeScript declarations.
import jStat from 'jstat';
import rice from '../../public/rice.yaml?raw';
import sreit from '../../public/sreit.yaml?raw';

export type QuestionnaireId = 'rice' | 'sreit';
export type Question = {
	text: string;
	scale: { option: string; score: number }[];
	scoreDimension: number;
};
export type Answers = (number | null)[]; // Option indices, not scores: zero is a valid answer.
export type Questionnaire = {
	id: QuestionnaireId;
	title: string;
	description: string;
	instructions: string;
	questions: Question[];
};

// These trusted bundled documents reuse enough anchors to exceed yaml's default alias limit.
export const questionnaires: Record<QuestionnaireId, Questionnaire> = {
	rice: {
		id: 'rice',
		title: 'Rice Purity Test',
		description: '100 questions about life experiences.',
		instructions: 'Choose Yes if you have experienced the activity, or No if you have not. This historical questionnaire includes explicit sexual content, substance use and illegal activities. It is not a checklist, a diagnosis or a measure of your worth.',
		questions: parse(rice, { merge: true, maxAliasCount: 1000 }).questions
	},
	sreit: {
		id: 'sreit',
		title: 'Schutte Emotional Intelligence Test',
		description: '33 statements about emotions and everyday life.',
		instructions: 'For each statement, choose how much you agree or disagree. Answer based on how you generally feel, rather than how you think you should feel. This self-report questionnaire is for reflection, not a clinical diagnosis.',
		questions: parse(sreit, { merge: true, maxAliasCount: 1000 }).questions
	}
};

export function validAnswers(questionnaire: Questionnaire, value: unknown): value is Answers {
	return Array.isArray(value) && value.length === questionnaire.questions.length &&
		value.every((answer, index) => answer === null ||
			(Number.isInteger(answer) && answer >= 0 && answer < questionnaire.questions[index].scale.length));
}

export function scoreQuestionnaire(questionnaire: Questionnaire, answers: Answers) {
	if (!validAnswers(questionnaire, answers) || answers.some((answer) => answer === null)) {
		throw new Error('Answer every question before scoring.');
	}
	// YAML scales already encode reverse scoring. Never reverse a score a second time.
	const score = questionnaire.questions.reduce((sum, question, index) =>
		sum + question.scale[answers[index]!].score, 0);
	const minimum = questionnaire.questions.reduce((sum, question) => sum + Math.min(...question.scale.map((option) => option.score)), 0);
	const maximum = questionnaire.questions.reduce((sum, question) => sum + Math.max(...question.scale.map((option) => option.score)), 0);
	return {
		score,
		minimum,
		maximum,
		// Preserve the original SREIT formula; it does not apply to the Rice Purity Test.
		percentile: questionnaire.id === 'sreit' ? jStat.normal.cdf((score - 124) / 13, 0, 1) * 100 as number : null
	};
}
