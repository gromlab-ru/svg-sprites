# SVG-спрайт для Next.js App Router с Webpack

Инструкция по быстрому созданию SVG-спрайта в приложении Next.js с App Router и Webpack.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "next@app/webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта: генерация запускается через `npx`.

Добавьте команды генерации в `package.json`. Сгенерированные файлы по умолчанию исключены из Git, поэтому `predev` и `prebuild` пересобирают спрайт перед каждым запуском и сборкой:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "next dev --webpack",
    "prebuild": "npm run sprites",
    "build": "next build --webpack"
  }
}
```

## Использование спрайта

Значение `name: "app"` создаёт React-компонент `AppIcon`.

Создайте точку входа `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Используйте компонент в Server Component:

```tsx
// app/page.tsx
import { AppIcon } from '../assets/app-icons'

export default function Page() {
  return (
    <AppIcon
      icon="icon-name"
      width={24}
      height={24}
      role="img"
      aria-label="Готово"
      style={{
        color: '#334155',
        '--icon-color-2': '#f59e0b',
      }}
    />
  )
}
```

Для `AppIcon` не нужен `'use client'`. Next.js сам добавляет `sprite.svg` в итоговую сборку, поэтому переносить его в `public` не нужно.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте Client Component `app/svg-sprite/SvgSpriteViewer.tsx`:

```tsx
'use client'

import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

export function SvgSpriteViewer() {
  return <SpriteViewer sources={sources} title="Иконки проекта" />
}
```

Создайте маршрут `app/svg-sprite/page.tsx`:

```tsx
import { notFound } from 'next/navigation'

import { SvgSpriteViewer } from './SvgSpriteViewer'

export default function SvgSpritePage() {
  if (process.env.NODE_ENV !== 'development') notFound()

  return <SvgSpriteViewer />
}
```

Запустите `npm run dev` и откройте `/svg-sprite`. В production маршрут вернёт 404.
