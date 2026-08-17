# SVG Sprite for Solid with Vite

A quick guide to creating an SVG sprite in a Solid application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "solid@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency. Run it through `npx` and regenerate before development and production builds:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && vite build"
  }
}
```

## Use the sprite

Create `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

The name `app` creates the Solid component `AppIcon`:

```tsx
import { AppIcon } from '../assets/app-icons'

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

Vite emits `sprite.svg` as a production asset. Monochrome icons inherit `color`; multicolor icons use `--icon-color-N`.

## Debug and preview

Viewer is optional and only needed during development:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Mount it from a debug component after the browser is ready:

```tsx
import { onMount } from 'solid-js'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'

export function IconViewer() {
  let host!: HTMLDivElement
  onMount(async () => {
    await import('@gromlab/svg-sprites/viewer/element')
    const viewer = document.createElement('gromlab-sprite-viewer') as SpriteViewerElement
    viewer.sources = [() => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js')]
    host.append(viewer)
  })
  return <div ref={host} />
}
```
