# Модель данных Opticanew

Этот документ фиксирует, что именно должно храниться в данных, а не в HTML.

## Принцип

Тексты и смысл сайта нельзя хардкодить в разметке.

HTML — это каркас.
JSON — это содержимое.
JS — это логика.
CSS — это визуальная система.

## Папка data/

```text
data/
  site.json
  detector-rules.json
  dossiers.json
  mechanisms.json
```

## 1. site.json

Хранит всё, что относится к главной странице.

### Что внутри:
- brand
- telegramLabel
- heroEyebrow
- heroTitle
- heroSubtitle
- primaryCta
- secondaryCta
- signals
- entryCards
- demoText

### Зачем:
Чтобы можно было менять тексты первого экрана без правки HTML.

## 2. detector-rules.json

Хранит правила анализа текста.

### Каждое правило содержит:
- id
- label
- type
- score
- patterns
- explanation
- honestRewriteHint

### Зачем:
Чтобы можно было менять логику детектора без переписывания всей страницы.

## 3. dossiers.json

Хранит глубокие материалы по каждому механизму.

### Каждое досье содержит:
- slug
- title
- summary
- clues
- mechanism
- outcome
- related

### Зачем:
Чтобы легко добавлять новые досье и не собирать каждое вручную в HTML.

## 4. mechanisms.json

Хранит короткий каталог паттернов.

### Каждый механизм содержит:
- id
- title
- shortDescription
- whereItAppears
- linkedDossier

### Зачем:
Чтобы делать архив и карточки без дублирования.

## Пример логики

### Если нужно поменять заголовок главной:
меняем `site.json`

### Если нужно добавить новый триггер в детектор:
меняем `detector-rules.json`

### Если нужно добавить новое досье:
меняем `dossiers.json`

## Запрет

Нельзя:
- писать тексты прямо в `index.html`
- дублировать правила в JS и JSON одновременно
- держать контент в CSS-комментариях или в random constants

## Итог

Если контент меняется часто — он живёт в data/.
Если стиль меняется часто — он живёт в styles/.
Если поведение меняется — оно живёт в scripts/.
