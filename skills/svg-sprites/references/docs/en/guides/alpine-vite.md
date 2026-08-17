# SVG Sprite for Alpine.js with Vite

A quick guide to creating an SVG sprite in an Alpine.js application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "alpine@vite",
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
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "vite build"
  }
}
```

## Use the sprite

The value `name: "app"` creates the Alpine plugin `appAlpinePlugin`, the `x-app-icon` directive, and the `$appIconHref` magic.

Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Register the generated plugin before starting Alpine:

```js
import Alpine from 'alpinejs'
import { appAlpinePlugin } from '../assets/app-icons/index.js'

Alpine.plugin(appAlpinePlugin)
Alpine.start()
```

Use the reactive directive on an SVG element:

```html
<svg
  x-data="{ iconName: 'icon-name' }"
  x-app-icon="iconName"
  role="img"
  aria-label="Done"
  style="width:24px;height:24px;color:#334155;--icon-color-2:#f59e0b"
></svg>
```

The directive expression resolves to a source SVG file name without the extension. A monochrome icon inherits `color`; override multicolor icon layers with `--icon-color-N`. Vite loads the generated CSS and emits `sprite.svg` as a separate production asset.

## Debug and preview

Viewer displays all icons on one page and is only needed during development. Install it separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Add Viewer to a development page:

```html
<gromlab-sprite-viewer viewer-title="Project icons"></gromlab-sprite-viewer>
<script type="module" src="/src/svg-sprite-debug.js"></script>
```

Create `src/svg-sprite-debug.js`:

```js
import '@gromlab/svg-sprites/viewer/element'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

document.querySelector('gromlab-sprite-viewer').sources = [spriteManifest]
```

Run `npm run dev` and open the development page. Viewer is independent from the Alpine plugin.
