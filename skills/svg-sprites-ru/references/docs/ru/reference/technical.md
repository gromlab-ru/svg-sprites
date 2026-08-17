# Технический справочник

[Индекс документации](../README.md)

[Конфигурация JSON, JavaScript и TypeScript](../configuration.md)

Справочник по конфигурации, generated API и поведению `@gromlab/svg-sprites`. Пошаговую установку смотрите в руководстве для вашего стека:

- [Bare standalone](../guides/standalone.md)
- [Standalone + Vite](../guides/standalone-vite.md)
- [Standalone + Webpack 5](../guides/standalone-webpack.md)
- [React + Vite](../guides/react-vite.md)
- [React + Webpack 5](../guides/react-webpack.md)
- [Next.js App Router + Turbopack](../guides/next-app-turbopack.md)
- [Next.js App Router + Webpack](../guides/next-app-webpack.md)
- [Next.js Pages Router + Turbopack](../guides/next-pages-turbopack.md)
- [Next.js Pages Router + Webpack](../guides/next-pages-webpack.md)
- [Vue + Vite](../guides/vue-vite.md)
- [Vue + Webpack](../guides/vue-webpack.md)
- [Nuxt + Vite](../guides/nuxt-vite.md)
- [Nuxt + Webpack](../guides/nuxt-webpack.md)
- [Svelte + Vite](../guides/svelte-vite.md)
- [Svelte + Webpack](../guides/svelte-webpack.md)
- [SvelteKit + Vite](../guides/sveltekit-vite.md)
- [Angular application builder](../guides/angular-application.md)
- [Angular + Webpack](../guides/angular-webpack.md)
- [Astro + Vite](../guides/astro-vite.md)
- [Solid + Vite](../guides/solid-vite.md)
- [Solid + Webpack](../guides/solid-webpack.md)
- [SolidStart + Vite](../guides/solid-start-vite.md)
- [Preact + Vite](../guides/preact-vite.md)
- [Preact + Webpack](../guides/preact-webpack.md)
- [Qwik + Vite](../guides/qwik-vite.md)
- [Lit + Vite](../guides/lit-vite.md)
- [Lit + Webpack](../guides/lit-webpack.md)
- [Alpine.js + Vite](../guides/alpine-vite.md)
- [Alpine.js + Webpack](../guides/alpine-webpack.md)

## Требования

- Node.js 18 или новее;
- пакет распространяется как ESM и подключается через `import`;
- React 18 или 19 требуется только для React/Next generated-компонентов и `@gromlab/svg-sprites/react`;
- для типизации package exports используйте TypeScript 5+ с `moduleResolution: "bundler"`, `"node16"` или `"nodenext"`.

Для генерации не нужна dependency проекта. Запускайте CLI через `npx`:

```bash
npx --yes @gromlab/svg-sprites path/to/svg-sprite.config.json
```

Устанавливайте пакет как development dependency, только если проекту нужны
Viewer, типы конфига или программный API:

```bash
npm install --save-dev @gromlab/svg-sprites
```

## CLI и режимы генерации

Для генерации CLI принимает ровно один путь: явно выбранный config-файл либо каталог для config-less генерации:

```text
svg-sprites [options] <config-file-or-directory>
```

