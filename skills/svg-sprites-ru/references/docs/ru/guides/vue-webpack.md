# SVG-спрайт для Vue на Webpack 5

Инструкция по быстрому созданию SVG-спрайта в Vue-приложении на Webpack 5.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "vue@webpack",
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

Значение `name: "app"` создаёт Vue-компонент `AppIcon`. Создайте `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Используйте компонент в приложении:

```vue
<script setup>
import { AppIcon } from '../assets/app-icons/index.js'
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

Компонент использует CSS Modules. Если проект ещё не обрабатывает их, установите `style-loader` и `css-loader`, затем добавьте правило с default export:

```bash
npm install --save-dev style-loader css-loader
```

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

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Добавьте Viewer в Vue-компонент, подключаемый только при разработке:

```vue
<script setup>
import '@gromlab/svg-sprites/viewer/element'

const sources = [
  () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
]
</script>

<template>
  <gromlab-sprite-viewer
    :sources="sources"
    viewer-title="Иконки проекта"
  />
</template>
```

Настройте Vue Loader так, чтобы `gromlab-sprite-viewer` считался custom element:

```js
{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'gromlab-sprite-viewer',
    },
  },
}
```

Покажите компонент Viewer на странице разработки. Viewer не требуется для работы `AppIcon`.
