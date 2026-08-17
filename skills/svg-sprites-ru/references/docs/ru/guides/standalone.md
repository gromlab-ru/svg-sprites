# SVG-спрайт для сайта без сборщика

Соберите SVG-иконки в один файл и используйте их на HTML-странице.

## Генерация спрайта

Устанавливать пакет в проект не нужно.

### 1. Создайте конфиг спрайта

Выберите каталог для будущего SVG-спрайта, например `assets/app-icons`, и создайте в нём `svg-sprite.config.json`. В `input` укажите путь к существующим SVG относительно файла конфигурации. Перемещать или копировать иконки не требуется.

```json
{
  "mode": "standalone",
  "name": "icons",
  "input": "../svg-icons/**/*.svg"
}
```

### 2. Сгенерируйте спрайт

Передайте команде путь к конфигу:

```bash
npx --yes @gromlab/svg-sprites assets/app-icons/svg-sprite.config.json
```

Пакет соберёт иконки в каталог `.svg-sprite` рядом с конфигом:

```text
assets/app-icons/.svg-sprite/
├── sprite.svg
└── svg-sprite.manifest.json
```

- `sprite.svg` — готовый спрайт для использования на сайте.
- `svg-sprite.manifest.json` — данные об иконках для Viewer.

Каталог `.svg-sprite` создаётся автоматически и полностью заменяется при каждой генерации. Не редактируйте его содержимое вручную.

### 3. Используйте иконку

В `index.html` укажите путь к созданному `sprite.svg`. После `#` добавьте имя нужной иконки без расширения `.svg`:

```html
<svg
  width="24"
  height="24"
  aria-label="Готово"
>
  <use href="./assets/app-icons/.svg-sprite/sprite.svg#icon-name"></use>
</svg>
```

## Дебаг и превью

`sprite.svg` — технический файл, а не галерея иконок. При его открытии нельзя удобно просмотреть весь набор. Кроме того, градиенты, маски, фильтры и ссылки на внутренние `id` могут отображаться с артефактами.

Для визуальной проверки используйте официальный Viewer. Он показывает все иконки спрайта и помогает проверить их цвета и отображение.

Viewer необязателен и предназначен только для разработки. Устанавливать пакет через npm не нужно.

Viewer работает напрямую с файлами из `.svg-sprite`. Ничего копировать не нужно.

### Добавьте Viewer на страницу

Добавьте в `index.html` module script и укажите пути к generated manifest и спрайту:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@gromlab/svg-sprites/dist/viewer-element.js"
></script>

<gromlab-sprite-viewer
  viewer-title="Иконки проекта"
  manifest-url="./assets/app-icons/.svg-sprite/svg-sprite.manifest.json"
  sprite-url="./assets/app-icons/.svg-sprite/sprite.svg"
></gromlab-sprite-viewer>
```

Viewer можно вынести в отдельный HTML-файл в корне сайта, предназначенный только для разработки и проверки иконок.