| Среда | Mode |
|---|---|
| Static HTML / собственная публикация | `standalone` |
| Standalone + Vite | `standalone@vite` |
| Standalone + Webpack 5 | `standalone@webpack` |
| Server release | `standalone@server` |
| React + Vite | `react@vite` |
| React + Webpack 5 | `react@webpack` |
| Vue + Vite | `vue@vite` |
| Vue + Webpack | `vue@webpack` |
| Nuxt + Vite | `nuxt@vite` |
| Nuxt + Webpack | `nuxt@webpack` |
| Svelte + Vite | `svelte@vite` |
| Svelte + Webpack | `svelte@webpack` |
| SvelteKit + Vite | `sveltekit@vite` |
| Angular application builder | `angular@application` |
| Angular + Webpack | `angular@webpack` |
| Astro + Vite | `astro@vite` |
| Solid + Vite | `solid@vite` |
| Solid + Webpack | `solid@webpack` |
| SolidStart + Vite | `solid-start@vite` |
| Preact + Vite | `preact@vite` |
| Preact + Webpack | `preact@webpack` |
| Qwik + Vite | `qwik@vite` |
| Lit + Vite | `lit@vite` |
| Lit + Webpack | `lit@webpack` |
| Alpine.js + Vite | `alpine@vite` |
| Alpine.js + Webpack | `alpine@webpack` |
| Next.js App Router + Turbopack | `next@app/turbopack` |
| Next.js App Router + Webpack 5 | `next@app/webpack` |
| Next.js Pages Router + Turbopack | `next@pages/turbopack` |
| Next.js Pages Router + Webpack 5 | `next@pages/webpack` |

Config-файл может иметь любое имя и расширение `.ts`, `.js` или `.json`. CLI не ищет конфиг по соглашению: файл нужно передать явно. В руководствах используется рекомендуемое имя `svg-sprite.config.json`.

Если передан каталог, все настройки берутся из CLI. Если передан config-файл, CLI-параметры перекрывают значения файла. Общий порядок: `defaults → config → CLI`.

`--help` и `-h` выводят справку без обязательного пути. Для генерации доступны `--mode`, `--source <local|remote>`, `--name`, `--description`, повторяемый `--input <path-or-glob>`, а также пары `--remove-size`/`--no-remove-size`, `--replace-colors`/`--no-replace-colors`, `--add-transition`/`--no-add-transition` и `--generated-notice`/`--no-generated-notice`. Переданные transform-флаги перекрывают отдельные поля, а хотя бы один `--input` полностью заменяет значение `input` из config.

В CLI заключайте glob-паттерны в одинарные кавычки, чтобы shell не раскрыл их до запуска генератора:

```bash
svg-sprites --input './icons/**/*.svg' --input '!./icons/legacy/**' svg-sprite.config.ts
```

Mode должен соответствовать способу публикации приложения. Bare `standalone` оставляет публичный URL приложению; Vite и Webpack modes генерируют bundler-specific подключение SVG asset.

## Единая конфигурация

