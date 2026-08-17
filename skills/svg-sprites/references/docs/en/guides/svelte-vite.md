# SVG Sprite for Svelte with Vite

A quick guide to creating an SVG sprite in a Svelte application built with Vite.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

Example configuration:

```json
{
  "mode": "svelte@vite",
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

The value `name: "app"` creates the Svelte component `AppIcon`.

Create `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Use the component in your application:

```svelte
<script>
  import { AppIcon } from '../assets/app-icons/index.js'
</script>

<AppIcon
  icon="icon-name"
  width="24"
  height="24"
  role="img"
  aria-label="Done"
  style="color: #334155; --icon-color-2: #f59e0b"
/>
```

The `icon` prop accepts source SVG file names without the extension. A monochrome icon inherits `color`, while colors in a multicolor icon are overridden with `--icon-color-N`.

Vite automatically includes the component styles and emits `sprite.svg` as a separate production asset.

## Debug and preview

Viewer displays all icons on one page so you can check their rendering, change colors, and inspect the related CSS variables. It is only needed for development and is installed separately:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Add Viewer to a development-only Svelte page or component:

```svelte
<script>
  import '@gromlab/svg-sprites/viewer/element'

  const sources = [
    () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
  ]

  function connectViewer(node) {
    node.sources = sources
  }
</script>

<gromlab-sprite-viewer
  use:connectViewer
  viewer-title="Project icons"
></gromlab-sprite-viewer>
```

Run `npm run dev` and open the page containing Viewer. Do not import this development component from the production entry.
