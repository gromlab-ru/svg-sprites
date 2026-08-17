# Complex SVGs: diagnostics and safe generation

## When to use this reference

Use this document when a source contains `<defs>`, gradients, patterns, filters, masks, clip paths, internal `<style>`/classes, `url(#id)`, CSS variables, `<use>`, text, an unusual `viewBox`, spaces in its filename, or changes visually after generation. Also use it for reports involving color, sizing, clipping, or fragment-ID collisions.

## Classify the risk first

Inspect the source SVG before editing it:

```bash
npm run sprite:file-manager
```

Use the actual package script for the sprite. Then compare the source with `.svg-sprite/sprite.svg` and the manifest; do not draw conclusions from a successful exit code alone.

Pay particular attention to:

- `fill="url(#gradient)"`, `stroke="url(#pattern)"`;
- `filter="url(#shadow)"`, `mask="url(#mask)"`, `clip-path="url(#clip)"`;
- CSS rules inside `<style>` and external stylesheets;
- colors expressed through classes, presentation attributes, and inline `style` at the same time;
- `currentColor`, existing `var(...)`, `context-fill`, and `context-stroke`;
- duplicate IDs in `<defs>` across different files;
- SVGs without a `viewBox`, or with width/height that does not match the viewBox;
- embedded images, fonts, scripts, or external references.

## Actual pipeline

The compiler first applies SVGO `preset-default` while preserving `viewBox`, then applies custom transforms in this order:

1. `removeSize` removes `width` and `height` from the root `<svg>`.
2. `replaceColors` collects `fill` and `stroke` values from attributes and inline `style`, then replaces them with `var(--icon-color-N, fallback)`.
3. `addTransition` adds inline color transitions to `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`, `text`, `tspan`, and `use` elements.

All three options default to `true` and apply to the entire sprite, not to individual icons.

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'react@vite',
  name: 'illustrations',
  transform: {
    removeSize: false,
    replaceColors: false,
    addTransition: false,
  },
})
```

This is a config for one of potentially many sprite modules in a project; its directory does not have to match a module/feature directory. For Next, use the corresponding full `mode` with the same `transform`.

## Dimensions and viewBox

`removeSize: true` removes intrinsic `width`/`height`, but does not create a missing `viewBox`. If the source lacks a valid `viewBox`, the generated icon may scale incorrectly or have a zero-sized viewport.

Correct source preparation:

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="..." />
</svg>
```

If physical dimensions are part of an illustration's contract, set `removeSize: false` and verify component-prop behavior. Do not preserve width/height as a substitute for a missing viewBox.

React compilation leaves the root sprite `rootViewBox` disabled; Next enables it. Every shape must still have its own valid viewBox, which is included in the manifest and used by the Viewer.

## Colors

For one detected color, the fallback becomes `currentColor`:

```svg
stroke="var(--icon-color-1, currentColor)"
```

For multiple colors, the original fallbacks are preserved:

```svg
fill="var(--icon-color-1, #798198)"
fill="var(--icon-color-2, #ffffff)"
```

The values `none`, `transparent`, `inherit`, `unset`, and `initial` are not replaced. Color comparison normalizes case and whitespace but does not merge equivalent forms such as `#fff`, `#ffffff`, and `rgb(...)`.

Automatic analysis is primarily reliable for `fill`/`stroke` attributes and inline `style`. It does not parse CSS selectors in an internal `<style>` or external stylesheet as a full CSS AST.

For `url(#...)`, existing nested `var(...)`, gradients, and patterns, automatic replacement requires inspection of the generated output. If a paint-server reference changed or the Viewer shows incorrect controls, disable `replaceColors` for the entire sprite:

```ts
transform: {
  replaceColors: false,
}
```

If ordinary recolorable icons are also needed, move complex illustrations into a separate sprite with a separate config. This is preferable to manually editing the generated SVG.

`addTransition` is independent of `replaceColors`. Even when original colors are preserved, transitions may still be added. For filters, animations, or custom CSS, disable both options if an inline transition changes behavior.

