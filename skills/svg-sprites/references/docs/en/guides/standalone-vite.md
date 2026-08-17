# SVG Sprite for Vite Without a Framework

A quick guide to creating an SVG sprite in a Vite application without a framework.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "standalone@vite",
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
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "vite build"
  }
}
```

## Use the sprite

The value `name: "app"` creates the `<app-icon>` element.

Create the entry point `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Register the element in `src/main.ts`:

```ts
import { defineAppIconElement } from '../assets/app-icons'
import './style.css'

defineAppIconElement()
```

Use the icon in HTML:

```html
<app-icon icon="icon-name" role="img" aria-label="Done"></app-icon>
```

The `icon` value is the source SVG filename without the extension. Set its size and colors with CSS:

```css
app-icon {
  font-size: 24px;
  color: #334155;
  --icon-color-2: #f59e0b;
}
```

A monochrome icon inherits `color`, while colors in a multicolor icon are overridden with `--icon-color-N`. Viewer shows the variables you need.

Vite automatically adds `sprite.svg` to the production build. You do not need to copy it to `public`.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Create `svg-sprite.html` in the project root:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Project icons</title>
  </head>
  <body>
    <!-- Viewer component for debugging and previewing the SVG sprite -->
    <gromlab-sprite-viewer viewer-title="Project icons"></gromlab-sprite-viewer>

    <!-- Load the debug script created below -->
    <script type="module" src="/src/svg-sprite-debug.ts"></script>
  </body>
</html>
```

Create `src/svg-sprite-debug.ts`:

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.querySelector<SpriteViewerElement>('gromlab-sprite-viewer')!
viewer.sources = [spriteManifest]
```

Run `npm run dev` and open `/svg-sprite.html`.

Viewer is not required for `<app-icon>` and is not imported by the application's main code.
