# SVG Sprite for Astro with Vite

A quick guide to creating an SVG sprite in an Astro application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "astro@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency. Generate the sprite through `npx` before development and production builds:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "astro dev",
    "prebuild": "npm run sprites",
    "build": "astro check && astro build"
  }
}
```

## Use the sprite

Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Create `assets/app-icons/index.d.ts` for the same typed API:

```ts
export * from './.svg-sprite/index.js'
```

The value `name: "app"` creates the native Astro component `AppIcon`. Use it in a page:

```astro
---
import { AppIcon } from '../../assets/app-icons/index.js'
---

<AppIcon
  icon="icon-name"
  width="24"
  height="24"
  role="img"
  aria-label="Done"
  style="color: #334155; --icon-color-2: #f59e0b"
/>
```

The `icon` prop is typed from source file names. Vite emits `sprite.svg` from the component's static asset import.

## Debug and preview

Viewer is optional and only needed during development:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Add the Viewer to the page and connect the generated manifest in a client script:

```astro
<gromlab-sprite-viewer id="sprite-viewer"></gromlab-sprite-viewer>

<script>
  import '@gromlab/svg-sprites/viewer/element'
  import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'

  const viewer = document.querySelector<SpriteViewerElement>('#sprite-viewer')!
  viewer.sources = [async () => {
    const { default: manifest } = await import(
      '../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'
    )
    const { usage: _usage, ...viewerManifest } = manifest
    return viewerManifest
  }]
</script>
```

The manifest retains Astro usage metadata while Viewer renders the same production sprite.
