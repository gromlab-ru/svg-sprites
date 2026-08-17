# Программный API

[Индекс документации](../README.md)

Пакет распространяется как ESM и предоставляет единый Node.js API генерации. Framework-neutral Viewer находится в `@gromlab/svg-sprites/viewer`, auto-register entry — в `@gromlab/svg-sprites/viewer/element`, React bridge — в `@gromlab/svg-sprites/react`.

## `generateSprite`

```ts
import { generateSprite } from '@gromlab/svg-sprites'

const result = await generateSprite(
  'src/ui/file-manager/svg-sprite/svg-sprite.config.ts',
)
```

Результат содержит имя и mode спрайта, количество иконок и абсолютные filesystem paths:

```ts
result.name
result.mode
result.target
result.iconCount
result.rootDir
result.generatedDir
result.spritePath
result.manifestPath
```

Next.js modes дополнительно возвращают `router` и `bundler`. `standalone@server`
возвращает `target: 'server'`; его `spritePath` указывает на стандартный
content-addressed profile, а `manifestPath` — на server manifest.

Для static standalone mode `result.spritePath` можно использовать в build-скрипте,
чтобы опубликовать SVG по URL приложения:

```ts
import { copyFile } from 'node:fs/promises'

const result = await generateSprite('src/sprite/svg-sprite.config.ts', {
  mode: 'standalone',
})
await copyFile(result.spritePath, 'dist/app-icons/sprite.svg')
```

`spritePath` является filesystem path, а не browser URL. Deployment-neutral JSON
manifest доступен через `result.manifestPath` и копируется независимо от SVG.

Первый аргумент принимает абсолютный или относительный путь к config-файлу с любым именем и расширением `.ts`, `.js` или `.json`. Каталог вместо файла включает config-less режим: корнем sprite-модуля становится этот каталог.

Второй аргумент содержит необязательные overrides и всегда имеет приоритет над конфигом:

```ts
await generateSprite('src/ui/file-manager/svg-sprite/custom-config.json', {
  mode: 'react@webpack',
  name: 'documents',
  input: ['./assets', '../../shared/search.svg'],
  transform: {
    addTransition: false,
  },
  generatedNotice: false,
})
```

Порядок разрешения настроек:

```text
defaults → config → API overrides
```

Для полностью программной генерации передайте каталог и все обязательные настройки через overrides:

```ts
await generateSprite('src/ui/file-manager/svg-sprite', {
  mode: 'react@vite',
  name: 'file-manager',
  input: [
    '../../shared/search.svg',
    '../../shared/settings.svg',
  ],
})
```

## Конфигурация

```ts
import { defineSpriteConfig } from '@gromlab/svg-sprites'

export default defineSpriteConfig({
  mode: 'react@vite',
  name: 'file-manager',
  description: 'Иконки файлового менеджера',
  input: ['./icons', '../../shared/check.svg'],
  transform: {
    removeSize: true,
    replaceColors: true,
    addTransition: true,
  },
  generatedNotice: true,
})
```

`input` принимает одну папку, SVG-файл или glob-паттерн либо массив, объединяющий такие источники. Если поле не задано, используется `./icons`; относительные пути считаются от папки с конфигом.

`defineSpriteConfig` является identity helper для TypeScript autocomplete. JS может экспортировать тот же объект через `export default`, а JSON содержит объект непосредственно.

Публичные типы `ServerSvgInput`, `ServerSpriteManifest`, `ServerSpriteAsset` и
`SpriteCompileProfile` описывают inputs и release data для `standalone@server`.
Consumer использует тот же API с `source: 'remote'` и одним local path или HTTP(S)
URL manifest в `input`.

## Специализированные обёртки

Специализированные функции доступны как обёртки над `generateSprite`:

```ts
import { generateNextSprite, generateReactSprite } from '@gromlab/svg-sprites'

await generateReactSprite('path/to/config.ts', 'vite')
await generateNextSprite('path/to/config.ts', {
  router: 'app',
  bundler: 'turbopack',
})
```

Явно переданный target перекрывает `mode` из файла. Для нового кода используйте `generateSprite`.

## Config API

```ts
import {
  isSpriteMode,
  loadSpriteConfig,
  resolveSpriteConfig,
  resolveSpriteConfigSource,
  validateSpriteConfig,
} from '@gromlab/svg-sprites'
```

- `isSpriteMode(value)` проверяет, является ли значение поддерживаемым exact mode.
- `loadSpriteConfig(file)` загружает явно указанный `.ts`, `.js` или `.json` файл.
- `resolveSpriteConfigSource(source)` разрешает путь как config-файл или config-less каталог.
- `validateSpriteConfig(value)` выполняет runtime-валидацию объекта.
- `resolveSpriteConfig(root, config, overrides)` объединяет значения, добавляет defaults и разрешает пути относительно `root`.

## Низкоуровневый compiler

```ts
import {
  compileSprite,
  compileSpriteContent,
  createShapeTransform,
} from '@gromlab/svg-sprites'
```

Эти функции предназначены для собственного orchestration. Стандартная генерация должна выполняться через `generateSprite`.

## Viewer runtime

```ts
import '@gromlab/svg-sprites/viewer/element'
import type { SpriteViewerElement } from '@gromlab/svg-sprites/viewer'
```

Browser entry регистрирует `<gromlab-sprite-viewer>`. Bare standalone также может загрузить самостоятельный `dist/viewer-element.js` без bundler.

Для ручной регистрации импортируйте runtime без auto-register entry:

```ts
import { defineSpriteViewerElement } from '@gromlab/svg-sprites/viewer'

defineSpriteViewerElement()
```

Этот entry также экспортирует типы `SpriteViewerElement`, `SpriteViewerManifest`, `SpriteViewerSource`, `SpriteViewerSources` и связанные типы manifest и loaders.

React bridge сохраняет компонентный API:

```tsx
import { SpriteViewer } from '@gromlab/svg-sprites/react'
```

`SpriteViewer` принимает generated manifests, remote standalone sources, lazy loaders или результат `import.meta.glob`. React entry содержит `'use client'` и предназначен для debug-инструментов; production-компоненты импортируются из локальных sprite-модулей приложения.
