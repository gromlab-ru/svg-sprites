# SVG-спрайт для Angular на Webpack

Инструкция по быстрому созданию SVG-спрайта в Angular-приложении со штатным Webpack browser builder из Angular CLI.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "angular@webpack",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Mode предназначен для workspace, где build target использует официальный Webpack builder:

```json
{
  "builder": "@angular-devkit/build-angular:browser"
}
```

Пакет не нужно добавлять в зависимости проекта. Генерируйте спрайт через `npx` перед каждым запуском и сборкой:

```json
{
  "scripts": {
    "sprites": "npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json",
    "prestart": "npm run sprites",
    "start": "ng serve",
    "prebuild": "npm run sprites",
    "build": "ng build"
  }
}
```

Webpack разрешает generated-выражение `new URL(..., import.meta.url)` и выпускает `sprite.svg` как production asset.

## Использование спрайта

Создайте `assets/app-icons/index.ts`:

```ts
export * from './.svg-sprite/index'
```

Импортируйте сгенерированный standalone-компонент. Значение `name: "app"` создаёт `AppIcon` с селектором `app-icon`:

```ts
import { Component } from '@angular/core'
import { AppIcon } from '../assets/app-icons'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppIcon],
  template: `
    <app-icon
      icon="icon-name"
      role="img"
      aria-label="Готово"
      style="width: 24px; height: 24px; color: #334155; --icon-color-2: #f59e0b"
    />
  `,
})
export class AppComponent {}
```

Input `icon` типизирован именами исходных файлов. Монохромные иконки наследуют `color`, отдельные цвета задаются через `--icon-color-N`.

## Дебаг и превью

Viewer необязателен и нужен только при разработке:

```bash
npm install --save-dev @gromlab/svg-sprites
```

Импортируйте `@gromlab/svg-sprites/viewer/element`, добавьте `CUSTOM_ELEMENTS_SCHEMA` и поместите `<gromlab-sprite-viewer [sources]="viewerSources" />` в шаблон:

```ts
readonly viewerSources = [async () => {
  const { default: manifest } = await import(
    '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'
  )
  const { usage: _usage, ...viewerManifest } = manifest
  return viewerManifest
}]
```

Viewer и `AppIcon` используют один выпущенный Webpack URL спрайта.
