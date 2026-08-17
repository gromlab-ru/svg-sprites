# SVG-спрайт для Solid на Vite

Инструкция по быстрому созданию SVG-спрайта в Solid-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "solid@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Запускайте его через `npx` перед разработкой и production-сборкой:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && vite build"
  }
}
```

## Использование спрайта

Создайте `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Имя `app` создаёт Solid-компонент `AppIcon`:

```tsx
import { AppIcon } from '../assets/app-icons'

export function SaveIcon() {
  return (
    <AppIcon
      icon="icon-name"
      width={24}
      height={24}
      aria-label="Готово"
      style={{ color: '#334155', '--icon-color-2': '#f59e0b' }}
    />
  )
}
```

Vite выпускает `sprite.svg` как production asset. Монохромные иконки наследуют `color`, многоцветные используют `--icon-color-N`.

## Дебаг и превью

Viewer нужен только во время разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Подключите его в отладочном компоненте после запуска браузерного кода:

```tsx
import { onMount } from 'solid-js'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'

export function IconViewer() {
  let host!: HTMLDivElement
  onMount(async () => {
    await import('@gromlab/svg-sprites/viewer/element')
    const viewer = document.createElement('gromlab-sprite-viewer') as SpriteViewerElement
    viewer.sources = [() => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js')]
    host.append(viewer)
  })
  return <div ref={host} />
}
```
