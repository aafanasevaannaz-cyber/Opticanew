import { loadJSON, byId, createPill } from './utils.js';

async function renderHome() {
  const data = await loadJSON('./data/site.json');

  byId('brandName').textContent = data.brand;
  byId('telegramLabel').textContent = data.telegramLabel;
  byId('heroEyebrow').textContent = data.heroEyebrow;
  byId('heroTitle').textContent = data.heroTitle;
  byId('heroSubtitle').textContent = data.heroSubtitle;
  byId('primaryCta').textContent = data.primaryCta;
  byId('secondaryCta').textContent = data.secondaryCta;
  byId('demoText').textContent = data.demoText;

  byId('signals').innerHTML = data.signals
    .map(item => createPill(item))
    .join('');

  byId('entryCards').innerHTML = data.entryCards
    .map(card => `
      <article class="mini-card">
        <b>${card.title}</b>
        <span>${card.description}</span>
      </article>
    `)
    .join('');
}

renderHome().catch((error) => {
  console.error(error);
});
