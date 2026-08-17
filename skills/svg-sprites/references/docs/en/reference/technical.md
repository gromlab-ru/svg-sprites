# Technical reference

[Documentation index](../README.md)

[JSON, JavaScript, and TypeScript configuration](../configuration.md)

Reference for the configuration, generated API, and behavior of `@gromlab/svg-sprites`. For step-by-step setup instructions, see the guide for your stack:

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

## Requirements

- Node.js 18 or newer;
- the package is distributed as ESM and is loaded with `import`;
- React 18 or 19 is required only for React/Next generated components and `@gromlab/svg-sprites/react`;
- for typed package exports, use TypeScript 5+ with `moduleResolution: "bundler"`, `"node16"`, or `"nodenext"`.

Generation does not require a project dependency. Run the CLI through `npx`:

```bash
npx --yes @gromlab/svg-sprites path/to/svg-sprite.config.json
```

Install the package as a development dependency only when the project needs the
Viewer, config types, or the programmatic API:

```bash
npm install --save-dev @gromlab/svg-sprites
```

## CLI and generation modes

The CLI accepts exactly one path: an explicitly selected config file or a directory for config-less generation:

```text
svg-sprites [options] <config-file-or-directory>
```

| Environment | Mode |
|---|---|
| Static HTML / custom publishing | `standalone` |
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

The config file may have any name and use the `.ts`, `.js`, or `.json` extension. The CLI does not discover it by convention: pass the file explicitly. The recommended name is `svg-sprite.config.json`.

When a directory is passed, all settings come from CLI options. When a config file is passed, CLI options override the file. The full order is `defaults → config → CLI`.

`--help` and `-h` print usage information without requiring a path. Generation options are `--mode`, `--source <local|remote>`, `--name`, `--description`, repeatable `--input <path-or-glob>`, plus the `--remove-size`/`--no-remove-size`, `--replace-colors`/`--no-replace-colors`, `--add-transition`/`--no-add-transition`, and `--generated-notice`/`--no-generated-notice` pairs. Transform flags override individual fields, while supplying at least one `--input` replaces the complete config `input` value.

Quote CLI glob patterns with single quotes so the shell does not expand them before the generator receives them:

```bash
svg-sprites --input './icons/**/*.svg' --input '!./icons/legacy/**' svg-sprite.config.ts
```

The mode must match the application's publishing strategy. Bare `standalone` leaves the public URL to the application; Vite and Webpack modes generate bundler-specific SVG asset integration.

## Unified configuration

Each config file defines one independent sprite.

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'next@app/turbopack',
  name: 'app',
  description: 'Shared application icons',
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

| Option | Type | Default | Purpose |
|---|---|---|---|
| `mode` | `SpriteMode` | None | Generation mode; may be supplied by CLI/API |
| `source` | `local \| remote` | `local` | Source SVG files or a ready server manifest |
| `name` | `string` | Derived from the directory | Sprite name; in modes with a component, it also determines the component and public type names |
| `description` | `string` | None | Description for types and the debug manifest |
| `input` | `SpriteInput \| SpriteInput[]` | `./icons` | Local SVG sources, server HTTP descriptors, or one remote manifest, depending on mode and source |
| `transform` | `TransformOptions` | All enabled | SVG preparation settings |
| `generatedNotice` | `boolean` | `true` | Full or abbreviated warning in generated files |

With `source: 'remote'`, `input` contains one local path or HTTP(S) URL to a
manifest produced by `standalone@server`. A remote consumer config may contain
only `mode`, `source`, and `input`: the name, description, transforms, and generated
notice are verified and inherited from the server manifest. Generation downloads
the profile required by the exact consumer mode and verifies its SHA-256 and byte
length before codegen. There is no runtime network dependency on the server manifest.

### Sprite name

`name` is written in kebab-case and must start with an ASCII letter:

```text
app          → AppIcon
file-manager → FileManagerIcon
```

If `name` is omitted, the generator converts the directory name to kebab-case. For a directory named `svg-sprite` or `svg-sprites`, the parent directory's name is used.

### Icon sources

`SpriteConfig.input` is optional and has the type `string | string[]`. When it is omitted, the source is the literal `./icons` folder relative to the config directory. In config-less mode, relative paths start at the directory passed to the CLI or API.