Каждый config-файл описывает один независимый спрайт.

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'next@app/turbopack',
  name: 'app',
  description: 'Общие иконки приложения',
  input: [
    './local-icons',
    '../../assets/icons/*.svg',
    '!../../assets/icons/deprecated-*.svg',
  ],
  transform: {
    removeSize: true,
    replaceColors: true,
    addTransition: true,
  },
  generatedNotice: true,
})
```

| Опция | Тип | По умолчанию | Назначение |
|---|---|---|---|
| `mode` | `SpriteMode` | Нет | Режим генерации; можно передать через CLI/API |
| `source` | `local \| remote` | `local` | Исходные SVG либо готовый server manifest |
| `name` | `string` | Выводится из каталога | Имя спрайта; в modes с компонентом также задаёт имя компонента и публичных типов |
| `description` | `string` | Нет | Описание для типов и debug manifest |
| `input` | `SpriteInput \| SpriteInput[]` | `./icons` | Локальные SVG sources, server HTTP descriptors либо один remote manifest в зависимости от mode и source |
| `transform` | `TransformOptions` | Все включены | Настройки подготовки SVG |
| `generatedNotice` | `boolean` | `true` | Полное или короткое предупреждение в generated-файлах |

При `source: 'remote'` поле `input` содержит один local path или HTTP(S) URL
manifest, созданного `standalone@server`. Remote consumer config может содержать
только `mode`, `source` и `input`: name, description, transforms и generated notice
проверяются и наследуются из server manifest. До codegen генератор скачивает profile,
необходимый exact consumer mode, и проверяет его SHA-256 и размер. Runtime-зависимости
от server manifest нет.

### Имя спрайта

`name` записывается в kebab-case и должно начинаться с латинской буквы:

```text
app          → AppIcon
file-manager → FileManagerIcon
```

Если `name` не задано, генератор преобразует имя каталога в kebab-case. Для каталога с именем `svg-sprite` или `svg-sprites` используется имя родительского каталога.

### Источники иконок

`SpriteConfig.input` является необязательным и имеет тип `string | string[]`. Если поле отсутствует, источником служит папка `./icons` относительно папки конфига. В config-less режиме относительные пути считаются от каталога, переданного CLI или API.

Каждая строка без префикса `!` может быть путём к конкретной папке, конкретному файлу `.svg` или glob-паттерном. Папка включает только непосредственные дочерние `*.svg`. Для рекурсивного обхода вложенных каталогов укажите явный паттерн, например `icons/**/*.svg`.

Массив объединяет все включающие источники. Паттерн с префиксом `!` глобально исключает совпадения из общего результата независимо от того, какой источник их добавил.

Поддерживается следующий glob-синтаксис:

| Синтаксис | Значение |
|---|---|
| `*` | Любые символы внутри одного сегмента пути |
| `**` | Любое число вложенных каталогов |
| `?` | Один символ внутри сегмента пути |
| `{a,b}` | Одна из альтернатив |
| `[abc]` | Один символ из набора или диапазона |
| `!pattern` | Исключение совпадений из всего объединённого input |

Каждый включающий источник или паттерн должен найти хотя бы один SVG, иначе генерация завершается ошибкой. Повторяющиеся пути удаляются, а итоговый список файлов детерминированно сортируется. Разные SVG с одинаковым basename по-прежнему считаются конфликтом, потому что basename задаёт публичное имя иконки.

### Server SVG inputs

`standalone@server` принимает те же local strings и HTTP(S) descriptors в массиве
`input`:

```ts
{
  name: 'brand-logo',
  url: 'https://assets.example.com/brand-logo.svg',
  sha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
}
```

`name` становится публичным именем иконки. Необязательный `sha256` проверяется по
скачанным байтам. URL credentials и активное SVG-содержимое, включая scripts,
event handlers, `foreignObject` и doctype, запрещены. Один HTTP source ограничен
2 MiB, все источники вместе — 25 MiB, timeout запроса равен 15 секундам. Local и
HTTP entries используют единое пространство имён, поэтому duplicate icon names
завершают генерацию с ошибкой.

## Generated-модуль

После генерации React- или Next.js-каталог спрайта выглядит так:

```text
app-icons/
├── .gitignore
├── svg-sprite.config.json
├── index.ts                         # необязательный пользовательский barrel
└── .svg-sprite/
    ├── index.js
    ├── index.d.ts
    ├── icon-data.js
    ├── icon-data.d.ts
    ├── sprite.svg
    ├── svg-sprite.manifest.js
    ├── svg-sprite.manifest.d.ts
    └── react/
        ├── react-component.js
        ├── react-component.d.ts
        └── react-component.module.css
