# SVG Sprite for Next.js App Router with Turbopack

A quick guide to creating an SVG sprite in a Next.js application using App Router and Turbopack.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "next@app/turbopack",
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
    "dev": "next dev --turbopack",
    "prebuild": "npm run sprites",
    "build": "next build --turbopack"
  }
}
```

## Use the sprite

The value `name: "app"` creates the React component `AppIcon`.

Create the entry point `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Use the component in a Server Component:

```tsx
// app/page.tsx
import { AppIcon } from '../assets/app-icons'

export default function Page() {
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

`AppIcon` does not need `'use client'`. Turbopack automatically adds `sprite.svg` to the production build, so you do not need to move it to `public`.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Create the Client Component `app/svg-sprite/SvgSpriteViewer.tsx`:

```tsx
'use client'

import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

export function SvgSpriteViewer() {
  return <SpriteViewer sources={sources} title="Project icons" />
}
```

Create the route `app/svg-sprite/page.tsx`:

```tsx
import { notFound } from 'next/navigation'

import { SvgSpriteViewer } from './SvgSpriteViewer'

export default function SvgSpritePage() {
  if (process.env.NODE_ENV !== 'development') notFound()

  return <SvgSpriteViewer />
}
```

Run `npm run dev` and open `/svg-sprite`. In production, the route returns 404.
