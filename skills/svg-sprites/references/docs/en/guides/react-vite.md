# SVG Sprite for React with Vite

A quick guide to creating an SVG sprite in a React application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "react@vite",
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
    "build": "tsc --noEmit && vite build"
  }
}
```

## Use the sprite

The value `name: "app"` creates the React component `AppIcon`.

Create the entry point `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Use the component in your application:

```tsx
import { AppIcon } from '../assets/app-icons'

export function SaveIcon() {
  return (
    <AppIcon
      icon="icon-name"
      width={24}
      height={24}
      role="img"
      aria-label="Done"
      style={{
        color: '#334155',
        '--icon-color-2': '#f59e0b',
      }}
    />
  )
}
```

The `icon` prop accepts source SVG file names without the extension. A monochrome icon inherits `color`, while colors in a multicolor icon are overridden with `--icon-color-N`.

Vite automatically includes the component styles and adds `sprite.svg` to the production build.

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
    <!-- React root for debugging and previewing the SVG sprite in Viewer -->
    <div id="svg-sprite-viewer"></div>

    <!-- Load the debug script created below -->
    <script type="module" src="/src/svg-sprite-debug.tsx"></script>
  </body>
</html>
```

Create `src/svg-sprite-debug.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

createRoot(document.getElementById('svg-sprite-viewer')!).render(
  <SpriteViewer sources={sources} title="Project icons" />,
)
```

Run `npm run dev` and open `/svg-sprite.html`.

The standard Vite production build uses only `index.html` and does not include the Viewer page.