```

| Файл | Назначение |
|---|---|
| `.svg-sprite/index.js` | Mode-specific production facade и runtime-список имён |
| `.svg-sprite/index.d.ts` | Публичные декларации facade, компонента и union-типа имён |
| `.svg-sprite/svg-sprite.manifest.js` | Debug metadata и URL asset для `SpriteViewer` |
| `.svg-sprite/sprite.svg` | Собранный SVG-спрайт |
| `.svg-sprite/react/react-component.js` | Runtime React-компонента без TypeScript и JSX |
| `.svg-sprite/react/react-component.d.ts` | Props, style и declaration React-компонента |
| `.svg-sprite/react/react-component.module.css` | Стили конкретной React-реализации |
| `.svg-sprite/icon-data.js` | Runtime-список имён и внутренние IDs |
| `.svg-sprite/*.d.ts` | TypeScript-декларации соответствующих JS-модулей |

Standalone-контракты не создают каталог `react/`. Bare `standalone` содержит только
runtime asset и deployment-neutral manifest data:

```text
.svg-sprite/
├── sprite.svg
└── svg-sprite.manifest.json
```

`standalone@vite` и `standalone@webpack` дополнительно создают `index.*`,
`icon-data.*` и resolved `svg-sprite.manifest.*`. Их facade содержит нативный
generated Web Component без внешних runtime-зависимостей. Bare `standalone`
намеренно не создаёт JavaScript-компонент.

`standalone@server` создаёт готовый к публикации release без JavaScript runtime и
`.gitignore`:

```text
.svg-sprite/
├── sprite.<content-hash>.svg
├── sprite-root-viewbox.<content-hash>.svg
└── svg-sprite.manifest.json
```

Manifest описывает оба compile profiles через relative `href`, полный SHA-256 и
размер в байтах. Публикуйте весь каталог атомарно; consumer разрешает каждый profile
относительно URL или local path manifest.

`.svg-sprite` полностью управляется генератором и при каждой генерации заменяется целиком. Любые добавленные в него файлы будут удалены. Пользовательские файлы размещайте рядом, например в корневом `index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

## Standalone Web Component и TypeScript

В modes `standalone@vite` и `standalone@webpack` спрайт с `name: 'app'`
экспортирует функцию регистрации `defineAppIconElement()` и tag `<app-icon>`:

```ts
import { defineAppIconElement } from '@/ui/app-icons'

defineAppIconElement()
```

После регистрации элемент можно использовать в HTML:

```html
<app-icon icon="search" aria-hidden="true"></app-icon>

<app-icon
  icon="settings"
  role="img"
  aria-label="Настройки"
></app-icon>
```

Компонент рендерит `<svg><use>` в открытом Shadow DOM, сам выбирает внутренний
ID и `viewBox`, а URL asset получает через соответствующий Vite или Webpack
механизм. Размер host по умолчанию равен `1em × 1em`; `class`, `style`, `color`
и `--icon-color-N` задаются обычным CSS.

Generated `HTMLElementTagNameMap` типизирует property API:

```ts
const icon = document.createElement('app-icon')

icon.icon = 'search'
icon.icon = 'unknown' // ошибка TypeScript
```

Значения атрибутов в обычной HTML-разметке TypeScript не проверяет. Поэтому
неизвестный `icon="unknown"` дополнительно проверяется в runtime: компонент
скрывает внутренний SVG и сообщает об ошибке, не создавая fragment
`#undefined`. Повторный вызов `defineAppIconElement()` безопасен для того же
спрайта; конфликт с другим элементом под tag `<app-icon>` завершается ошибкой.

## React-компонент и TypeScript

Спрайт с `name: 'app'` экспортирует:

```ts
export { AppIcon, appIconNames }
export type { AppIconName, AppIconProps, AppIconStyle }
```

### Имена иконок

Имена SVG-файлов становятся допустимыми значениями `icon`:

```tsx
<AppIcon icon="search" />
<AppIcon icon="unknown" /> // ошибка TypeScript
```

Runtime-список содержит те же значения:

```ts
import { appIconNames } from '@/ui/app-icons'

// readonly ['search', 'settings', 'user']
```

Имена с пробелами и другими небезопасными для SVG ID символами остаются частью публичного API. Для внутреннего fragment ID генератор создаёт стабильный безопасный hash:

```text
folder open.svg → icon="folder open" → id="icon-<stable-hash>"
```

Для таких имён используйте generated-компонент или `id` из debug manifest, а не формируйте fragment ID вручную.

### SVG-атрибуты

По умолчанию компонент рендерит `<svg>` и принимает стандартные SVG-атрибуты:

```tsx
<AppIcon
  icon="search"
  width={24}
  height={24}
  color="rebeccapurple"
  className="searchIcon"
  aria-label="Поиск"
/>
```

Компонент не добавляет accessibility-семантику автоматически. Передавайте подходящие `aria-*`, `role` или подпись в зависимости от назначения иконки.

### Обёртка

`wrapped` рендерит `<span>` с внутренним SVG. Остальные props в этом режиме относятся к `<span>`:

```tsx
<AppIcon icon="search" wrapped className="iconWrapper" />
```

### Типизированные CSS-переменные

`AppIconStyle` расширяет `CSSProperties` и поддерживает свойства вида `--icon-color-N`:

```tsx
<AppIcon
  icon="user"
  style={{
    '--icon-color-1': '#2563eb',
    '--icon-color-2': '#dbeafe',
  }}
/>
```

## Множественные спрайты

Каждый каталог с конфигом создаёт независимый mode-specific контракт. Framework modes создают нативный компонент и declarations, standalone bundler modes — Web Component и declarations, а bare `standalone` — SVG и JSON manifest:

```text
app-icons       → AppIcon       → общие иконки
analytics-icons → AnalyticsIcon → иконки страницы аналитики
editor-icons    → EditorIcon    → иконки редактора
```

Один исходный SVG можно добавить через `input` в несколько конфигураций. Копировать файл в каталоги каждого спрайта не требуется.

Для нескольких спрайтов добавьте отдельную CLI-команду для каждого каталога или объедините команды в общем npm script.

## Форматы и способы отображения

Все текущие modes создают формат `stack`.

| Формат | `<svg><use>` | `<img>` | CSS background |
|---|---:|---:|---:|
| `stack` | Да | Да | Да |

### Generated-компонент

Используйте generated native-компонент из guide выбранного exact mode. Он знает внутренние ID, формирует URL и предоставляет TypeScript API. Для React и Next.js это выглядит так:

```tsx
<AppIcon icon="search" width={24} height={24} />
```

Для `standalone@vite` и `standalone@webpack` используйте generated Web Component:

```html
<app-icon icon="search" style="font-size: 24px"></app-icon>
```

### Вручную через `<svg><use>`

Способ получения `spriteUrl` зависит от сборщика.

Static HTML после публикации `.svg-sprite/sprite.svg` приложением:

```html
<svg aria-hidden="true">
  <use href="/assets/icons.svg#search"></use>
</svg>
```

Standalone Vite/Webpack предоставляет generated `getAppIconHref()` и mapping
внутренних IDs. Не конструируйте fragment из небезопасного имени файла вручную.

Vite:

```ts
import spriteUrl from './.svg-sprite/sprite.svg?no-inline'
```

Webpack 5, Turbopack и Next.js:

```ts
const spriteUrl = new URL('./.svg-sprite/sprite.svg', import.meta.url).href
```

После получения URL используйте его в JSX:

```tsx
<svg width="24" height="24" aria-label="Поиск">
  <use href={`${spriteUrl}#search`} />
</svg>
```

Для имён, небезопасных как SVG ID, используйте внутренний `id` из manifest.

### Через `<img>`

```tsx
<img src={`${spriteUrl}#search`} width={24} height={24} alt="Поиск" />
```

SVG внутри `<img>` изолирован от CSS страницы. `color` и `--icon-color-N` на внешнем элементе не изменяют его внутренние цвета.

### Через CSS

```css
.icon {
  background: url('./.svg-sprite/sprite.svg#search') center / contain no-repeat;
}
```

Для одноцветного силуэта можно использовать mask:

```css
.icon {
  background-color: currentColor;
  mask: url('./.svg-sprite/sprite.svg#search') center / contain no-repeat;
}
```

Mask не сохраняет исходные цвета, gradients и различия между `fill` и `stroke`.

Путь в CSS разрешается относительно самого CSS-файла. В примерах CSS-файл находится рядом с `svg-sprite.config.ts`.

## Assets и кеширование

Generated component или standalone facade передаёт SVG сборщику как отдельный asset:

- Vite использует статический импорт с `?no-inline`;
- Webpack 5, Turbopack и Next.js используют `new URL(..., import.meta.url)`;
- SVG path-данные не сериализуются в generated JavaScript.

Bare `standalone` не участвует в asset pipeline: приложение само копирует или
публикует `sprite.svg` и отвечает за URL, версионирование и cache policy.

При стандартном именовании assets сборщик добавляет content hash:

```text
/assets/sprite-<hash>.svg
```

Это позволяет кешировать SVG отдельно от JavaScript. Изменение React-кода не меняет содержимое спрайта, а изменение иконок создаёт новую версию asset.

HTTP cache headers, CDN и `Cache-Control` настраиваются приложением или платформой размещения. Для Webpack имя итогового файла зависит от `assetModuleFilename` проекта.

## Трансформации SVG

Все трансформации включены по умолчанию и настраиваются независимо:

| Опция | Что делает |
|---|---|
| `removeSize` | Удаляет `width` и `height` с корневого `<svg>`, сохраняя существующий `viewBox` |
| `replaceColors` | Заменяет найденные `fill` и `stroke` на `--icon-color-N` |
| `addTransition` | Добавляет transitions для `fill` и `stroke` в цветные элементы и generated styles |

Чтобы отключить отдельную операцию:

```ts
export default defineSpriteConfig({
  mode: 'next@app/turbopack',
  transform: {
    removeSize: false,
    replaceColors: false,
    addTransition: false,
  },
})
```

Исходные SVG не изменяются. Трансформации применяются только к содержимому generated-спрайта.

## Управление цветами

### Монохромные иконки

Если найден один цвет, fallback становится `currentColor`:

```svg
stroke="var(--icon-color-1, currentColor)"
```

Цвет задаётся через prop или CSS:

```tsx
<AppIcon icon="search" color="rebeccapurple" />
```

### Многоцветные иконки

Каждый уникальный цвет получает отдельную переменную с исходным fallback:

```svg
fill="var(--icon-color-1, #798198)"
fill="var(--icon-color-2, #ffffff)"
fill="var(--icon-color-3, #129d9d)"
```

Можно заменить только необходимые значения:

```css
.icon {
  --icon-color-1: #4b5563;
  --icon-color-3: #14b8a6;
}
```

### Ограничения

- `none`, `transparent`, `inherit`, `unset` и `initial` не заменяются;
- надёжнее всего обрабатываются цвета в атрибутах `fill`, `stroke` и inline `style`;
- CSS-классы и внешние stylesheets внутри SVG не являются основным сценарием трансформации;
- значения `url(#...)` могут быть заменены вместе с цветами, поэтому gradients и patterns требуют отдельного спрайта с `replaceColors: false`;
- masks, filters и сложные внутренние CSS-правила требуют визуальной проверки;
- CSS-переменные страницы доступны через `<svg><use>`, но не внутри `<img>` и CSS background.

Для сложной иконки можно отключить `replaceColors` в конфигурации отдельного спрайта.

## SpriteViewer

Viewer использует один Web Component с Shadow DOM для всех modes. React и будущие framework-компоненты являются bridge к этому же элементу, поэтому визуал и поведение не дублируются.

Bare `standalone` подключает самостоятельный browser bundle и передаёт URL JSON manifest и опубликованного SVG:

```html
<script
  type="module"
  src="https://unpkg.com/@gromlab/svg-sprites@<version>/dist/viewer-element.js"
></script>

<gromlab-sprite-viewer
  viewer-title="Иконки проекта"
  manifest-url="/app-icons/manifest.json"
  sprite-url="/app-icons/sprite.svg"
></gromlab-sprite-viewer>
```

`viewer-element.js` не имеет дополнительных runtime-файлов и может быть скопирован с остальными static assets для self-hosting.

`standalone@vite` и `standalone@webpack` регистрируют тот же элемент через npm entry и передают generated JS manifest через свойство `sources`:

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
import spriteManifest from './svg-sprite/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.querySelector<SpriteViewerElement>('gromlab-sprite-viewer')!
viewer.sources = [spriteManifest]
```

React и Next.js сохраняют компонентный API:

```tsx
import { SpriteViewer } from '@gromlab/svg-sprites/react'
```

Он принимает готовые manifests, remote standalone sources, массив lazy loaders или record формата `import.meta.glob`.

Vite:

```tsx
import { SpriteViewer } from '@gromlab/svg-sprites/react'
import type { SpriteManifestModule } from '@gromlab/svg-sprites/react'

const sources = import.meta.glob<SpriteManifestModule>(
  '/src/**/svg-sprite/.svg-sprite/svg-sprite.manifest.js',
)

