# SVG Sprite for a Site Without a Bundler

Combine SVG icons into one file and use them on an HTML page.

## Generate the sprite

You do not need to install the package in your project.

### 1. Create the sprite config

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "standalone",
  "name": "icons",
  "input": "../svg-icons/**/*.svg"
}
```

### 2. Generate the sprite

Pass the config path to the command:

```bash
npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json
```

The package collects the icons in a `.svg-sprite` directory next to the config:

```text
assets/app-icons/.svg-sprite/
├── sprite.svg
└── svg-sprite.manifest.json
```

- `sprite.svg` is the finished sprite for use on the site.
- `svg-sprite.manifest.json` contains icon data for Viewer.

The `.svg-sprite` directory is created automatically and fully replaced on every generation. Do not edit its contents manually.

### 3. Use an icon

In `index.html`, point to the generated `sprite.svg`. After `#`, add the icon file name without the `.svg` extension:

```html
<svg
  width="24"
  height="24"
  aria-label="Done"
>
  <use href="./assets/app-icons/.svg-sprite/sprite.svg#icon-name"></use>
</svg>
```

## Debug and preview

`sprite.svg` is a technical file, not an icon gallery. Opening it does not provide a convenient view of the whole set. Gradients, masks, filters, and references to internal `id` values may also render with artifacts.

Use the official Viewer for visual checks. It displays every icon in the sprite and helps you verify its colors and rendering.

Viewer is optional and intended only for development. You do not need to install the package through npm.

Viewer works directly with files from `.svg-sprite`. Nothing needs to be copied.

### Add Viewer to the page

Add a module script to `index.html` and provide paths to the generated manifest and sprite:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@gromlab/svg-sprites/dist/viewer-element.js"
></script>

<gromlab-sprite-viewer
  viewer-title="Project icons"
  manifest-url="./assets/app-icons/.svg-sprite/svg-sprite.manifest.json"
  sprite-url="./assets/app-icons/.svg-sprite/sprite.svg"
></gromlab-sprite-viewer>
```

You can move Viewer to a separate HTML file in the site root used only for development and icon checks.
