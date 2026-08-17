# Сложные SVG: диагностика и безопасная генерация

## Когда открывать

Открывай этот документ, если исходник содержит `<defs>`, gradients, patterns, filters, masks, clip paths, внутренние `<style>`/classes, `url(#id)`, CSS variables, `<use>`, text, нестандартный `viewBox`, пробелы в имени файла или визуально меняется после генерации. Также открывай его при жалобах на цвет, размер, обрезание или конфликт fragment ID.

## Сначала классифицируй риск

Проверь исходный SVG до редактирования:

```bash
npm run sprite:file-manager
```

Используй фактический package script нужного спрайта. Затем сравни source с `.svg-sprite/sprite.svg` и manifest, не делая вывод только по успешному exit code.

Особого внимания требуют:

- `fill="url(#gradient)"`, `stroke="url(#pattern)"`;
- `filter="url(#shadow)"`, `mask="url(#mask)"`, `clip-path="url(#clip)"`;
- CSS rules внутри `<style>` и внешние stylesheets;
- цвета через classes, presentation attributes и inline `style` одновременно;
- `currentColor`, уже существующие `var(...)`, `context-fill` и `context-stroke`;
- повторяющиеся IDs в `<defs>` разных файлов;
- SVG без `viewBox` или с width/height, не соответствующими viewBox;
- embedded images, fonts, scripts или external references.

## Фактический pipeline

Компилятор сначала применяет SVGO `preset-default`, сохраняя `viewBox`, затем custom transforms в таком порядке:

1. `removeSize` удаляет `width` и `height` с корневого `<svg>`.
2. `replaceColors` собирает значения `fill` и `stroke` из attributes и inline `style`, затем заменяет их на `var(--icon-color-N, fallback)`.
3. `addTransition` добавляет inline transition цветным `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`, `text`, `tspan` и `use`.

Все три опции по умолчанию `true` и применяются ко всему спрайту, не к отдельной иконке.

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'react@vite',
  name: 'illustrations',
  transform: {
    removeSize: false,
    replaceColors: false,
    addTransition: false,
  },
})
```

Это config для одного из потенциально многих sprite-модулей; его каталог не обязан совпадать с module/feature-каталогом. Для Next укажи соответствующий полный `mode` с тем же `transform`.

## Размеры и viewBox

`removeSize: true` удаляет intrinsic `width`/`height`, но не создаёт отсутствующий `viewBox`. Если source не имеет корректного `viewBox`, generated icon может получить неверное масштабирование или нулевую область просмотра.

Правильная подготовка source:

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="..." />
</svg>
```

Если физические размеры являются частью контракта иллюстрации, установи `removeSize: false` и проверь поведение component props. Не используй сохранение width/height как замену отсутствующему viewBox.

React compile оставляет root sprite `rootViewBox` выключенным; Next включает его. У каждой shape всё равно должен быть собственный корректный viewBox, который попадает в manifest и используется Viewer.

## Цвета

Для одного обнаруженного цвета fallback становится `currentColor`:

```svg
stroke="var(--icon-color-1, currentColor)"
```

Для нескольких цветов сохраняются исходные fallbacks:

```svg
fill="var(--icon-color-1, #798198)"
fill="var(--icon-color-2, #ffffff)"
```

Значения `none`, `transparent`, `inherit`, `unset` и `initial` не заменяются. Сравнение цветов нормализует регистр и пробелы, но не приводит эквивалентные формы (`#fff`, `#ffffff`, `rgb(...)`) к одному цвету.

Автоматический анализ надёжен прежде всего для `fill`/`stroke` attributes и inline `style`. Он не разбирает CSS selectors во внутреннем `<style>` и внешний stylesheet как полноценный CSS AST.

Для `url(#...)`, уже вложенных `var(...)`, gradients и patterns автоматическая замена требует проверки generated output. Если ссылка на paint server изменилась или Viewer неверно показывает controls, отключи `replaceColors` для всего этого спрайта:

```ts
transform: {
  replaceColors: false,
}
```

Если рядом нужны обычные recolorable icons, вынеси сложные иллюстрации в отдельный sprite с отдельным config. Это предпочтительнее ручной правки generated SVG.

`addTransition` независим от `replaceColors`. При сохранении исходных цветов transition всё равно может добавиться. Для filters, анимаций или собственного CSS отключай обе опции, если inline transition меняет поведение.

