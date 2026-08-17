# SVG Sprite for React with Webpack 5

A quick guide to creating an SVG sprite in a React application built with Webpack 5.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "react@webpack",
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
    "dev": "webpack serve --mode development",
    "prebuild": "npm run sprites",
    "build": "webpack --mode production"
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

The component uses CSS Modules. If the project does not process them yet, install the loaders:

```bash
npm install --save-dev style-loader css-loader
```

Then add a rule with a default export to `webpack.config.js`:

```js
{
  test: /\.module\.css$/i,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: { namedExport: false } },
    },
  ],
}
```

Webpack 5 automatically adds `sprite.svg` to the production build.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development.

Install Viewer:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Create the entry `src/svg-sprite-debug.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

const container = document.createElement('div')
document.body.append(container)

createRoot(container).render(
  <SpriteViewer sources={sources} title="Project icons" />,
)
```

Add the script to the main entry only in development mode. Keep the rest of your `webpack.config.js` settings:

```js
export default (_env, argv) => ({
  // Other Webpack settings.
  entry: [
    './src/main.tsx',
    ...(argv.mode === 'development' ? ['./src/svg-sprite-debug.tsx'] : []),
  ],
})
```

Run `npm run dev`. Viewer appears on the application's main page and is not included in the production build.
