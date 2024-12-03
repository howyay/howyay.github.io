import './App.css'
// @deno-types="@types/react"
import React, { useState, Suspense } from 'react'
import { parse, stringify } from 'yaml';
import { useSuspenseQuery, QueryClient, QueryClientProvider, Query } from '@tanstack/react-query';
import jStat from 'jstat';
// @ts-expect-error Unable to infer type at the moment
import reactLogo from './assets/react.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Suspense fallback={<div>gay</div>}>
          <Questionnaire scoreDimension={1} />
        </Suspense>
      </QueryClientProvider>
    </>
  )
}

function Answer({ scale, nextStep }) {
  return (
    <>
      <div className="flex flex-col gap-2 col-start-5 col-end-9">
        {scale.map(answer => <button className="" onClick={() => nextStep(answer.score)}>{answer.option}</button>)}
      </div>
    </>
  )
}

function Question({ text, answer }) {
  return (
    <>
      <div className="col-span-12 place-self-center text-3xl">
        {text}
      </div>
      {answer}
    </>
  )
}

function Result({ score }) {
  let calculatePercentile = (score, mean, standardDeviation) => {
    const zScore = (score - mean) / standardDeviation;
    const percentile = jStat.normal.cdf(zScore, 0, 1) * 100; // Convert to percentage
    return percentile;
  }
  return (
    <>
      <div className="col-span-12 place-self-center flex flex-col">
        Your Score:
        <div className="text-3xl">
          {score}
        </div>
        <div>
          Your EI is higher than {calculatePercentile(score, 124, 13).toFixed(2)}% of the population</div>
      </div>
    </>
  )
}

function Questionnaire({ scoreDimension }) {
  const fetchYaml = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch YAML');
    const text = await response.text();
    return parse(text, { merge: true }); // Parse YAML into a JavaScript object
  };

  const questionnaire = useSuspenseQuery({
    queryKey: ['yamlData'],
    queryFn: () => fetchYaml('https://raw.githubusercontent.com/howyay/int_sreit/refs/heads/main/sreit.yaml'),
  }).data;
  let questions = questionnaire.questions;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState(Array(scoreDimension).fill(0));

  let nextStep = (qScore: number) => {
    let newScores = Array.from(scores)
    newScores[questions[step]['scoreDimension']] += qScore // TODO: custom compounding function
    setStep(step + 1)
    setScores(newScores);
    setAnswers([...answers, qScore])
  };

  let lastStep = () => {
    let newScores = Array.from(scores)
    newScores[questions[step-1]['scoreDimension']] -= answers[answers.length - 1] // TODO: custom compounding function
    setStep(step - 1)
    setScores(newScores);
    setAnswers(answers.slice(0, -1))
  };

  return (
    <>
      {
        (step > 0) ?

        <div className="fixed">
          <button onClick={lastStep} className="">LAST QUESTION</button>
        </div> : null
      }
      {(step < questions.length) ?
        <Question text={questions[step].text} answer={<Answer scale={questions[step].scale} nextStep={nextStep} />} /> :
        <Result score={scores[0]} />}
      {/* <div className="col-span-12">{JSON.stringify(questionnaire, null, 2)}</div> */}
      {/* {scores[0]} */}
      {/* {answers} */}
      {/* {answers.length} */}
      {/* {scores[questions[step-1].scoreDimension]} */}
    </>
  )
}

// TODO: Back button and restart button
// TODO: multi dimensional scoring - results etc
// TODO: different compounding function, scale, and score dimension for each q
// TODO: Shuffle questions

export default App
