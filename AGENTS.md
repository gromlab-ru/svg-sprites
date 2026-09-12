# Архитектурные правила

## Изоляция modes

Каждый полный mode key является независимым adapter со своим generated-контрактом:

- `react@vite`;
- `react@webpack`;
- `next@app/turbopack`;
- `next@app/webpack`;
- `next@pages/turbopack`;
- `next@pages/webpack`;
- `standalone`;
- `standalone@vite`;
- `standalone@webpack`;
- `standalone@server`;
- `vue@vite`;
- `vue@webpack`;
- `nuxt@vite`;
- `nuxt@webpack`;
- `svelte@vite`;
- `svelte@webpack`;
- `sveltekit@vite`;
- `angular@application`;
- `angular@webpack`;
- `astro@vite`;
- `solid@vite`;
- `solid@webpack`;
- `solid-start@vite`;
- `preact@vite`;
- `preact@webpack`;
- `qwik@vite`;
- `lit@vite`;
- `lit@webpack`;
- `alpine@vite`;
- `alpine@webpack`;
- будущие exact modes.

Для каждого exact mode используется отдельный каталог `src/modes/<mode-slug>/`. Adapter самостоятельно определяет:

- compile options;
- список и имена generated-файлов;
- runtime JavaScript;
- TypeScript declarations;
- manifest source;
- CSS;
- способ получения asset URL;
- mode-specific result metadata.

Изменение output одного mode не должно менять output другого mode. Дублирование component, manifest, declaration и CSS codegen между adapters является сознательной ценой изоляции.

Запрещено:

- импортировать один `src/modes/<exact>/` из другого mode;
- создавать общий framework/component/manifest/CSS codegen для нескольких modes;
- создавать общий runtime asset URL generator для нескольких modes;
- ветвиться по generic target внутри adapter;
- писать generated-файлы непосредственно из adapter через `fs`;
- импортировать exact-mode adapters из core.

Единственное место, которое импортирует все adapters, — `src/mode-registry.ts`.

## Общий core

Общими могут быть только mode-neutral данные и инфраструктура:

- загрузка, merge и валидация config;
- scanner исходных SVG;
- shape IDs и проверка конфликтов;
- низкоуровневый SVG compiler и transformations;
- подготовка нейтрального compiled artifact;
- protocol `ModeAdapter`/`OutputPlan`;
- проверка output paths;
- staged directory writer и symlink protection;
- logger и базовые result types.

Core не генерирует JavaScript, declarations, manifest source, CSS или framework-specific exports. Изменение общего compiler может ожидаемо изменить SVG всех modes; изменение generated source должно быть локально одному adapter.

Mode-neutral инфраструктура также может загружать и проверять manifest и готовые SVG profiles, созданные `standalone@server`. Сетевой слой не генерирует framework output и передаёт adapter только проверенный compiled artifact.

## Generated-контракт

Один config разрешается ровно в один mode и один output. Множественные modes не генерируются в один root; orchestration выполняется независимыми config/API/CLI вызовами.

Каждый adapter генерирует один нативный для фреймворка runtime-контракт, совместимый со стандартными JavaScript- и TypeScript-конфигурациями этого фреймворка. Предпочтительный output — ESM JavaScript; если framework compiler требует собственный формат, допускаются framework-native контейнеры с JavaScript-синтаксисом (`.jsx`, `.svelte`, `.astro` и аналогичные). `.tsx` и TypeScript runtime запрещены, кроме frameworks вроде Angular, чей штатный production toolchain требует TypeScript. Типизация всегда добавляется отдельными `.d.ts`; отдельные JS- и TS-реализации одного компонента не создаются.

Integration-стенд должен собирать runtime как JavaScript-потребитель без дополнительной TypeScript-настройки, когда framework это допускает. TypeScript-совместимость того же generated API проверяется отдельным type probe внутри стенда. Framework-native adapter нельзя подменять consumer-примером другого mode или Web Component facade.

Core writer полностью владеет каталогом `.svg-sprite` и при каждой генерации заменяет его через временный каталог с rollback при ошибке. Корневым `.gitignore` writer владеет, когда exact-mode adapter запрашивает его через `OutputPlan`. Bare `standalone` не создаёт `.gitignore`; остальные modes создают.

Sprite-level asset, icon data, manifest и facade лежат непосредственно в `.svg-sprite/`. `standalone@vite` и `standalone@webpack` генерируют нативный icon Web Component внутри своего facade; bare `standalone` остаётся без JavaScript runtime. Framework runtime группируется отдельно: React adapters используют `.svg-sprite/react/`, будущие framework adapters получают собственный framework-каталог.

`standalone@server` принимает local paths/globs и HTTP(S) descriptors `{ name, url, sha256? }`, создаёт content-addressed SVG profiles и JSON manifest. Он не создаёт consumer runtime или `.gitignore`. Consumer modes с `source: "remote"` скачивают один из этих profiles до codegen и по-прежнему публикуют SVG через собственный asset pipeline.

Adapter возвращает файлы в памяти. Только core writer проверяет paths, полностью заменяет `.svg-sprite` и обновляет управляемый `.gitignore`.

## Зависимости

Допустимое направление импортов:

```text
public API / CLI
  -> generate
  -> mode-registry
  -> один exact-mode adapter
  -> core protocols and services
```

Обратные и горизонтальные зависимости запрещены:

```text
core -X-> modes
mode A -X-> mode B
mode A -X-> shared output codegen
```

`src/viewer/` с Web Component является framework-neutral browser runtime пакета, а не mode adapter. `src/react/` содержит только React bridge к этому runtime.

## Изменение mode

При работе с adapter:

1. Изменяйте только его каталог и mode-neutral protocol, если это действительно необходимо.
2. Не переносите output-логику в core ради устранения дублирования.
3. Не меняйте generated-контракты других adapters автоматически.
4. Проверяйте отсутствие cross-mode imports.

## AI skills

При изменении исходников или сборки skills следуйте `src/skills/README.md`. После изменения выполните `npm run build:skill`, `npm run check:skills` и `npm run test:skills`.
