import { loadJSON, byId, createPill, pillClass } from './utils.js';

const examples = {
  urgency: 'Только сегодня вы можете не потерять результат. Не упустите шанс.',
  fear: 'Если вы не подтвердите это сейчас, вы рискуете потерять доступ.',
  guilt: 'Если бы вы правда заботились, вы бы сделали это немедленно.',
  pseudochoice: 'Вы можете отказаться, но тогда сами отвечаете за последствия.'
};

function classify(score) {
  if (score >= 5) return { label: 'высокое', className: 'danger' };
  if (score >= 2) return { label: 'среднее', className: 'warn' };
  return { label: 'низкое', className: 'ok' };
}

async function initDetectorV4() {
  const rules = await loadJSON('./data/detector-rules.json');

  const input = byId('input');
  const result = byId('result');
  const statusBadge = byId('statusBadge');
  const floatTitle = byId('detectorFloatTitle');
  const floatPills = byId('detectorFloatPills');
  const analyzeBtn = byId('analyzeBtn');
  const feedback = byId('feedback');
  const nextStep = byId('nextStep');
  const modeButtons = Array.from(document.querySelectorAll('.mode'));

  function setStatus(level) {
    statusBadge.textContent = level.label;
    statusBadge.style.background = `var(--${level.className}-bg)`;
    statusBadge.style.color = `var(--${level.className}-text)`;
  }

  function setFeedback(message = '', type = '') {
    feedback.textContent = message;
    feedback.className = type ? `feedback ${type}` : 'feedback';
  }

  function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    analyzeBtn.textContent = isLoading ? 'Анализируем…' : 'Проверить текст';
  }

  function setMode(mode) {
    modeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === mode);
    });
  }

  function renderEmpty() {
    result.innerHTML = `
      <div class="label">результат</div>
      <div class="title">Пусто</div>
      <p>Вставь текст, чтобы линза показала скрытое давление.</p>
    `;
    floatTitle.textContent = 'Ничего не найдено';
    floatPills.innerHTML = createPill('нейтрально', 'ok');
    setStatus({ label: 'низкое', className: 'ok' });
    setFeedback('Вставь текст для анализа.', 'error');
    nextStep.textContent = 'вставить текст';
    input.classList.add('error');
    input.focus();
  }

  function renderNeutral() {
    result.innerHTML = `
      <div class="label">результат</div>
      <div class="title">Сильных триггеров не видно</div>
      <p>Текст выглядит относительно нейтральным. Это не значит, что он идеален, но явного давления здесь не видно.</p>
    `;
    floatTitle.textContent = 'Ничего явного не найдено';
    floatPills.innerHTML = createPill('нейтрально', 'ok');
    setStatus({ label: 'низкое', className: 'ok' });
    setFeedback('Можно проверить другой пример.', 'ok');
    nextStep.textContent = 'проверить другой пример';
  }

  function renderError() {
    result.innerHTML = `
      <div class="label">ошибка</div>
      <div class="title">Что-то пошло не так</div>
      <p>Попробуй ещё раз. Если проблема повторится, открой страницу заново.</p>
    `;
    floatTitle.textContent = 'Ошибка анализа';
    floatPills.innerHTML = createPill('повторить', 'danger');
    setStatus({ label: 'ошибка', className: 'danger' });
    setFeedback('Не удалось обработать текст.', 'error');
    nextStep.textContent = 'попробовать ещё раз';
  }

  function renderSuccess(found, explanations) {
    const uniqueNames = [...new Set(found.map((rule) => rule.label))];
    const level = classify(found.reduce((sum, rule) => sum + rule.score, 0));
    setStatus(level);

    result.innerHTML = `
      <div class="label">результат</div>
      <div class="title">Найдено ${uniqueNames.length} приёма</div>
      <div class="pills">
        ${found.map((rule) => createPill(rule.label, pillClass(rule.type))).join('')}
      </div>
      <p>${explanations}</p>
    `;

    floatTitle.textContent = `Найдено ${uniqueNames.length} приёма`;
    floatPills.innerHTML = found.map((rule) => createPill(rule.label, pillClass(rule.type))).join('');
    setFeedback('Результат готов. Можно открыть разбор.', 'ok');
    nextStep.textContent = 'открыть разбор →';
  }

  async function analyze() {
    const text = input.value.trim().toLowerCase();
    input.classList.remove('error');
    setFeedback('');

    if (!text) {
      renderEmpty();
      return;
    }

    if (text.length < 12) {
      input.classList.add('error');
      setFeedback('Нужно чуть больше текста, чтобы увидеть приёмы.', 'error');
      nextStep.textContent = 'добавить текст';
      input.focus();
      return;
    }

    try {
      setLoading(true);
      const found = [];

      for (const rule of rules) {
        const matched = rule.patterns.some((pattern) => text.includes(pattern));
        if (matched) found.push(rule);
      }

      if (!found.length) {
        renderNeutral();
        return;
      }

      const explanations = [...new Set(found.map((rule) => rule.explanation))].join(' ');
      renderSuccess(found, explanations);
    } catch (error) {
      console.error(error);
      renderError();
    } finally {
      setLoading(false);
    }
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode);
      setFeedback(`Режим: ${button.textContent}.`, 'ok');
    });
  });

  input.addEventListener('input', () => {
    input.classList.remove('error');
    if (feedback.classList.contains('error')) setFeedback('');
  });

  analyzeBtn.addEventListener('click', analyze);

  const params = new URLSearchParams(window.location.search);
  const example = params.get('example');
  if (example && examples[example]) {
    input.value = examples[example];
    setFeedback('Подставлен готовый пример. Можно сразу проверить.', 'ok');
    analyze();
  }
}

initDetectorV4().catch((error) => {
  console.error(error);
});
