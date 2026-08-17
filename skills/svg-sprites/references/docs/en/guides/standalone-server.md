# Universal SVG Sprite Generated on a Server

Generate a universal SVG sprite in CI or a server worker for applications that use different frameworks and bundlers.

## Generate the sprite

You do not need to install the package in the worker.

### 1. Prepare the workspace

Place the source SVGs in the current workspace's `icons` directory:

```text
.
└── icons/
    ├── search.svg
    └── settings.svg
```

Each filename without the extension becomes an icon name.

### 2. Run generation

Pass the mode, sprite name, and SVG path through the CLI:

```bash
npx --yes @gromlab/svg-sprites \
  --mode standalone@server \
  --name app \
  --input './icons/**/*.svg' \
  .
```

This worker workflow does not need a config file. The result appears in `./.svg-sprite`:

```text
.
├── icons/
│   ├── search.svg
│   └── settings.svg
└── .svg-sprite/
    ├── sprite.<content-hash>.svg
    ├── sprite-root-viewbox.<content-hash>.svg
    └── svg-sprite.manifest.json
```

### 3. Publish the result

Upload the contents of `.svg-sprite` to a dedicated S3 bucket directory:

```bash
aws s3 sync ./.svg-sprite/ s3://my-bucket/app-icons/
```

The same directory can be served through a CDN. The public URL does not contain a `.svg-sprite` segment:

```text
https://cdn.example.com/app-icons/
├── sprite.<content-hash>.svg
├── sprite-root-viewbox.<content-hash>.svg
└── svg-sprite.manifest.json
```

You can also run `standalone@server` through a JSON, JavaScript, or TypeScript config. A config is useful for persistent settings, local SVGs from several directories, and SVGs loaded over HTTP(S).

## Use the sprite

Create a regular config in the consumer application. For example, with React and Vite:

```text
src/app-icons/
├── index.ts
└── svg-sprite.config.json
```

Set the consumer mode and the CDN manifest URL:

```json
{
  "mode": "react@vite",
  "source": "remote",
  "input": "https://cdn.example.com/app-icons/svg-sprite.manifest.json"
}
```

Add a user-owned entry point:

```ts
// src/app-icons/index.ts
export * from './.svg-sprite/index.js'
```

Run normal generation:

```bash
npx --yes @gromlab/svg-sprites src/app-icons/svg-sprite.config.json
```

Then use the generated component exactly as with a sprite built from local SVGs:

```tsx
import { AppIcon } from './app-icons'

export function SearchButton() {
  return <AppIcon icon="search" aria-label="Search" />
}
```

The same CDN manifest works with all 29 consumer modes. Each one preserves the native API of its selected framework and bundler.

## Debug and preview

`standalone@server` does not create a separate icon preview page. Connect the published sprite to a consumer application and open it in SpriteViewer: the remote set appears in the same way as a local one.
