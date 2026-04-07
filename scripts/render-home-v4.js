import { loadJSON, byId, createPill } from './utils.js';

const tagMap = {
  'страх': 'fear',
  'срочность': 'urgency',
  'стыд': 'guilt',
  'псевдовыбор': 'pseudochoice'
};

async function renderHomeV4() {
  const data = await loadJSON('./data/site.json');

  byId('brandName').textContent = data.brand;
  byId('heroEyebrow').textContent = data.heroEyebrow;
  byId('heroTitle').textContent = data.heroTitle;
  byId('heroSubtitle').textContent = data.heroSubtitle;
  byId('primaryCta').textContent = data.primaryCta;
  byId('secondaryCta').textContent = data.secondaryCta;
  byId('demoText').textContent = data.demoText;

  byId('signals').innerHTML = data.signals
    .map((item) => {
      const example = tagMap[item] || 'urgency';
      return `<a class="quick-pill-link" href="./detector-v4.html?example=${example}">${item}</a>`;
    })
    .join('');

  byId('floatPills').innerHTML = [
    createPill('срочность', 'warn'),
    createPill('страх', 'danger')
  ].join('');
}

renderHomeV4().catch((error) => {
  console.error(error);
});
