# SVG-спрайт для React на Webpack 5

Инструкция по быстрому созданию SVG-спрайта в React-приложении на Webpack 5.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "react@webpack",
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
    "dev": "webpack serve --mode development",
    "prebuild": "npm run sprites",
    "build": "webpack --mode production"
  }
}
```

## Использование спрайта

Значение `name: "app"` создаёт React-компонент `AppIcon`.

Создайте точку входа `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Используйте компонент в приложении:

```tsx
import { AppIcon } from '../assets/app-icons'

export function SaveIcon() {
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

Свойство `icon` принимает имена исходных SVG без расширения. Монохромная иконка наследует `color`, а цвета многоцветной переопределяются через `--icon-color-N`.

Компонент использует CSS Modules. Если проект ещё не обрабатывает их, установите loaders:

```bash
npm install --save-dev style-loader css-loader
```

Затем добавьте правило с default export в `webpack.config.js`:

```js
{
  test: /\.module\.css$/i,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: { namedExport: false } },
    },
  ],
}
```

Webpack 5 сам добавляет `sprite.svg` в итоговую сборку.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки.

Установите Viewer:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте entry `src/svg-sprite-debug.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

const container = document.createElement('div')
document.body.append(container)

createRoot(container).render(
  <SpriteViewer sources={sources} title="Иконки проекта" />,
)
```

Добавьте скрипт к основному entry только в development-режиме. Сохраните остальные настройки `webpack.config.js`:

```js
export default (_env, argv) => ({
  // Остальные настройки Webpack.
  entry: [
    './src/main.tsx',
    ...(argv.mode === 'development' ? ['./src/svg-sprite-debug.tsx'] : []),
  ],
})
```

Запустите `npm run dev`. Viewer появится на основной странице приложения и не попадёт в production-сборку.
