# SVG Sprite for Nuxt with Vite

A quick guide to creating an SVG sprite in a Nuxt application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "nuxt@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency: generation runs through `npx`.

Add generation commands to `package.json`:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "nuxt dev",
    "prebuild": "npm run sprites",
    "build": "nuxt build"
  }
}
```

## Use the sprite

The value `name: "app"` creates the Vue component `AppIcon`. Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Use the component in a Nuxt page or layout:

```vue
<script setup>
import { AppIcon } from '../assets/app-icons/index.js'
</script>

<template>
  <AppIcon
    icon="icon-name"
    width="24"
    height="24"
    role="img"
    aria-label="Done"
    style="color: #334155; --icon-color-2: #f59e0b"
  />
</template>
```

`AppIcon` is SSR-safe and does not need a client-only wrapper. Vite emits `sprite.svg` as a separate production asset.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Create `app/components/SvgSpriteViewer.client.vue` so the browser-only Viewer is not evaluated during SSR:

```vue
<script setup>
import '@gromlab/svg-sprites/viewer/element'

const sources = [
  () => import('../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
]
</script>

<template>
  <gromlab-sprite-viewer :sources="sources" viewer-title="Project icons" />
</template>
```

Mark `gromlab-sprite-viewer` as a custom element in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'gromlab-sprite-viewer',
    },
  },
})
```

Render `<SvgSpriteViewer />` on your development page. Viewer is isolated from the generated `AppIcon` runtime.
