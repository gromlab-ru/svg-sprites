# SVG-спрайт для Webpack 5 без фреймворка

Инструкция по быстрому созданию SVG-спрайта в приложении на Webpack 5 без фреймворка.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "standalone@webpack",
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

Значение `name: "app"` создаёт элемент `<app-icon>`.

Создайте точку входа `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index.js'
```

Зарегистрируйте элемент в основном entry приложения:

```ts
import { defineAppIconElement } from '../assets/app-icons'
import './style.css'

defineAppIconElement()
```

Используйте иконку в HTML:

```html
<app-icon icon="icon-name" role="img" aria-label="Готово"></app-icon>
```

Значение `icon` — имя исходного SVG без расширения. Размер и цвета настраиваются через CSS:

```css
app-icon {
  font-size: 24px;
  color: #334155;
  --icon-color-2: #f59e0b;
}
```

Монохромная иконка наследует `color`, а цвета многоцветной иконки переопределяются через `--icon-color-N`. Нужные переменные показывает Viewer.

Webpack 5 сам добавит `sprite.svg` в итоговую сборку.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки.

Установите Viewer:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте entry `src/svg-sprite-debug.ts`:

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

const viewer = document.createElement('gromlab-sprite-viewer') as SpriteViewerElement
viewer.viewerTitle = 'Иконки проекта'
viewer.sources = [spriteManifest]
document.body.append(viewer)
```

Добавьте скрипт к основному entry только в development-режиме. Сохраните остальные настройки `webpack.config.js`:

```js
export default (_env, argv) => ({
  // Остальные настройки Webpack.
  entry: [
    './src/main.ts',
    ...(argv.mode === 'development' ? ['./src/svg-sprite-debug.ts'] : []),
  ],
})
```

Запустите `npm run dev`. Viewer появится на основной странице приложения.

Viewer добавляется только в development-сборку и не попадает в production.