Each positive string may be a literal folder, a literal `.svg` file, or a glob pattern. A literal folder includes only its immediate `*.svg` children. Use an explicit pattern such as `icons/**/*.svg` to traverse nested directories.

An array combines all positive sources. A pattern prefixed with `!` excludes its matches from the combined result globally, regardless of which positive source included them.

Supported glob syntax includes:

| Syntax | Meaning |
|---|---|
| `*` | Any characters within one path segment |
| `**` | Any number of nested directories |
| `?` | One character within a path segment |
| `{a,b}` | Either alternative |
| `[abc]` | One character from the set or range |
| `!pattern` | Exclude matches from the full combined input |

Every positive source or pattern must find at least one SVG, otherwise generation fails. Duplicate paths are removed and the final file list is sorted deterministically. Different SVG files with the same basename remain a conflict because the basename defines the public icon name.

### Server SVG inputs

`standalone@server` accepts the same local strings plus HTTP(S) descriptors in its
`input` array:

```ts
{
  name: 'brand-logo',
  url: 'https://assets.example.com/brand-logo.svg',
  sha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
}
```

`name` becomes the public icon name. `sha256` is optional and, when present, is
checked against the downloaded bytes. URL credentials and active SVG content such
as scripts, event handlers, `foreignObject`, or a doctype are rejected. One HTTP
source is limited to 2 MiB, all combined sources to 25 MiB, and requests time out
after 15 seconds. Local and HTTP entries share one namespace, so duplicate icon
names fail generation.

## Generated module

After generation, a React or Next.js sprite directory looks like this:

