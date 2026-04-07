import { loadJSON, byId, createPill, pillClass } from './utils.js';

function classify(score) {
  if (score >= 5) return { label: 'высокое', className: 'danger' };
  if (score >= 2) return { label: 'среднее', className: 'warn' };
  return { label: 'низкое', className: 'ok' };
}

async function initDetector() {
  const rules = await loadJSON('./data/detector-rules.json');

  const input = byId('input');
  const result = byId('result');
  const statusBadge = byId('statusBadge');
  const floatTitle = byId('detectorFloatTitle');
  const floatPills = byId('detectorFloatPills');
  const analyzeBtn = byId('analyzeBtn');

  function analyze() {
    const text = input.value.toLowerCase().trim();

    if (!text) {
      result.innerHTML = `
        <div class="label">результат</div>
        <div class="title">Пусто</div>
        <p>Вставь текст, чтобы увидеть скрытое давление.</p>
      `;
      statusBadge.textContent = 'низкое';
      floatTitle.textContent = 'Ничего не найдено';
      floatPills.innerHTML = createPill('нейтрально', 'ok');
      return;
    }

    let total = 0;
    let found = [];

    for (const rule of rules) {
      const matched = rule.patterns.some((pattern) => text.includes(pattern));
      if (matched) {
        total += rule.score;
        found.push(rule);
      }
    }

    const level = classify(total);
    statusBadge.textContent = level.label;

    if (found.length === 0) {
      result.innerHTML = `
        <div class="label">результат</div>
        <div class="title">Ничего явного не найдено</div>
        <p>Текст выглядит относительно нейтральным. Сильных триггеров здесь не видно.</p>
      `;
      floatTitle.textContent = 'Ничего не найдено';
      floatPills.innerHTML = createPill('нейтрально', 'ok');
      return;
    }

    const explanations = [...new Set(found.map((rule) => rule.explanation))].join(' ');
    const uniqueNames = [...new Set(found.map((rule) => rule.label))];

    result.innerHTML = `
      <div class="label">результат</div>
      <div class="title">Найдено ${uniqueNames.length} приёма</div>
      <div class="pills">
        ${found.map((rule) => createPill(rule.label, pillClass(rule.type))).join('')}
      </div>
      <p>${explanations}</p>
    `;

    floatTitle.textContent = `Найдено ${uniqueNames.length} приёма`;
    floatPills.innerHTML = found
      .map((rule) => createPill(rule.label, pillClass(rule.type)))
      .join('');
  }

  analyzeBtn.addEventListener('click', analyze);
  window.addEventListener('load', analyze);
}

initDetector().catch((error) => {
  console.error(error);
});