export const IconsDebugPage = () => (
  <SpriteViewer sources={sources} title="Иконки проекта" />
)
```

Webpack и Next.js:

```tsx
const sources = [
  () => import('@/ui/app-icons/.svg-sprite/svg-sprite.manifest.js'),
  () => import('@/features/analytics/icons/.svg-sprite/svg-sprite.manifest.js'),
]

export const IconsDebugPage = () => (
  <SpriteViewer sources={sources} />
)
```

Viewer показывает группы, поиск, `viewBox`, CSS-переменные и fallback-цвета. Framework manifests получают вкладку своего framework, а также SVG, IMG и CSS; standalone manifests получают SVG, IMG и CSS. Цветовые значения можно менять в интерфейсе и сразу проверять результат.

### Тема Viewer

По умолчанию `colorTheme="auto"` следует `prefers-color-scheme`. Можно передать `light` или `dark` явно:

```tsx
<SpriteViewer sources={sources} colorTheme="dark" />
```

Для синхронизации с темой приложения:

```tsx
<SpriteViewer
  sources={sources}
  colorTheme={appTheme}
  onColorThemeChange={setAppTheme}
/>
```

`@gromlab/svg-sprites/react` содержит `'use client'` и рендерит Web Component host; внутренний Shadow DOM создаётся после загрузки browser runtime. В Next.js App Router размещайте Viewer внутри отдельной Client Component boundary и используйте только на debug-маршруте или во внутреннем инструменте.

## Generated-файлы, Git и CI

Все modes, кроме bare `standalone`, создают локальный `.gitignore` для:

```text
/.svg-sprite/
```

Локальный `.gitignore` следует один раз добавить в репозиторий. Он исключает остальные generated-файлы, поэтому генерацию нужно запускать перед командами, которые импортируют sprite-модуль:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites src/ui/app-icons/svg-sprite.config.ts",
    "predev": "npm run sprites",
    "prebuild": "npm run sprites",
    "pretypecheck": "npm run sprites"
  }
}
```