```text
app-icons/
├── .gitignore
├── svg-sprite.config.json
├── index.ts                         # optional user-owned barrel
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

| File | Purpose |
|---|---|
| `.svg-sprite/index.js` | Mode-specific production facade and runtime icon-name list |
| `.svg-sprite/index.d.ts` | Public declarations for the facade, component, and icon-name union |
| `.svg-sprite/svg-sprite.manifest.js` | Debug metadata and the asset URL for `SpriteViewer` |
| `.svg-sprite/sprite.svg` | Compiled SVG sprite |
| `.svg-sprite/react/react-component.js` | React component runtime without TypeScript or JSX |
| `.svg-sprite/react/react-component.d.ts` | React component props, style, and declaration |
| `.svg-sprite/react/react-component.module.css` | Styles for the React implementation |
| `.svg-sprite/icon-data.js` | Runtime icon-name list and internal IDs |
| `.svg-sprite/*.d.ts` | TypeScript declarations for the corresponding JavaScript modules |

Standalone contracts do not create `react/`. Bare `standalone` contains only the
runtime asset and deployment-neutral manifest data:

```text
.svg-sprite/
├── sprite.svg
└── svg-sprite.manifest.json
```

`standalone@vite` and `standalone@webpack` additionally create `index.*`,
`icon-data.*`, and a resolved `svg-sprite.manifest.*`. Their facade contains a
native generated Web Component with no external runtime dependencies. Bare
`standalone` intentionally does not generate a JavaScript component.

`standalone@server` creates a publishable release without JavaScript runtime or
`.gitignore`:

```text
.svg-sprite/
├── sprite.<content-hash>.svg
├── sprite-root-viewbox.<content-hash>.svg
└── svg-sprite.manifest.json
```

The manifest identifies both compile profiles by relative `href`, full SHA-256,
and byte length. Publish the complete directory atomically; consumers resolve each
profile relative to the manifest URL or local manifest path.

The generator fully manages `.svg-sprite` and replaces the whole directory on every generation through a staged write with rollback on replacement failure. Any files added inside it are deleted during the next generation. Keep user-owned files alongside it, for example in a root `index.ts` barrel:

```ts
export * from './.svg-sprite/index.js'
```

## Standalone Web Component and TypeScript

In `standalone@vite` and `standalone@webpack`, a sprite with `name: 'app'`
exports the `defineAppIconElement()` registration function and the `<app-icon>`
tag:

```ts
import { defineAppIconElement } from '@/ui/app-icons'

defineAppIconElement()
```

After registration, use the element in HTML:

```html
<app-icon icon="search" aria-hidden="true"></app-icon>

<app-icon
  icon="settings"
  role="img"
  aria-label="Settings"
></app-icon>
```

The component renders `<svg><use>` in an open Shadow DOM, selects the internal
ID and `viewBox`, and obtains the asset URL through the corresponding Vite or
Webpack mechanism. The host defaults to `1em × 1em`; set `class`, `style`,
`color`, and `--icon-color-N` with ordinary CSS.

The generated `HTMLElementTagNameMap` types the property API:

```ts
const icon = document.createElement('app-icon')

icon.icon = 'search'
icon.icon = 'unknown' // TypeScript error
```

TypeScript does not validate attribute values in plain HTML. Therefore an
unknown `icon="unknown"` is also validated at runtime: the component hides its
inner SVG and reports an error instead of creating a `#undefined` fragment.
Calling `defineAppIconElement()` repeatedly is safe for the same sprite; a
different element already registered as `<app-icon>` causes an error.

## React component and TypeScript

A sprite with `name: 'app'` exports:

```ts
export { AppIcon, appIconNames }
export type { AppIconName, AppIconProps, AppIconStyle }
```

### Icon names

SVG file names become valid `icon` values:

```tsx
<AppIcon icon="search" />
<AppIcon icon="unknown" /> // TypeScript error
```

The runtime list contains the same values:

```ts
import { appIconNames } from '@/ui/app-icons'

// readonly ['search', 'settings', 'user']
```

Names containing spaces or other characters that are unsafe in SVG IDs remain part of the public API. For the internal fragment ID, the generator creates a stable, safe hash:

```text
folder open.svg → icon="folder open" → id="icon-<stable-hash>"
```

For these names, use the generated component or the `id` from the debug manifest instead of constructing the fragment ID manually.

### SVG attributes

By default, the component renders an `<svg>` and accepts standard SVG attributes:

```tsx
<AppIcon
  icon="search"
  width={24}
  height={24}
  color="rebeccapurple"
  className="searchIcon"
  aria-label="Search"
/>
```

The component does not add accessibility semantics automatically. Pass appropriate `aria-*` attributes, a `role`, or a label based on the icon's purpose.

### Wrapper

`wrapped` renders a `<span>` containing the SVG. In this mode, the remaining props apply to the `<span>`:

```tsx
<AppIcon icon="search" wrapped className="iconWrapper" />
```

### Typed CSS custom properties

`AppIconStyle` extends `CSSProperties` and supports properties in the form `--icon-color-N`:

```tsx
<AppIcon
  icon="user"
  style={{
    '--icon-color-1': '#2563eb',
    '--icon-color-2': '#dbeafe',
  }}
/>
```

## Multiple sprites

Each directory with a configuration creates an independent mode-specific contract. Framework modes generate their native component and declarations, standalone bundler modes generate a Web Component and declarations, and bare `standalone` generates an SVG and JSON manifest:

```text
app-icons       → AppIcon       → shared icons
analytics-icons → AnalyticsIcon → analytics page icons
editor-icons    → EditorIcon    → editor icons
```

The same source SVG can be added to multiple configurations through `input`. You do not need to copy the file into each sprite directory.

For multiple sprites, add a separate CLI command for each directory or combine the commands in a shared npm script.

## Formats and rendering methods

All current modes generate the `stack` format.

| Format | `<svg><use>` | `<img>` | CSS background |
|---|---:|---:|---:|
| `stack` | Yes | Yes | Yes |

### Generated component

Use the generated native component documented by the selected exact-mode guide. It knows the internal IDs, constructs the URL, and provides a TypeScript API. React and Next.js use it like this:

```tsx
<AppIcon icon="search" width={24} height={24} />
```

For `standalone@vite` and `standalone@webpack`, use the generated Web Component:

```html
<app-icon icon="search" style="font-size: 24px"></app-icon>
```

### Manually with `<svg><use>`

How you obtain `spriteUrl` depends on the bundler.

Static HTML after the application publishes `.svg-sprite/sprite.svg`:

```html
<svg aria-hidden="true">
  <use href="/assets/icons.svg#search"></use>
</svg>
```

Standalone Vite/Webpack provides generated `getAppIconHref()` and an internal ID
map. Do not construct fragments from unsafe file names manually.

Vite:

```ts
import spriteUrl from './.svg-sprite/sprite.svg?no-inline'
```

Webpack 5, Turbopack, and Next.js:

```ts
const spriteUrl = new URL('./.svg-sprite/sprite.svg', import.meta.url).href
```

After obtaining the URL, use it in JSX:

```tsx
<svg width="24" height="24" aria-label="Search">
  <use href={`${spriteUrl}#search`} />
</svg>
```

For names that are unsafe as SVG IDs, use the internal `id` from the manifest.

### With `<img>`

```tsx
<img src={`${spriteUrl}#search`} width={24} height={24} alt="Search" />
```

An SVG inside `<img>` is isolated from the page's CSS. Setting `color` or `--icon-color-N` on the outer element does not change its internal colors.

### With CSS

```css
.icon {
  background: url('./.svg-sprite/sprite.svg#search') center / contain no-repeat;
}
```

For a single-color silhouette, you can use a mask:

```css
.icon {
  background-color: currentColor;
  mask: url('./.svg-sprite/sprite.svg#search') center / contain no-repeat;
}
```

A mask does not preserve original colors, gradients, or differences between `fill` and `stroke`.

The path in CSS is resolved relative to the CSS file itself. In these examples, the CSS file is next to `svg-sprite.config.ts`.

## Assets and caching

The generated component or standalone facade passes the SVG to the bundler as a separate asset:

- Vite uses a static import with `?no-inline`;
- Webpack 5, Turbopack, and Next.js use `new URL(..., import.meta.url)`;
- SVG path data is not serialized into generated JavaScript.

Bare `standalone` does not participate in an asset pipeline: the application copies
or publishes `sprite.svg` and owns its URL, versioning, and cache policy.

With standard asset naming, the bundler adds a content hash:

```text
/assets/sprite-<hash>.svg
```

This allows the SVG to be cached separately from JavaScript. Changing React code does not change the sprite contents, while changing icons creates a new asset version.

HTTP cache headers, CDN behavior, and `Cache-Control` are configured by the application or hosting platform. With Webpack, the final file name depends on the project's `assetModuleFilename`.

## SVG transformations

All transformations are enabled by default and can be configured independently:

| Option | Behavior |
|---|---|
| `removeSize` | Removes `width` and `height` from the root `<svg>` while preserving an existing `viewBox` |
| `replaceColors` | Replaces detected `fill` and `stroke` values with `--icon-color-N` |
| `addTransition` | Adds transitions for `fill` and `stroke` to colored elements and generated styles |

To disable an individual operation:

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

Source SVG files are not modified. Transformations apply only to the generated sprite contents.

## Color management

### Monochrome icons

If one color is detected, its fallback becomes `currentColor`:

```svg
stroke="var(--icon-color-1, currentColor)"
```

Set the color through a prop or CSS:

```tsx
<AppIcon icon="search" color="rebeccapurple" />
```

### Multicolor icons

Each unique color gets its own custom property with the original color as its fallback:

```svg
fill="var(--icon-color-1, #798198)"
fill="var(--icon-color-2, #ffffff)"
fill="var(--icon-color-3, #129d9d)"
```

You can override only the values you need:

```css
.icon {
  --icon-color-1: #4b5563;
  --icon-color-3: #14b8a6;
}
```

### Limitations

- `none`, `transparent`, `inherit`, `unset`, and `initial` are not replaced;
- colors in `fill`, `stroke`, and inline `style` attributes are handled most reliably;
- CSS classes and external stylesheets inside the SVG are not the primary transformation use case;
- `url(#...)` values may be replaced along with colors, so gradients and patterns require a separate sprite with `replaceColors: false`;
- masks, filters, and complex internal CSS rules require visual verification;
- page CSS custom properties are available through `<svg><use>`, but not inside `<img>` or a CSS background.

For a complex icon, you can disable `replaceColors` in a separate sprite configuration.

## SpriteViewer

The Viewer uses one Shadow DOM Web Component for every mode. React and future framework components are bridges to that same element, so the visuals and behavior are not duplicated.

Bare `standalone` loads the self-contained browser bundle and supplies the JSON manifest URL and the published SVG URL:

```html
<script
  type="module"
  src="https://unpkg.com/@gromlab/svg-sprites@<version>/dist/viewer-element.js"
></script>

<gromlab-sprite-viewer
  viewer-title="Project icons"
  manifest-url="/app-icons/manifest.json"
  sprite-url="/app-icons/sprite.svg"
></gromlab-sprite-viewer>
```

`viewer-element.js` has no additional runtime files and can be copied with the other static assets for self-hosting.

`standalone@vite` and `standalone@webpack` register the same element through an npm entry and pass the generated JS manifest through the `sources` property:

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
import spriteManifest from './svg-sprite/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.querySelector<SpriteViewerElement>('gromlab-sprite-viewer')!
viewer.sources = [spriteManifest]
```

React and Next.js keep the component API:

```tsx
import { SpriteViewer } from '@gromlab/svg-sprites/react'
```

It accepts ready-made manifests, remote standalone sources, an array of lazy loaders, or a record in the format returned by `import.meta.glob`.

Vite:

```tsx
import { SpriteViewer } from '@gromlab/svg-sprites/react'
import type { SpriteManifestModule } from '@gromlab/svg-sprites/react'

const sources = import.meta.glob<SpriteManifestModule>(
  '/src/**/svg-sprite/.svg-sprite/svg-sprite.manifest.js',
)

