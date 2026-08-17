# Универсальный SVG-спрайт на сервере

Сгенерируйте в CI или server worker универсальный SVG-спрайт, который смогут использовать приложения с разными frameworks и bundlers.

## Генерация спрайта

Устанавливать пакет в worker не нужно.

### 1. Подготовьте рабочий каталог

Поместите исходные SVG в папку `icons` текущего workspace:

```text
.
└── icons/
    ├── search.svg
    └── settings.svg
```

Имена файлов без расширения станут именами иконок.

### 2. Запустите генерацию

Передайте mode, имя спрайта и путь к SVG через CLI:

```bash
npx --yes @gromlab/svg-sprites \
  --mode standalone@server \
  --name app \
  --input './icons/**/*.svg' \
  .
```

Config-файл для этого worker-сценария не нужен. Результат появится в `./.svg-sprite`:

```text
.
├── icons/
│   ├── search.svg
│   └── settings.svg
└── .svg-sprite/
    ├── sprite.<content-hash>.svg
    ├── sprite-root-viewbox.<content-hash>.svg
    └── svg-sprite.manifest.json
```

### 3. Опубликуйте результат

Загрузите содержимое `.svg-sprite` в отдельный каталог S3 bucket:

```bash
aws s3 sync ./.svg-sprite/ s3://my-bucket/app-icons/
```

Этот же каталог можно раздавать через CDN. В публичном URL нет сегмента `.svg-sprite`:

```text
https://cdn.example.com/app-icons/
├── sprite.<content-hash>.svg
├── sprite-root-viewbox.<content-hash>.svg
└── svg-sprite.manifest.json
```

`standalone@server` также можно запускать через JSON, JavaScript или TypeScript config. Config подходит для постоянных настроек, локальных SVG из нескольких каталогов и SVG, загружаемых по HTTP(S).

## Использование спрайта

В consumer-приложении создайте обычный config. Например, для React с Vite:

```text
src/app-icons/
├── index.ts
└── svg-sprite.config.json
```

Укажите consumer mode и URL manifest из CDN:

```json
{
  "mode": "react@vite",
  "source": "remote",
  "input": "https://cdn.example.com/app-icons/svg-sprite.manifest.json"
}
```

Добавьте пользовательскую точку входа:

```ts
// src/app-icons/index.ts
export * from './.svg-sprite/index.js'
```

Запустите обычную генерацию:

```bash
npx --yes @gromlab/svg-sprites src/app-icons/svg-sprite.config.json
```

После этого используйте generated-компонент так же, как со спрайтом из локальных SVG:

```tsx
import { AppIcon } from './app-icons'

export function SearchButton() {
  return <AppIcon icon="search" aria-label="Поиск" />
}
```

Тот же CDN manifest поддерживают все 29 consumer modes. В каждом из них сохраняется нативный API выбранного framework и bundler.

## Дебаг и превью

`standalone@server` не создаёт отдельную страницу для просмотра иконок. Подключите опубликованный спрайт к consumer-приложению и откройте его в SpriteViewer: удалённый набор будет отображаться так же, как локальный.
