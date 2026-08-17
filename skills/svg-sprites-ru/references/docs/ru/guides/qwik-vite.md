# SVG-спрайт для Qwik на Vite

Инструкция по быстрому созданию SVG-спрайта в SSR-приложении Qwik на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "qwik@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Перегенерируйте спрайт через `npx` перед запуском и сборкой Vite:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "vite --mode ssr",
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

Сгенерированный компонент является Qwik `component$` и безопасен во время SSR:

```tsx
import { component$ } from '@builder.io/qwik'
import { AppIcon } from '../assets/app-icons'

export default component$(() => (
  <AppIcon
    icon="icon-name"
    width={24}
    height={24}
    aria-label="Готово"
    style={{ color: '#334155', '--icon-color-2': '#f59e0b' }}
  />
))
```

Компонент использует статический Vite asset import и не обращается к browser globals во время SSR.

## Дебаг и превью

Viewer работает только в браузере и нужен лишь для разработки:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Загрузите его из visible task:

```tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'

export const IconViewer = component$(() => {
  const host = useSignal<HTMLElement>()
  useVisibleTask$(async () => {
    await import('@gromlab/svg-sprites/viewer/element')
    const viewer = document.createElement('gromlab-sprite-viewer') as SpriteViewerElement
    viewer.sources = [() => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js')]
    host.value?.append(viewer)
  })
  return <div ref={host} />
})
```
