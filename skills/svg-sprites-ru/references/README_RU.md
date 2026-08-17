# @gromlab/svg-sprites

[🇬🇧 English](https://github.com/gromlab-ru/svg-sprites/blob/master/README.md) | 🇷🇺 Русский

![npm](https://img.shields.io/npm/v/@gromlab/svg-sprites) ![license](https://img.shields.io/npm/l/@gromlab/svg-sprites)

`@gromlab/svg-sprites` — CLI-инструмент для генерации SVG-спрайтов в современных веб-приложениях. Он собирает выбранные SVG-иконки в один или несколько внешних кешируемых спрайтов и подготавливает их для использования в интерфейсе.

Каждый exact mode создаёт нативный типизированный компонент для своего framework и bundler: Web Component, React, Vue, Svelte, Angular, Astro, Solid, Preact, Qwik, Lit или Alpine.js. SVG во всех случаях остаётся отдельным кешируемым asset.

## SVG-спрайт так же прост, как обычная SVG-иконка

Для всего спрайта генерируется один типизированный React-компонент. Выберите иконку через `icon`, а редактор покажет автокомплит всех доступных имён.

```tsx
<AppIcon icon="search" width={24} height={24} />
```

Компонент принимает привычные SVG-атрибуты: размеры, `color`, `className`, `style`, `aria-*` и обработчики событий. Если нужен внешний контейнер, добавьте `wrapped`.

```tsx
<AppIcon icon="search" wrapped className="iconWrapper" />
```

В приложении не приходится работать со спрайтом напрямую. Вы используете его так же, как обычную SVG-иконку, но получаете один компонент, автокомплит и TypeScript-проверку всех имён.

## AI-friendly из коробки

`@gromlab/svg-sprites` сразу рассчитан на работу с AI-агентами. Подключите готовый skill и поручите агенту настройку, миграцию или диагностику без длинных инструкций и ручного изучения документации.

Установить русскоязычный skill:

```bash
npx skills add gromlab-ru/svg-sprites --skill svg-sprites-ru
```

Установить англоязычный skill:

```bash
npx skills add gromlab-ru/svg-sprites --skill svg-sprites
```

## От SVG до компонента за три шага

Основной пример использует Next.js App Router и Turbopack.

### 1. Укажите нужные иконки

Создайте папки для исходных иконок и спрайта:

```text
assets/
├── app-icons/
│   └── svg-sprite.config.json
└── svg-icons/
    ├── search.svg
    └── settings.svg
```

Создайте конфигурацию спрайта:

```json
{
  "mode": "next@app/turbopack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

`input` поддерживает пути к папкам, отдельным SVG и glob-шаблоны.

### 2. Добавьте генерацию

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "prebuild": "npm run sprites"
  }
}
```

Создайте точку входа для сгенерированного API:

```ts
// assets/app-icons/index.ts
export * from './.svg-sprite/index.js'
```

Первый запуск:

```bash
npm run sprites
```

Пакет создаст `AppIcon`, TypeScript-типы и отдельный SVG-спрайт.

### 3. Используйте как обычную иконку

```tsx
// app/page.tsx
import { AppIcon } from '../assets/app-icons'

export default function SearchButton() {
  return (
    <button type="button">
      <AppIcon icon="search" width={20} height={20} />
      Найти
    </button>
  )
}
```

Это Server Component. Для иконки не нужны provider, `'use client'` или ручная сборка URL.

## Типизированный React-компонент с автокомплитом

Каждый спрайт получает собственный готовый компонент. Свойство `icon` формируется из реальных имён SVG, поэтому редактор показывает точный список доступных иконок, а TypeScript сразу обнаруживает опечатки.

```tsx
<AppIcon icon="search" />  // доступная иконка
<AppIcon icon="serach" />  // ошибка TypeScript
```

После добавления новой SVG-иконки и повторной генерации её имя автоматически появляется в типах и автокомплите. Не нужно вручную поддерживать компоненты, union-типы или реестр имён.

## Next.js App Router и SSR из коробки

Generated-компоненты работают в Server Components, SSR и SSG без `'use client'`.

Подключение иконки не переносит страницу на клиент, не требует provider и не создаёт дополнительную границу гидратации.

Один и тот же компонент можно использовать в `page.tsx`, `layout.tsx`, серверных и клиентских компонентах.

## Множественные спрайты вместо одного глобального

Проект не ограничен одним набором иконок. Создавайте независимые спрайты для общих элементов, отдельных страниц и крупных UI-модулей.

```tsx
<AppIcon icon="search" />
<AnalyticsIcon icon="chart" />
<EditorIcon icon="bold" />
```

Каждый набор получает собственный типизированный компонент и SVG asset, поэтому разделы приложения не несут иконки, которые им не нужны.

## Каждая иконка хранится в одном экземпляре

В библиотеке исходников каждая SVG-иконка хранится в одном экземпляре и может входить в любое количество спрайтов. Общие иконки не приходится копировать между страницами и модулями: они обновляются для всех наборов из одного места.

```text
search.svg ─┬─→ AppIcon
            ├─→ AnalyticsIcon
            └─→ EditorIcon
```

Спрайты разделяются ради производительности, но библиотека исходных иконок остаётся единой.

## Браузерное кеширование

При стандартной конфигурации Vite, Webpack или Next.js каждый спрайт выпускается отдельным версионированным SVG-файлом.

Пока набор иконок не меняется, браузер может использовать сохранённую копию независимо от обновлений JavaScript приложения.

Изменение React-компонентов не требует повторно загружать геометрию всех иконок.

## JavaScript без SVG-балласта

Контуры иконок остаются во внешних SVG assets и не увеличивают chunks приложения.

```text
React-код   → JavaScript chunks
SVG-иконки  → отдельные SVG assets
```

JavaScript отвечает за интерфейс и поведение, а графика загружается и кешируется отдельно.

## Трансформации SVG из коробки

Во время генерации пакет автоматически подготавливает исходные SVG для интерфейса:

- удаляет фиксированные `width` и `height`;
- сохраняет существующий `viewBox`;
- преобразует `fill` и `stroke` в CSS-переменные;
- добавляет плавные transitions непосредственно в цветные элементы иконки.

Каждую трансформацию можно настроить или отключить независимо.

## Каждый цвет под контролем CSS

При генерации цвета `fill` и `stroke` автоматически преобразуются в CSS-переменные `--icon-color-N`.

Монохромная иконка наследует `currentColor`:

```tsx
<AppIcon icon="search" color="rebeccapurple" />
```

В многоцветной иконке каждый цвет можно менять отдельно:

```tsx
<AppIcon
  icon="user"
  style={{
    '--icon-color-1': '#2563eb',
    '--icon-color-2': '#dbeafe',
  }}
/>
```

Темы, состояния и hover-эффекты создаются без редактирования SVG и дополнительных копий иконки.

## SpriteViewer: все спрайты на одной debug-странице

`SpriteViewer` рендерит спрайты всех поддерживаемых exact modes в одном месте. Один Web Component отвечает за визуал, а для React также доступен тонкий bridge к нему.

Для каждой иконки видны созданные CSS-переменные и их fallback-цвета. Значения можно менять прямо в Viewer и сразу наблюдать результат.

Здесь же доступны готовые примеры для framework из manifest, `<svg><use>`, `<img>` и CSS.

![SpriteViewer](https://raw.githubusercontent.com/gromlab-ru/svg-sprites/master/preview-image.png)

Viewer подключается только к внутренней debug-странице и не становится частью generated-компонентов иконок.

Bare standalone подключает Viewer через browser script и HTML element. Bundler и framework modes используют npm entry Web Component; React и Next.js также могут импортировать bridge из `@gromlab/svg-sprites/react`.

## 30 exact modes

Пакет поддерживает 30 изолированных exact modes: `standalone@server` для серверной генерации универсального SVG-спрайта и 29 consumer modes для современных frameworks и bundlers.

`standalone@server` позволяет заранее сгенерировать SVG-спрайт на сервере или в CI/CD и опубликовать его для совместного использования. Такой спрайт не привязан к конкретному framework или bundler и подходит всем consumer modes.

29 consumer modes охватывают standalone, React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Angular, Astro, Solid, SolidStart, Preact, Qwik, Lit и Alpine.js в поддерживаемых вариантах Vite, Webpack, Turbopack и application builder.

Все 29 consumer modes могут работать как со спрайтами, сгенерированными локально в проекте, так и с универсальными спрайтами, заранее сгенерированными на сервере через `standalone@server`. API компонентов и способ использования иконок в приложении в обоих сценариях остаются одинаковыми.

Интеграционная матрица охватывает все 30 exact modes. Отдельный producer-стенд проверяет серверную генерацию универсального спрайта, а каждое из 29 consumer-приложений генерирует и рендерит два независимых спрайта: локальный и удалённый.

Все consumer-приложения проходят production build и Playwright-тесты, а типизированные modes дополнительно проверяются штатным toolchain фреймворка. Каждый E2E-тест подтверждает, что локальный и удалённый спрайты загружаются и отрисовываются, а также проверяет отсутствие browser errors и отображение обеих групп в SpriteViewer.

## Чистый Git

Bundler и framework modes создают локальный `.gitignore`, который исключает generated-файлы и не позволяет им засорять историю, pull requests и код проекта. Bare `standalone` оставляет политику репозитория приложению.

В bundler и framework modes в репозитории остаются исходные SVG, конфигурация и правило `.gitignore`, а локально и в CI спрайты, компоненты и типы заново создаются через `prebuild`.

## В production только иконки

Генерация полностью работает через `npx`, без добавления package в проект. Устанавливайте его как development dependency, только если нужны Viewer, типы конфига или программный API.

Production-компоненты используют только локальный generated-код, стили и внешний SVG-файл. Compiler и CLI не попадают в клиентское приложение, а `SpriteViewer` подключается отдельно только там, где нужна debug-страница.

## Документация

README знакомит с возможностями проекта и показывает основной сценарий использования. Для настройки выберите руководство под свой стек.

### Серверная генерация

- [Standalone + Server](docs/ru/guides/standalone-server.md)

### Быстрый старт для consumer modes

- [Bare standalone](docs/ru/guides/standalone.md)
- [Standalone + Vite](docs/ru/guides/standalone-vite.md)
- [Standalone + Webpack 5](docs/ru/guides/standalone-webpack.md)
- [React + Vite](docs/ru/guides/react-vite.md)
- [React + Webpack 5](docs/ru/guides/react-webpack.md)
- [Vue + Vite](docs/ru/guides/vue-vite.md)
- [Vue + Webpack](docs/ru/guides/vue-webpack.md)
- [Nuxt + Vite](docs/ru/guides/nuxt-vite.md)
- [Nuxt + Webpack](docs/ru/guides/nuxt-webpack.md)
- [Svelte + Vite](docs/ru/guides/svelte-vite.md)
- [Svelte + Webpack](docs/ru/guides/svelte-webpack.md)
- [SvelteKit + Vite](docs/ru/guides/sveltekit-vite.md)
- [Angular application builder](docs/ru/guides/angular-application.md)
- [Angular + Webpack](docs/ru/guides/angular-webpack.md)
- [Astro + Vite](docs/ru/guides/astro-vite.md)
- [Solid + Vite](docs/ru/guides/solid-vite.md)
- [Solid + Webpack](docs/ru/guides/solid-webpack.md)
- [SolidStart + Vite](docs/ru/guides/solid-start-vite.md)
- [Preact + Vite](docs/ru/guides/preact-vite.md)
- [Preact + Webpack](docs/ru/guides/preact-webpack.md)
- [Qwik + Vite](docs/ru/guides/qwik-vite.md)
- [Lit + Vite](docs/ru/guides/lit-vite.md)
- [Lit + Webpack](docs/ru/guides/lit-webpack.md)
- [Alpine.js + Vite](docs/ru/guides/alpine-vite.md)
- [Alpine.js + Webpack](docs/ru/guides/alpine-webpack.md)
- [Next.js App Router + Turbopack](docs/ru/guides/next-app-turbopack.md)
- [Next.js App Router + Webpack](docs/ru/guides/next-app-webpack.md)
- [Next.js Pages Router + Turbopack](docs/ru/guides/next-pages-turbopack.md)
- [Next.js Pages Router + Webpack](docs/ru/guides/next-pages-webpack.md)

### Технические материалы

- [Индекс документации](docs/ru/README.md)
- [Конфигурация](docs/ru/configuration.md)
- [Технический справочник](docs/ru/reference/technical.md)
- [Программный API](docs/ru/reference/programmatic-api.md)

## Лицензия

MIT