## Defs, references и IDs

После SVGO и сборки проверь, что каждая ссылка `url(#id)` или `<use href="#id">` указывает на реально существующий ID внутри соответствующей shape. Не предполагай, что IDs останутся буквальной копией source: optimizer/compiler может их изменить.

Проверяй как минимум:

- gradient/pattern применяется к нужному path;
- filter region не обрезает blur/shadow;
- mask и clipPath сохраняют coordinate system (`userSpaceOnUse`/`objectBoundingBox`);
- internal `<use>` не спутан с внешним fragment спрайта;
- одинаковые IDs из разных source SVG не создают cross-icon collision в итоговом документе;
- external file/URL references допустимы в production CSP и deployment.

Если IDs конфликтуют, сначала сделай source IDs уникальными и обнови все ссылки внутри SVG. Не правь compiled sprite.

## Имена файлов и внешний fragment

`FileManagerIcon` в примерах ниже — только пример generated-имени для отдельного config с `name: 'file-manager'`; это не фиксированное имя API.

Безопасный basename соответствует:

```text
^[a-zA-Z][a-zA-Z0-9_-]*$
```

Он сохраняется как fragment ID. Остальные имена, например `folder open.svg` или `24-check.svg`, остаются публичными значениями TypeScript `icon`, но получают стабильный ID `icon-<16 hex>`.

```tsx
<FileManagerIcon icon="folder open" />
```

Не создавай вручную `#folder open`. Используй generated component либо `.svg-sprite/svg-sprite.manifest.js`, где записаны `name` и фактический `id`.

Разные файлы с одинаковым basename запрещены даже из разных directories. Переименуй один source осмысленно; порядок или пересечение источников не выбирают победителя.

## Способ отображения

Для управления `color` и `--icon-color-N` используй generated React-компонент или `<svg><use>`:

```tsx
<FileManagerIcon
  icon="diagram"
  style={{
    '--icon-color-1': '#334155',
    '--icon-color-2': '#38bdf8',
  }}
/>
```

Generated style type допускает `--icon-color-${number}`. `<img>` и CSS `background-image` загружают SVG как изолированный document, поэтому variables страницы внутрь не передаются. CSS mask оставляет только силуэт и теряет gradients, filters и различия цветов.

External stack fragment support и поведение paint servers могут различаться между browsers. Для критичной сложной графики при диагностике runtime и наличии browser-инструментов проверь целевые browsers; при несовместимости SVG sprite может быть неподходящим способом доставки именно этой иллюстрации.

## Обязательная проверка

1. Запусти генерацию с правильным mode.
2. Запусти typecheck проекта.
3. Открой generated sprite и найди shape по ID из manifest.
4. Статически сверь `viewBox`, IDs, `url(#...)`, colors и inline styles.
5. Если менялись target/pipeline или диагностируется runtime, собери production bundle и проверь внешний hashed SVG.
6. При наличии SpriteViewer и визуальных инструментов проверь default colors и каждую `--icon-color-N` отдельно.
7. При наличии browser-инструментов и соответствующем runtime-риске проверь SSR/hydration для Next.js и целевые browsers для external fragments.
8. Не утверждай визуальную или a11y эквивалентность source и результата без доступных инструментов и фактического сравнения.

## Типовые симптомы и действия

- Иконка стала полностью `currentColor`: pipeline увидел один цвет. Если исходная семантика сложнее, отключи `replaceColors` или нормализуй source attributes.
- Gradient исчез: проверь, не преобразован ли `fill="url(#...)"`, существует ли target ID и не конфликтует ли он с другим icon.
- Shadow обрезан: проверь filter region и viewBox; `removeSize` сам по себе не расширяет область.
- Цветовые controls Viewer отсутствуют: цвет задан через class/stylesheet либо `replaceColors: false`; это ожидаемо.
- Transition дублируется или мешает animation: существующий inline `transition` не перезаписывается, но generated CSS также добавляет transitions; отключи `addTransition` для sprite.
- `<img>` игнорирует variables: смени rendering на `<svg><use>`/generated component, не пытайся передать page variables в изолированный SVG.
- Ручной fragment не работает для имени с пробелом: используй ID из manifest.
- Один сложный icon требует иных transforms: вынеси его в отдельный sprite; per-icon transform config отсутствует.

Для mode-specific запуска и проверки вернись к exact-mode guide, выбранному в основном `SKILL.md`.
