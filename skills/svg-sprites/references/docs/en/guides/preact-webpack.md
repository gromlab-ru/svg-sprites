# SVG Sprite for Preact with Webpack

A quick guide to creating an SVG sprite in a Preact application built with Webpack 5.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "preact@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency. Run it through `npx` before Webpack starts or builds:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "webpack serve --mode development",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && webpack --mode production"
  }
}
```

## Use the sprite

Create `assets/app-icons/index.js` and `assets/app-icons/index.d.ts` with the same export:

```js
export * from './.svg-sprite/index.js'
```

Use the generated Preact component:

```jsx
import { AppIcon } from '../assets/app-icons/index.js'

export function SaveIcon() {
  return (
    <AppIcon
      icon="icon-name"
      width={24}
      height={24}
      aria-label="Done"
      style={{ color: '#334155', '--icon-color-2': '#f59e0b' }}
    />
  )
}
```

Webpack Asset Modules emit `sprite.svg` from the generated `new URL(...)` expression.

## Debug and preview

Install Viewer only for development:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Mount it from a development-only entry:

```js
import '@gromlab/svg-sprites/viewer/element'

const viewer = document.createElement('gromlab-sprite-viewer')
viewer.sources = [() => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js')]
document.body.append(viewer)
```