CI должен выполнять generation script до сборки или проверки типов. Локальная установка package не нужна, если CI не использует Viewer, package-типы config или программный API.

Bare `standalone` не создаёт `.gitignore` и сохраняет пользовательский файл. Если после другого mode остался управляемый `.gitignore`, bare mode удалит его. В остальных modes генератор откажется перезаписать пользовательский `.gitignore` без generated marker. Корневой `index.ts` остаётся пользовательским и может переэкспортировать generated API.

## Диагностика

- Для всех modes, кроме bare `standalone`: если нет `.svg-sprite/index.js`, запустите generation script до импорта generated-модуля.
- Не найден источник: передайте существующий config-файл или каталог sprite-модуля.
- Не указан mode: добавьте `mode` в config либо передайте `--mode`.
- Иконка отсутствует в типе: проверьте `input`, расширение `.svg`, glob-исключения и необходимость `**/*.svg` для вложенных папок.
- Конфликт имени: два разных SVG имеют одинаковый basename; переименуйте один файл.
- `Refusing to overwrite a user file`: в корне sprite-модуля находится пользовательский `.gitignore`, который генератор не может заменить.
- Иконка не меняет цвет: используйте `<svg><use>` или generated-компонент и проверьте `replaceColors`.
- Webpack выдаёт неверный URL: проверьте Asset Modules, `output.publicPath` и SVG loaders.
- Static sprite возвращает 404: проверьте post-generation copy или server alias и не передавайте filesystem `spritePath` в HTML.
- Viewer не видит спрайт: для bundler modes проверьте путь к `.svg-sprite/svg-sprite.manifest.js`; для bare `standalone` — URL опубликованных `svg-sprite.manifest.json` и `sprite.svg`. Выполните генерацию до запуска приложения.
- Build и mode не совпадают: используйте target, соответствующий фактическому сборщику.

Для собственного orchestration и низкоуровневой компиляции смотрите [Программный API](programmatic-api.md).
