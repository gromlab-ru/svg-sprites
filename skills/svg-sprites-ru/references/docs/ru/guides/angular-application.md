# SVG-спрайт для Angular с Application Builder

Инструкция по быстрому созданию SVG-спрайта в Angular-приложении на `@angular/build:application`.

## Генерация спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "angular@application",
  "name": "app",
  "input": "../svg-icons/**/*.svg"
}
```

Пакет не нужно добавлять в зависимости проекта. Запускайте генерацию через `npx` перед разработкой и production-сборкой:

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

Application Builder выпускает импортированный SVG отдельным файлом при включённом file loader. Добавьте опцию в build target файла `angular.json`:

```json
{
  "builder": "@angular/build:application",
  "options": {
    "loader": { ".svg": "file" }
  }
}
```

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

Импортируйте `@gromlab/svg-sprites/viewer/element`, добавьте `CUSTOM_ELEMENTS_SCHEMA` и поместите `<gromlab-sprite-viewer [sources]="viewerSources" />` в шаблон. Загрузите generated manifest без framework-specific metadata:

```ts
readonly viewerSources = [async () => {
  const { default: manifest } = await import(
    '../assets/app-icons/.svg-sprite/svg-sprite.manifest.js'
  )
  const { usage: _usage, ...viewerManifest } = manifest
  return viewerManifest
}]
```

Viewer использует тот же production URL спрайта, что и `AppIcon`.
