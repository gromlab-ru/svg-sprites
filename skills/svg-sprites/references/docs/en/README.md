# Documentation

Choose one exact mode guide for setup. The guides are standalone documents and
can also be used unchanged by AI skills.

The common format for JSON, JavaScript, and TypeScript config files is described in the [configuration guide](configuration.md).

## Consumer Quick Starts

| Project | Exact mode | Guide |
|---|---|---|
| Static HTML or custom publishing | `standalone` | [Bare standalone](guides/standalone.md) |
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

Every consumer guide follows the same order:

1. Generate the sprite through `npx` without adding the package to the project.
2. Use the sprite in the application.
3. Optionally add the Viewer for debugging and previews.

## Server-Side Generation

Use [`standalone@server`](guides/standalone-server.md) to generate a universal SVG sprite on a server or in CI/CD for all consumer modes.

## Reference

- [Configuration](configuration.md)
- [Technical reference](reference/technical.md)
- [Programmatic API](reference/programmatic-api.md)
