# SVG-спрайт для Svelte на Webpack 5

Инструкция по быстрому созданию SVG-спрайта в Svelte-приложении на Webpack 5.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "svelte@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта: генерация запускается через `npx`.

Добавьте команды генерации в `package.json`:

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

Значение `name: "app"` создаёт Svelte-компонент `AppIcon`.

Создайте `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Используйте компонент в приложении:

```svelte
<script>
  import { AppIcon } from '../assets/app-icons/index.js'
</script>

<AppIcon
  icon="icon-name"
  width="24"
  height="24"
  role="img"
  aria-label="Готово"
  style="color: #334155; --icon-color-2: #f59e0b"
/>
```

Generated-компонент является нативным `.svelte`-файлом. Обычное правило `svelte-loader` должно обрабатывать `.svelte`-файлы в `assets`:

```js
{
  test: /\.svelte$/,
  use: {
    loader: 'svelte-loader',
    options: { emitCss: false },
  },
}
```

Webpack 5 обрабатывает asset URL из компонента и выпускает `sprite.svg` отдельным production asset.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Добавьте Viewer в Svelte-компонент, используемый только при разработке:

```svelte
<script>
  import '@gromlab/svg-sprites/viewer/element'

  const sources = [
    () => import('../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
  ]

  function connectViewer(node) {
    node.sources = sources
  }
</script>

<gromlab-sprite-viewer
  use:connectViewer
  viewer-title="Иконки проекта"
></gromlab-sprite-viewer>
```

Запустите `npm run dev` и откройте страницу с Viewer. Не импортируйте этот отладочный компонент из production entry.
