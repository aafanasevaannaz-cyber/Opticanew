export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${path}`);
  }
  return response.json();
}

export function byId(id) {
  return document.getElementById(id);
}

export function pillClass(type) {
  if (type === 'danger') return 'danger';
  if (type === 'warn') return 'warn';
  return 'ok';
}

export function createPill(label, type = '') {
  return `<span class="pill ${type}">${label}</span>`;
}