## Defs, references, and IDs

After SVGO and compilation, verify that each `url(#id)` or `<use href="#id">` refers to an existing ID within the corresponding shape. Do not assume IDs remain literal copies of the source; the optimizer/compiler may change them.

At minimum, check that:

- each gradient/pattern applies to the intended path;
- the filter region does not clip blur/shadow;
- masks and clip paths preserve their coordinate system (`userSpaceOnUse`/`objectBoundingBox`);
- an internal `<use>` is not confused with the sprite's external fragment;
- equal IDs from different source SVGs do not cause cross-icon collisions in the final document;
- external file/URL references are permitted by the production CSP and deployment.

If IDs collide, first make the source IDs unique and update all references within the SVG. Do not edit the compiled sprite.

## Filenames and external fragments

`FileManagerIcon` in the examples below is only an example generated name for a separate config with `name: 'file-manager'`; it is not a fixed API name.

A safe basename matches:

```text
^[a-zA-Z][a-zA-Z0-9_-]*$
```

It is preserved as the fragment ID. Other names, such as `folder open.svg` or `24-check.svg`, remain public TypeScript `icon` values but receive a stable `icon-<16 hex>` ID.

```tsx
<FileManagerIcon icon="folder open" />
```

Do not manually construct `#folder open`. Use the generated component or `.svg-sprite/svg-sprite.manifest.js`, which records both `name` and the actual `id`.

Different files with the same basename are forbidden, even from different directories. Rename one source meaningfully; source order or overlap never selects a winner.

## Rendering method

To control `color` and `--icon-color-N`, use the generated React component or `<svg><use>`:

```tsx
<FileManagerIcon
  icon="diagram"
  style={{
    '--icon-color-1': '#334155',
    '--icon-color-2': '#38bdf8',
  }}
/>
```

The generated style type accepts `--icon-color-${number}`. `<img>` and CSS `background-image` load the SVG as an isolated document, so page variables do not propagate into it. A CSS mask keeps only the silhouette and loses gradients, filters, and color differences.

External stack-fragment support and paint-server behavior can vary across browsers. For critical complex graphics, when diagnosing runtime behavior and browser tools are available, test the target browsers; if they are incompatible, an SVG sprite may be the wrong delivery mechanism for that illustration.

## Required verification

1. Run generation with the correct mode.
2. Run the project's typecheck.
3. Open the generated sprite and find the shape using the ID from the manifest.
4. Statically compare `viewBox`, IDs, `url(#...)`, colors, and inline styles.
5. If the target/pipeline changed or a runtime issue is being diagnosed, build the production bundle and inspect the external hashed SVG.
6. When SpriteViewer and visual tools are available, test default colors and each `--icon-color-N` separately.
7. When browser tools are available and the runtime risk warrants it, test SSR/hydration for Next.js and target browsers for external fragments.
8. Do not claim visual or accessibility equivalence between source and output without the necessary tools and an actual comparison.

## Common symptoms and actions

- Icon became entirely `currentColor`: the pipeline detected one color. If the source semantics are more complex, disable `replaceColors` or normalize the source attributes.
- Gradient disappeared: check whether `fill="url(#...)"` was transformed, whether the target ID exists, and whether it collides with another icon.
- Shadow is clipped: inspect the filter region and viewBox; `removeSize` does not expand the area by itself.
- Viewer has no color controls: the color is defined through a class/stylesheet, or `replaceColors: false`; this is expected.
- Transition is duplicated or interferes with animation: an existing inline `transition` is not overwritten, but generated CSS also adds transitions; disable `addTransition` for the sprite.
- `<img>` ignores variables: switch to `<svg><use>` or the generated component; page variables cannot be passed into an isolated SVG document.
- A manual fragment fails for a name containing spaces: use the ID from the manifest.
- One complex icon requires different transforms: move it to a separate sprite; per-icon transform config is not supported.

For mode-specific execution and verification, return to the exact-mode guide selected from the main `SKILL.md`.