export const IconsDebugPage = () => (
  <SpriteViewer sources={sources} title="Project icons" />
)
```

Webpack and Next.js:

```tsx
const sources = [
  () => import('@/ui/app-icons/.svg-sprite/svg-sprite.manifest.js'),
  () => import('@/features/analytics/icons/.svg-sprite/svg-sprite.manifest.js'),
]

export const IconsDebugPage = () => (
  <SpriteViewer sources={sources} />
)
```

The Viewer displays groups, search, `viewBox`, CSS custom properties, and fallback colors. Framework manifests get their framework-specific tab plus SVG, IMG, and CSS; standalone manifests get SVG, IMG, and CSS. You can change color values in the interface and immediately inspect the result.

### Viewer theme

By default, `colorTheme="auto"` follows `prefers-color-scheme`. You can explicitly pass `light` or `dark`:

```tsx
<SpriteViewer sources={sources} colorTheme="dark" />
```

To synchronize it with the application theme:

```tsx
<SpriteViewer
  sources={sources}
  colorTheme={appTheme}
  onColorThemeChange={setAppTheme}
/>
```

`@gromlab/svg-sprites/react` contains `'use client'` and renders the Web Component host; its internal Shadow DOM is created after the browser runtime loads. In the Next.js App Router, place the Viewer inside a separate Client Component boundary and use it only on a debug route or in an internal tool.

## Generated files, Git, and CI

Every mode except bare `standalone` creates a local `.gitignore` for:

```text
/.svg-sprite/
```

Commit the local `.gitignore` to the repository once. It excludes the other generated files, so generation must run before commands that import the sprite module:

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

CI must run generation before building or type-checking. Pin `@gromlab/svg-sprites` to an exact version when the CI toolchain must be reproducible. A local package installation is not required unless CI also uses the Viewer, package config types, or the programmatic API.

Bare `standalone` does not create a `.gitignore` and preserves a user-owned file. If a managed `.gitignore` remains after another mode, bare mode removes it. In every other mode, the generator refuses to overwrite a user-owned `.gitignore` without a generated marker. The root `index.ts` remains user-owned and may re-export the generated API.

## Troubleshooting

- In every mode except bare `standalone`, missing `.svg-sprite/index.js`: run the generation script before importing the generated module.
- Source not found: pass an existing config file or sprite module directory.
- Mode missing: add `mode` to the config or pass `--mode`.
- Icon missing from the type: check `input`, the `.svg` extension, glob exclusions, and whether nested folders require `**/*.svg`.
- Name conflict: two different SVG files have the same basename; rename one of them.
- `Refusing to overwrite a user file`: the sprite module root contains a user-owned `.gitignore` that the generator cannot replace.
- The icon does not change color: use `<svg><use>` or the generated component and check `replaceColors`.
- Webpack emits an incorrect URL: check Asset Modules, `output.publicPath`, and SVG loaders.
- Static sprite returns 404: check the post-generation copy or server alias, and do not put a filesystem `spritePath` into HTML.
- The Viewer cannot find the sprite: in bundler modes, check the path to `.svg-sprite/svg-sprite.manifest.js`; for bare `standalone`, check the published `svg-sprite.manifest.json` and `sprite.svg` URLs. Run generation before starting the application.
- Build and mode do not match: use the target that corresponds to the actual bundler.

For custom orchestration and low-level compilation, see the [Programmatic API](programmatic-api.md).
