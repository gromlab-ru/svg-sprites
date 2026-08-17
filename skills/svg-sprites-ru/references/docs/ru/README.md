# Документация

Для настройки выберите guide одного exact mode. Каждый guide является
самостоятельным документом и без изменений используется в AI skills.

Общий формат JSON, JavaScript и TypeScript config-файлов описан в [руководстве по конфигурации](configuration.md).

## Быстрый старт для consumer modes

| Проект | Exact mode | Guide |
|---|---|---|
| Static HTML или собственная публикация | `standalone` | [Bare standalone](guides/standalone.md) |
| Vanilla + Vite | `standalone@vite` | [Standalone + Vite](guides/standalone-vite.md) |
| Vanilla + Webpack 5 | `standalone@webpack` | [Standalone + Webpack](guides/standalone-webpack.md) |
| React + Vite | `react@vite` | [React + Vite](guides/react-vite.md) |
| React + Webpack 5 | `react@webpack` | [React + Webpack](guides/react-webpack.md) |
| Vue + Vite | `vue@vite` | [Vue + Vite](guides/vue-vite.md) |
| Vue + Webpack | `vue@webpack` | [Vue + Webpack](guides/vue-webpack.md) |
| Nuxt + Vite | `nuxt@vite` | [Nuxt + Vite](guides/nuxt-vite.md) |
| Nuxt + Webpack | `nuxt@webpack` | [Nuxt + Webpack](guides/nuxt-webpack.md) |
| Svelte + Vite | `svelte@vite` | [Svelte + Vite](guides/svelte-vite.md) |
| Svelte + Webpack | `svelte@webpack` | [Svelte + Webpack](guides/svelte-webpack.md) |
| SvelteKit + Vite | `sveltekit@vite` | [SvelteKit + Vite](guides/sveltekit-vite.md) |
| Angular application builder | `angular@application` | [Angular application builder](guides/angular-application.md) |
| Angular + Webpack | `angular@webpack` | [Angular + Webpack](guides/angular-webpack.md) |
| Astro + Vite | `astro@vite` | [Astro + Vite](guides/astro-vite.md) |
| Solid + Vite | `solid@vite` | [Solid + Vite](guides/solid-vite.md) |
| Solid + Webpack | `solid@webpack` | [Solid + Webpack](guides/solid-webpack.md) |
| SolidStart + Vite | `solid-start@vite` | [SolidStart + Vite](guides/solid-start-vite.md) |
| Preact + Vite | `preact@vite` | [Preact + Vite](guides/preact-vite.md) |
| Preact + Webpack | `preact@webpack` | [Preact + Webpack](guides/preact-webpack.md) |
| Qwik + Vite | `qwik@vite` | [Qwik + Vite](guides/qwik-vite.md) |
| Lit + Vite | `lit@vite` | [Lit + Vite](guides/lit-vite.md) |
| Lit + Webpack | `lit@webpack` | [Lit + Webpack](guides/lit-webpack.md) |
| Alpine.js + Vite | `alpine@vite` | [Alpine.js + Vite](guides/alpine-vite.md) |
| Alpine.js + Webpack | `alpine@webpack` | [Alpine.js + Webpack](guides/alpine-webpack.md) |
| Next.js App Router + Turbopack | `next@app/turbopack` | [App Router + Turbopack](guides/next-app-turbopack.md) |
| Next.js App Router + Webpack | `next@app/webpack` | [App Router + Webpack](guides/next-app-webpack.md) |
| Next.js Pages Router + Turbopack | `next@pages/turbopack` | [Pages Router + Turbopack](guides/next-pages-turbopack.md) |
| Next.js Pages Router + Webpack | `next@pages/webpack` | [Pages Router + Webpack](guides/next-pages-webpack.md) |

Все consumer guides используют один порядок:

1. Генерация спрайта через `npx` без добавления package в проект.
2. Использование спрайта в приложении.
3. Необязательное подключение Viewer для дебага и превью.

## Серверная генерация

Используйте [`standalone@server`](guides/standalone-server.md), чтобы сгенерировать на сервере или в CI/CD универсальный SVG-спрайт для всех consumer modes.

## Справочники

- [Конфигурация](configuration.md)
- [Технический справочник](reference/technical.md)
- [Программный API](reference/programmatic-api.md)
