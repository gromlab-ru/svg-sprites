# SVG-спрайт для Svelte на Vite

Инструкция по быстрому созданию SVG-спрайта в Svelte-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "svelte@vite",
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
    "build": "vite build"
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

Свойство `icon` принимает имена исходных SVG без расширения. Монохромная иконка наследует `color`, а цвета многоцветной переопределяются через `--icon-color-N`.

Vite сам подключает стили компонента и выпускает `sprite.svg` отдельным production asset.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Добавьте Viewer на страницу или в компонент, используемый только при разработке:

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
