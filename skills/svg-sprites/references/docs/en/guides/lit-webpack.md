# SVG Sprite for Lit with Webpack 5

A quick guide to creating an SVG sprite in a Lit application built with Webpack 5.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "lit@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The generator does not need to be added to the application dependencies: run it through `npx`.

Add generation before development and production builds:

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

The value `name: "app"` creates the Lit class `AppIcon`, the `<app-icon>` tag, and the `defineAppIcon` registration function.

Generated Lit CSS is imported with the `?inline` query. Add an Asset Module rule to `webpack.config.js`:

```js
export default {
  module: {
    rules: [
      {
        test: /\.css$/,
        resourceQuery: /inline/,
        type: 'asset/source',
      },
    ],
  },
}
```

Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Register the component before rendering it:

```js
import { defineAppIcon } from '../assets/app-icons/index.js'

defineAppIcon()

document.querySelector('#app').innerHTML = `
  <app-icon
    icon="icon-name"
    role="img"
    aria-label="Done"
    style="width:24px;height:24px;color:#334155;--icon-color-2:#f59e0b"
  ></app-icon>
`
```

The `icon` property accepts source SVG file names without the extension. A monochrome icon inherits `color`; override multicolor icon layers with `--icon-color-N`. Webpack 5 emits `sprite.svg` as a separate production asset.

## Debug and preview

Viewer displays all icons on one page and is only needed during development. Install it separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Add Viewer to a development entry:

```js
import '@gromlab/svg-sprites/viewer/element'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.createElement('gromlab-sprite-viewer')
viewer.viewerTitle = 'Project icons'
viewer.sources = [spriteManifest]
document.body.append(viewer)
```

Include this entry only in development. Viewer is not required by `AppIcon`.
