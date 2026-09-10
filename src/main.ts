import { mount } from 'svelte';
import './app.css';
import Home from './pages/Home.svelte';
import BigFive from './pages/BigFive.svelte';
import Questionnaire from './lib/Questionnaire.svelte';

const target = document.getElementById('app')!;
const page = document.body.dataset.page;

if (page === 'rice' || page === 'sreit') {
  mount(Questionnaire, { target, props: { id: page } });
} else {
  mount(page === 'big-five' ? BigFive : Home, { target });
}
