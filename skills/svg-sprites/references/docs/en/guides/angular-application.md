# SVG Sprite for Angular with the Application Builder

A quick guide to creating an SVG sprite in an Angular application built with `@angular/build:application`.

## Generate the sprite

Choose a directory for the future SVG sprite, for example `assets/app-icons`, and create `svg-sprite.config.json` inside it. In `input`, specify the path to existing SVG files relative to the configuration file. There is no need to move or copy the icons.

```json
{
  "mode": "angular@application",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

The package does not need to be a project dependency. Run generation through `npx` before development and production builds:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "prestart": "npm run sprites",
    "start": "ng serve",
    "prebuild": "npm run sprites",
    "build": "ng build"
  }
}
```

The application builder emits imported SVG files when its file loader is enabled. Add this option to the build target in `angular.json`:

```json
{
  "builder": "@angular/build:application",
  "options": {
    "loader": { ".svg": "file" }
  }
}
```

## Use the sprite

Create `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index'
```

Import the generated standalone component. The value `name: "app"` creates `AppIcon` and the selector `app-icon`:

```ts
import { Component } from '@angular/core'
import { AppIcon } from '../assets/app-icons'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppIcon],
  template: `
    <app-icon
      icon="icon-name"
      role="img"
      aria-label="Done"
      style="width: 24px; height: 24px; color: #334155; --icon-color-2: #f59e0b"
    />
  `,
})
export class AppComponent {}
```

The `icon` input is typed from source file names. Monochrome icons inherit `color`; use `--icon-color-N` for individual colors.

## Debug and preview

Viewer is optional and only needed during development:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Import `@gromlab/svg-sprites/viewer/element`, add `CUSTOM_ELEMENTS_SCHEMA`, and place `<gromlab-sprite-viewer [sources]="viewerSources" />` in the template. Load the generated manifest while omitting framework-only usage metadata:

```ts
readonly viewerSources = [async () => {
  const { default: manifest } = await import(
    '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'
  )
  const { usage: _usage, ...viewerManifest } = manifest
  return viewerManifest
}]
```

The Viewer uses the same production sprite URL as `AppIcon`.
