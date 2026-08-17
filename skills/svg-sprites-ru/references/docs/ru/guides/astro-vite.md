# SVG-спрайт для Astro на Vite

Инструкция по быстрому созданию SVG-спрайта в Astro-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "astro@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Генерируйте спрайт через `npx` перед разработкой и production-сборкой:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "astro dev",
    "prebuild": "npm run sprites",
    "build": "astro check && astro build"
  }
}
```

## Использование спрайта

Создайте `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Создайте `assets/app-icons/index.d.ts` для того же типизированного API:

```ts
export * from './.svg-sprite/index.js'
```

Значение `name: "app"` создаёт нативный Astro-компонент `AppIcon`. Используйте его на странице:

```astro
---
import { AppIcon } from '../../assets/app-icons/index.js'
---

<AppIcon
  icon="icon-name"
  width="24"
  height="24"
  role="img"
  aria-label="Готово"
  style="color: #334155; --icon-color-2: #f59e0b"
/>
```

Prop `icon` типизирован именами исходных файлов. Vite выпускает `sprite.svg` из статического asset import компонента.

## Дебаг и превью

Viewer необязателен и нужен только при разработке:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Добавьте Viewer на страницу и подключите generated manifest в клиентском скрипте:

```astro
<gromlab-sprite-viewer id="sprite-viewer"></gromlab-sprite-viewer>

<script>
  import '@gromlab/svg-sprites/viewer/element'
  import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'

  const viewer = document.querySelector<SpriteViewerElement>('#sprite-viewer')!
  viewer.sources = [async () => {
    const { default: manifest } = await import(
      '../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'
    )
    const { usage: _usage, ...viewerManifest } = manifest
    return viewerManifest
  }]
</script>
```

Manifest сохраняет Astro usage metadata, а Viewer отображает тот же production-спрайт.
