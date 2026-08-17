# SVG-спрайт для Solid на Webpack

Инструкция по быстрому созданию SVG-спрайта в Solid-приложении на Webpack 5.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "solid@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Запускайте его через `npx` перед запуском и сборкой Webpack:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "predev": "npm run sprites",
    "dev": "webpack serve --mode development",
    "prebuild": "npm run sprites",
    "build": "tsc --noEmit && webpack --mode production"
  }
}
```

## Использование спрайта

Создайте `assets/app-icons/index.js` и `assets/app-icons/index.d.ts` с одинаковым экспортом:

```js
export * from './.svg-sprite/index.js'
```

Используйте сгенерированный Solid-компонент:

```jsx
import { AppIcon } from '../assets/app-icons/index.js'

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

Webpack Asset Modules выпускают `sprite.svg` из сгенерированного `new URL(...)`. Обработка `.jsx` должна охватывать сгенерированный Solid-компонент.

## Дебаг и превью

Установите Viewer только для разработки:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Подключите его в отдельной development entry:

```js
import '@gromlab/svg-sprites/viewer/element'

const viewer = document.createElement('gromlab-sprite-viewer')
viewer.sources = [() => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js')]
document.body.append(viewer)
```
