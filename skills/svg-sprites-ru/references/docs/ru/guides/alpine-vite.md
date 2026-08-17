# SVG-спрайт для Alpine.js на Vite

Инструкция по быстрому созданию SVG-спрайта в Alpine.js-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "alpine@vite",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Генератор не нужно добавлять в зависимости приложения: запускайте его через `npx`.

Добавьте генерацию перед запуском разработки и production-сборкой:

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

Значение `name: "app"` создаёт Alpine plugin `appAlpinePlugin`, директиву `x-app-icon` и magic `$appIconHref`.

Создайте `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Зарегистрируйте generated plugin до запуска Alpine:

```js
import Alpine from 'alpinejs'
import { appAlpinePlugin } from '../assets/app-icons/index.js'

Alpine.plugin(appAlpinePlugin)
Alpine.start()
```

Используйте реактивную директиву на SVG-элементе:

```html
<svg
  x-data="{ iconName: 'icon-name' }"
  x-app-icon="iconName"
  role="img"
  aria-label="Готово"
  style="width:24px;height:24px;color:#334155;--icon-color-2:#f59e0b"
></svg>
```

Выражение директивы возвращает имя исходного SVG без расширения. Монохромная иконка наследует `color`, а слои многоцветной иконки переопределяются через `--icon-color-N`. Vite подключает generated CSS и выпускает `sprite.svg` отдельным production asset.

## Дебаг и превью

Viewer показывает все иконки на одной странице и нужен только при разработке. Установите его отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Добавьте Viewer на development-страницу:

```html
<gromlab-sprite-viewer viewer-title="Иконки проекта"></gromlab-sprite-viewer>
<script type="module" src="/src/svg-sprite-debug.js"></script>
```

Создайте `src/svg-sprite-debug.js`:

```js
import '@gromlab/svg-sprites/viewer/element'
import spriteManifest from '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'

document.querySelector('gromlab-sprite-viewer').sources = [spriteManifest]
```

Запустите `npm run dev` и откройте development-страницу. Viewer не зависит от Alpine plugin.
