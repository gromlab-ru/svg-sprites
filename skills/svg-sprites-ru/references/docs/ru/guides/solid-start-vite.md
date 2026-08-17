# SVG-спрайт для SolidStart на Vite

Инструкция по быстрому созданию SVG-спрайта в SSR-приложении SolidStart на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "solid-start@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Перегенерируйте спрайт через `npx` перед запуском и сборкой Vinxi:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vinxi dev",
    "prebuild": "npm run sprites",
    "build": "vinxi build"
  }
}
```

## Использование спрайта

Создайте `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Сгенерированный компонент безопасно рендерится на сервере:

```tsx
import { AppIcon } from '../assets/app-icons'

export default function Home() {
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

Компонент использует статический Vite asset import и не обращается к browser globals во время SSR.

## Дебаг и превью

Viewer работает только в браузере и нужен лишь для разработки:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Загрузите его из `onMount`, чтобы исключить из серверного рендера:

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
