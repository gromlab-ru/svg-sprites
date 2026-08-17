# SVG-спрайт для Vue на Vite

Инструкция по быстрому созданию SVG-спрайта в Vue-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "vue@vite",
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
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

## Использование спрайта

Значение `name: "app"` создаёт Vue-компонент `AppIcon`.

Создайте точку входа `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Используйте компонент в приложении:

```vue
<script setup lang="ts">
import { AppIcon } from '../assets/app-icons'
</script>

<template>
  <AppIcon
    icon="icon-name"
    width="24"
    height="24"
    role="img"
    aria-label="Готово"
    style="color: #334155; --icon-color-2: #f59e0b"
  />
</template>
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
    <gromlab-sprite-viewer viewer-title="Иконки проекта"></gromlab-sprite-viewer>
    <script type="module" src="/src/svg-sprite-debug.ts"></script>
  </body>
</html>
```

Создайте `src/svg-sprite-debug.ts`:

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.querySelector<SpriteViewerElement>('gromlab-sprite-viewer')!
viewer.sources = [spriteManifest]
```

Запустите `npm run dev` и откройте `/svg-sprite.html`.

Viewer не требуется для работы `AppIcon` и не подключается к основному коду приложения.
