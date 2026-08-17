# SVG Sprite for Vue with Webpack 5

A quick guide to creating an SVG sprite in a Vue application built with Webpack 5.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "vue@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency: generation runs through `npx`.

Add generation commands to `package.json`. Generated files are excluded from Git by default, so `predev` and `prebuild` rebuild the sprite before every start and build:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "webpack serve --mode development",
    "prebuild": "npm run sprites",
    "build": "webpack --mode production"
  }
}
```

## Use the sprite

The value `name: "app"` creates the Vue component `AppIcon`. Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Use the component in your application:

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

The `icon` prop accepts source SVG file names without the extension. A monochrome icon inherits `color`, while colors in a multicolor icon are overridden with `--icon-color-N`.

The component uses CSS Modules. If the project does not process them yet, install `style-loader` and `css-loader`, then add a rule with a default export:

```bash
npm install --save-dev style-loader css-loader
```

```js
{
  test: /\.module\.css$/i,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: { namedExport: false } },
    },
  ],
}
```

Webpack 5 automatically adds `sprite.svg` to the production build.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Add Viewer to a development-only Vue component:

```vue
<script setup>
import '@gromlab/svg-sprites/viewer/element'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
]
</script>

<template>
  <gromlab-sprite-viewer
    :sources="sources"
    viewer-title="Project icons"
  />
</template>
```

Configure Vue Loader to treat `gromlab-sprite-viewer` as a custom element:

```js
{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'gromlab-sprite-viewer',
    },
  },
}
```

Render the Viewer component on your development page. Viewer is not required by `AppIcon`.
