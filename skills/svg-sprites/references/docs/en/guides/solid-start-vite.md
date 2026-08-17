# SVG Sprite for SolidStart with Vite

A quick guide to creating an SVG sprite in an SSR SolidStart application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "solid-start@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency. Regenerate through `npx` before Vinxi starts or builds:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vinxi dev",
    "prebuild": "npm run sprites",
    "build": "vinxi build"
  }
}
```

## Use the sprite

Create `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

The generated component is safe to render on the server:

```tsx
import { AppIcon } from '../assets/app-icons'

export default function Home() {
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

The component uses a static Vite asset import and does not access browser globals during SSR.

## Debug and preview

Viewer is browser-only, optional development tooling:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Load it from `onMount` so it is excluded from server rendering:

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
