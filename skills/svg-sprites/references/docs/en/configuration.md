# Configuration

Each config file describes one independent sprite. The CLI does not discover config files automatically, so always pass the path explicitly:

```bash
npx --yes @gromlab/svg-sprites path/to/svg-sprite.config.json
```

## JSON

JSON works for most projects and does not require installing the package locally:

```json
{
  "mode": "next@app/turbopack",
  "name": "app",
  "description": "Shared application icons",
  "input": [
    "./icons",
    "../../assets/icons/**/*.svg",
    "!../../assets/icons/deprecated-*.svg"
  ],
  "transform": {
    "removeSize": true,
    "replaceColors": true,
    "addTransition": true
  },
  "generatedNotice": true
}
```

| Field | Default | Purpose |
|---|---|---|
| `mode` | None | Exact mode matching the framework and bundler |
| `source` | `local` | `local` for source SVG files or `remote` for a `standalone@server` manifest |
| `name` | Kebab-case module directory name; for `svg-sprite` and `svg-sprites`, the parent directory name | Sprite name; in modes with a component, it also determines the component and type names |
| `description` | None | Description used in types and the Viewer |
| `input` | `./icons` | Directory, SVG file, glob pattern, or array of sources |
| `transform` | All enabled | SVG preparation options |
| `generatedNotice` | `true` | Full or compact warning in generated files |

Paths and glob patterns in `input` are resolved relative to the config file's directory. A pattern prefixed with `!` excludes matches.

## Remotely built sprite

A consumer config for a server manifest only contains the mode, source, and input:

```json
{
  "mode": "react@vite",
  "source": "remote",
  "input": "https://assets.example/releases/app/svg-sprite.manifest.json"
}
```

`input` accepts one HTTP(S) URL or local manifest path. The name, description,
transforms, and generated notice come from the manifest. The generator downloads
and verifies the matching SVG profile before the adapter creates its normal local
components, types, and bundler asset.

## Server build

`standalone@server` combines local paths/globs with HTTP(S) SVG descriptors:

```js
export default {
  mode: 'standalone@server',
  name: 'app',
  input: [
    './icons/**/*.svg',
    {
      name: 'remote-logo',
      url: 'https://assets.example/logo.svg',
    },
  ],
}
```

The mode creates two content-addressed SVG profiles and `svg-sprite.manifest.json`.
`sha256` is optional for HTTP inputs; when present, it must be the expected 64-character
hexadecimal SHA-256 digest and the build verifies the received bytes.

## JavaScript

A JavaScript config default-exports a plain object:

```js
export default {
  mode: 'react@vite',
  name: 'icons',
  input: './icons',
}
```

Pass the path to the `.js` file to the CLI just like a JSON file:

```bash
npx --yes @gromlab/svg-sprites path/to/svg-sprite.config.js
```

## TypeScript

To type-check a TypeScript config, install the package as a development dependency:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Use `defineSpriteConfig`:

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'react@vite',
  name: 'icons',
  input: './icons',
})
```

Alternatively, use `satisfies` with a type-only import:

```ts
import type { SpriteConfig } from '@gromlab/svg-sprites'

export default {
  mode: 'react@vite',
  name: 'icons',
  input: './icons',
} satisfies SpriteConfig
```

The CLI loads `.ts` config files directly:

```bash
npx --yes @gromlab/svg-sprites path/to/svg-sprite.config.ts
```

For the complete list of modes, CLI flags, naming rules, and transform options, see the [technical reference](reference/technical.md).
