# SVG Sprite for Next.js Pages Router with Webpack

A quick guide to creating an SVG sprite in a Next.js application using Pages Router and Webpack.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "next@pages/webpack",
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
    "dev": "next dev --webpack",
    "prebuild": "npm run sprites",
    "build": "next build --webpack"
  }
}
```

## Use the sprite

The value `name: "app"` creates the React component `AppIcon`.

Create the entry point `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Use the component on a page:

```tsx
// pages/index.tsx
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

The component works with SSR, SSG, and client-side navigation. Next.js automatically adds `sprite.svg` to the production build, so you do not need to move it to `public`.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Create the page `pages/svg-sprite.tsx`:

```tsx
import type { GetStaticProps } from 'next'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

export default function SvgSpritePage() {
  return <SpriteViewer sources={sources} title="Project icons" />
}

export const getStaticProps: GetStaticProps = () =>
  process.env.NODE_ENV === 'development'
    ? { props: {} }
    : { notFound: true }
```

Run `npm run dev` and open `/svg-sprite`. In production, the route returns 404.
