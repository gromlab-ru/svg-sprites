# SVG-спрайт для Nuxt на Vite

Инструкция по быстрому созданию SVG-спрайта в Nuxt-приложении на Vite.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

Пример конфига:

```json
{
  "mode": "nuxt@vite",
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
    "dev": "nuxt dev",
    "prebuild": "npm run sprites",
    "build": "nuxt build"
  }
}
```

## Использование спрайта

Значение `name: "app"` создаёт Vue-компонент `AppIcon`. Создайте `assets/app-icons/index.js`:

```js
export * from './.svg-sprite/index.js'
```

Используйте компонент на странице или в layout Nuxt:

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

`AppIcon` безопасен для SSR и не требует client-only обёртки. Vite выпускает `sprite.svg` отдельным production asset.

## Дебаг и превью

Viewer показывает все иконки на одной странице, позволяет проверить их отображение, изменить цвета и посмотреть связанные CSS-переменные. Он нужен только для разработки и устанавливается отдельно:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Создайте `app/components/SvgSpriteViewer.client.vue`, чтобы browser-only Viewer не выполнялся во время SSR:

```vue
<script setup>
import '@gromlab/svg-sprites/viewer/element'

const sources = [
  () => import('../../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'),
]
</script>

<template>
  <gromlab-sprite-viewer :sources="sources" viewer-title="Иконки проекта" />
</template>
```

Отметьте `gromlab-sprite-viewer` как custom element в `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'gromlab-sprite-viewer',
    },
  },
})
```

Покажите `<SvgSpriteViewer />` на странице разработки. Viewer изолирован от generated runtime компонента `AppIcon`.
