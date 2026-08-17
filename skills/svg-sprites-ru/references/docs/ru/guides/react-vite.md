# SVG-спрайт для React на Vite

Инструкция по быстрому созданию SVG-спрайта в React-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "react@vite",
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
    "dev": "vite",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && vite build"
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

Vite сам подключает стили компонента и добавляет `sprite.svg` в итоговую сборку.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте `svg-sprite.html` в корне проекта:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <title>Иконки проекта</title>
  </head>
  <body>
    <!-- React-корень Viewer для дебага и превью SVG-спрайта -->
    <div id="svg-sprite-viewer"></div>

    <!-- Подключение создаваемого ниже скрипта дебаггера -->
    <script type="module" src="/src/svg-sprite-debug.tsx"></script>
  </body>
</html>
```

Создайте `src/svg-sprite-debug.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import { SpriteViewer } from '@gromlab/svg-sprites/react'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
] as const

createRoot(document.getElementById('svg-sprite-viewer')!).render(
  <SpriteViewer sources={sources} title="Иконки проекта" />,
)
```

Запустите `npm run dev` и откройте `/svg-sprite.html`.

Стандартная production-сборка Vite использует только `index.html` и не включает страницу Viewer.
