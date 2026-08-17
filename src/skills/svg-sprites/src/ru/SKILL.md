# @gromlab/svg-sprites

## Что делает пакет

`@gromlab/svg-sprites` — CLI-генератор SVG-спрайтов для пользовательских SVG-файлов. Пакет не содержит собственного набора иконок: он собирает SVG проекта во внешний sprite asset и создаёт типизированный нативный компонент для выбранного exact framework/bundler mode.

Пакет рассчитан на несколько независимых спрайтов в одном проекте. Каждый явно выбранный config-файл или config-less каталог описывает один спрайт и получает собственные:

- SVG asset;
- mode-specific manifest data;
- для всех modes, кроме bare `standalone`, — типы имён и production entry `.svg-sprite/index.js`;
- для framework modes — изолированный нативный компонент и declarations;
- для `standalone@vite`/`standalone@webpack` — нативный Web Component с явной функцией регистрации;
- для bare `standalone` — deployment-neutral JSON manifest без публичного URL.
- для `standalone@server` — content-addressed server release с двумя compile profiles и integrity manifest.

Количество и расположение каталогов определяет проект. Например, `name: 'file-manager'` создаёт `FileManagerIcon`, `FileManagerIconName` и `fileManagerIconNames`, а другой каталог с `name: 'navigation'` создаст отдельный `NavigationIcon`. Это примеры API отдельных спрайтов, а не фиксированные экспорты пакета.

Generated production runtime и declarations не импортируют `@gromlab/svg-sprites`. Генерация через `npx --yes @gromlab/svg-sprites <path-to-config>` не добавляет package в проект. Устанавливай его как development dependency только для Viewer, package-типов config или программного API.

Любой consumer exact mode может использовать `source: 'remote'` с одним local path
или HTTP(S) URL manifest, созданного `standalone@server`. До запуска adapter генератор
скачивает и проверяет нужный profile, после чего создаётся обычный локальный API и
asset; в runtime браузер не зависит от server manifest.

## Выбор режима

Выбери ровно один поддерживаемый mode key:

| Проект | Mode key |
|---|---|
| Static HTML / собственная публикация | `standalone` |
| Standalone + Vite | `standalone@vite` |
| Standalone + Webpack 5 | `standalone@webpack` |
| Server или CI release | `standalone@server` |
| React + Vite | `react@vite` |
| React + Webpack 5 | `react@webpack` |
| Vue + Vite | `vue@vite` |
| Vue + Webpack | `vue@webpack` |
| Nuxt + Vite | `nuxt@vite` |
| Nuxt + Webpack | `nuxt@webpack` |
| Svelte + Vite | `svelte@vite` |
| Svelte + Webpack | `svelte@webpack` |
| SvelteKit + Vite | `sveltekit@vite` |
| Angular application builder | `angular@application` |
| Angular + Webpack | `angular@webpack` |
| Astro + Vite | `astro@vite` |
| Solid + Vite | `solid@vite` |
| Solid + Webpack | `solid@webpack` |
| SolidStart + Vite | `solid-start@vite` |
| Preact + Vite | `preact@vite` |
| Preact + Webpack | `preact@webpack` |
| Qwik + Vite | `qwik@vite` |
| Lit + Vite | `lit@vite` |
| Lit + Webpack | `lit@webpack` |
| Alpine.js + Vite | `alpine@vite` |
| Alpine.js + Webpack | `alpine@webpack` |
| Next.js App Router + Turbopack | `next@app/turbopack` |
| Next.js App Router + Webpack 5 | `next@app/webpack` |
| Next.js Pages Router + Turbopack | `next@pages/turbopack` |
| Next.js Pages Router + Webpack 5 | `next@pages/webpack` |

Mode задаётся в config, CLI или программном API. Порядок применения: `defaults → config → CLI/API overrides`. После объединения mode обязателен.

`name` необязателен. Если он не задан, генератор преобразует имя каталога sprite-модуля в kebab-case; для каталогов `svg-sprite` и `svg-sprites` используется имя родительского каталога. Явное `name` должно уже быть записано в kebab-case и начинаться с латинской буквы.

CLI принимает ровно один путь. Путь к файлу `.ts`, `.js` или `.json` загружает именно этот конфиг независимо от имени. Путь к каталогу включает config-less генерацию, и настройки передаются флагами CLI.

```json
{
  "scripts": {
    "sprite:<name>": "npx --yes @gromlab/svg-sprites <path-to-config>",
    "sprite:<name>:cli": "npx --yes @gromlab/svg-sprites --mode <mode-key> <sprite-directory>"
  }
}
```

Генерация через `npx` не добавляет package в проект. Не придумывай сокращённые или generic mode keys и не используй удалённый `legacy`: выбери один полный key из таблицы. Bare `standalone` выбирай только когда приложение само публикует SVG, а `standalone@server` — только для централизованного release, используемого во время генерации consumers. Для нескольких спрайтов создай отдельную команду для каждого config-файла или каталога.

## Инспекция проекта

До изменений установи фактический контракт проекта:

1. Прочитай корневой `package.json`, lock-файл и workspace-конфигурацию; определи framework, bundler и существующие команды.
2. Найди config-файлы, команды `svg-sprites` и импорты generated-компонентов. Имя конфига произвольное; ориентируйся на переданный CLI путь и поля объекта.
3. Определи framework, router при его наличии и фактический bundler по scripts и конфигу. Для Next.js отдельно определи App/Pages Router и сборщик реальных `dev`/`build` команд.
4. Проверь существующие `predev`, `prebuild`, `pretypecheck` и агрегирующие scripts. Не перезаписывай их.
5. Для нового спрайта выбери целевой каталог, не навязывая конкретный слой или архитектуру приложения.
6. Проверь TypeScript и alias-настройки. Для package subpath exports нужен TypeScript 5+ с `moduleResolution: 'bundler'`, `'node16'` или `'nodenext'`.

Для обычного local consumer все input-пути считаются относительно каталога, содержащего явно переданный config-файл; в config-less режиме — относительно переданного каталога. Проверяй local `input` по этому контракту:

- `input?: string | string[]` по умолчанию равен `./icons`;
- каждая строка задаёт папку, точный SVG-файл или glob;
- папка сканируется плоско; вложенные файлы включаются только явным recursive glob, например `./icons/**/*.svg`;
- массив объединяет positive-источники, а элемент с префиксом `!` исключает свои совпадения из общего набора;
- каждый positive-источник должен разрешаться хотя бы в один SVG, поэтому отсутствующая или пустая папка, glob без совпадений, отсутствующий файл или точный путь не к SVG являются ошибкой;
- разрешённые файлы дедуплицируются и детерминированно сортируются;
- разные файлы с одинаковым basename конфликтуют, даже если получены из разных источников.

До применения этих правил выбери нужную ветку:

- `standalone@server` может объединять local strings и HTTP(S) descriptors `{ name, url, sha256? }`; `name` задаёт публичное имя иконки, а необязательный `sha256` проверяет скачанные байты;
- `source: 'remote'` требует ровно одну строку с local path или HTTP(S) URL manifest и не принимает source globs или descriptors;
- remote consumer config содержит только `mode`, `source` и `input`; name, description, transforms и generated notice приходят из проверенного server manifest.

Не копируй общий SVG в несколько папок: добавь его точный путь или подходящий glob в `input` каждого нужного спрайта. Используй `**/*.svg` только для намеренного рекурсивного включения.

## Настройка интеграции

Не воспроизводи настройку mode по памяти. После инспекции проекта выбери один exact mode и открой соответствующий файл из `references/docs/ru/guides/`. Используй guide как базовый рабочий контракт, затем адаптируй его к существующей структуре проекта.

Работай в таком порядке:

1. Определи каталог исходных SVG и каталог одного sprite-модуля. Один config создаёт один независимый спрайт; для нескольких наборов нужны отдельные config-файлы и уникальные `name`.
2. Сверь framework, router и bundler с exact mode. Для Next.js проверяй реальные `dev` и `build` scripts, а не только наличие `next.config.*`.
3. Предпочитай JSON-конфиг, если проекту не нужны package-типы config. TypeScript-конфиг также загружается через CLI, но установка package нужна, когда он импортирует `defineSpriteConfig` или типы.
4. Разрешай все `input` относительно каталога config-файла. Не меняй структуру SVG без необходимости: используй путь к папке, точный файл, glob или массив этих источников.
5. Добавь sprite-команду с явным путём к config. Сохрани существующие `dev`, `build`, `typecheck` и lifecycle hooks; встрой генерацию до первого процесса, импортирующего `.svg-sprite`.
6. Не запускай одну генерацию дважды через одновременный `predev` и `npm run sprites && ...`. Для нескольких спрайтов создай отдельные команды и один агрегирующий script.
7. Если приложение импортирует каталог sprite-модуля, создай пользовательский `index.ts` рядом с `.svg-sprite`; не помещай пользовательские файлы внутрь generated-каталога.
8. Выполни первую генерацию до typecheck или запуска приложения, затем проверь mode-specific output и фактический импорт компонента.

Для централизованного release открой `references/docs/ru/guides/standalone-server.md`.
Генерируй и публикуй весь каталог `.svg-sprite` атомарно. В каждом consumer сохрани
его собственный exact framework mode, укажи `source: 'remote'` и направь `input` на
manifest. Не копируй server files во framework output и не загружай manifest из
runtime приложения.

Не добавляй Viewer автоматически. Подключай его только по запросу пользователя или когда нужна визуальная проверка набора, цветов либо сложных SVG. Способ изоляции Viewer от production бери из exact guide: frameworks, bundlers и routers используют разные границы.

Не копируй snippets между exact modes даже при похожем API. Различаются asset URL, generated-файлы, CSS handling, router boundary и способ подключения debug-инструментов.

## Контракт generated-каталога

Например, после генерации React/Next-каталог имеет следующий вид:

```text
svg-sprite/
├── icons/                              # пользовательские исходники
├── svg-sprite.config.json              # рекомендуемое имя конфига
├── index.ts                            # необязательный пользовательский barrel
├── .gitignore                          # управляет генератор
└── .svg-sprite/
    ├── index.js
    ├── index.d.ts
    ├── icon-data.js
    ├── icon-data.d.ts
    ├── sprite.svg
    ├── svg-sprite.manifest.js
    ├── svg-sprite.manifest.d.ts
    └── react/
        ├── react-component.js
        ├── react-component.d.ts
        └── react-component.module.css
```

Standalone не создаёт `react/`. Bare `standalone` генерирует `sprite.svg` и `svg-sprite.manifest.json`; `standalone@vite`/`standalone@webpack` дополнительно генерируют `index.*`, `icon-data.*` и resolved manifest. Их `index.*` также содержит нативный generated Web Component; bare `standalone` не получает JS runtime и не создаёт `.gitignore`.

`standalone@server` генерирует `sprite.<content-hash>.svg`,
`sprite-root-viewbox.<content-hash>.svg` и `svg-sprite.manifest.json`. У него нет
consumer facade, browser runtime, Viewer entry или `.gitignore`. Manifest хранит
relative URL обоих profiles, полные SHA-256, размеры в байтах, metadata иконок и
настройки transforms.

Редактируй исходные SVG, config-файл и пользовательский `index.ts`. Не изменяй вручную содержимое `.svg-sprite`: повторная генерация его перезапишет. Во всех modes, кроме bare `standalone`, generated `.gitignore` также находится под управлением генератора. Для импорта из корня sprite-модуля создай barrel:

```ts
export * from './.svg-sprite/index.js'
```

Генератор полностью владеет каталогом `.svg-sprite` и заменяет его при каждом запуске. Никогда не помещай туда пользовательские файлы. Генератор также владеет `.gitignore`, когда выбранный mode его создаёт. Bare `standalone` сохраняет пользовательский `.gitignore`, но удаляет управляемый `.gitignore`, оставшийся после другого mode. Generated-пути не должны содержать symlink.

Каждый exact-mode adapter владеет facade, framework-каталогом, runtime нативного компонента, declarations, manifest source, styles и asset URL. React/Next используют `react/`; остальные framework modes используют собственный generated-контракт из соответствующего guide. Standalone bundler modes экспортируют Web Component helpers и типы, а bare `standalone` не создаёт facade. Manifest declarations объявляют типы локально и не импортируют generator package.

В bundler modes спрайт остаётся отдельным asset, а SVG path-данные не встраиваются в JavaScript. Content hash зависит от настроек сборщика. Bare `standalone` создаёт файл с фиксированным именем, а приложение само определяет его публичное имя и версионирование:

- Vite-based adapters используют mode-owned static asset import, сохраняющий sprite внешним;
- `standalone@vite` использует тот же Vite asset-механизм и экспортирует href helper и нативный Web Component без React;
- `standalone@webpack` использует Webpack Asset Modules и экспортирует такой же mode-local Web Component без React;
- Webpack-based adapters и все Next modes используют adapter-owned механизм внешнего asset, обычно `new URL(..., import.meta.url).href`;
- кастомный Webpack SVG loader не должен перехватывать generated `sprite.svg`;
- в Next mode generated-компонент не содержит `'use client'` и работает в Server Components, SSR и SSG; не добавляй клиентскую границу только ради иконки;
- команда сборки Next и mode key должны совпадать: Turbopack с `.../turbopack`, Webpack с `.../webpack`.
- remote consumers всё равно публикуются через локальный asset pipeline своего adapter; не сохраняй и не собирай URL server profile в generated application code.

Для bundler modes не перемещай generated sprite в `public` и не переписывай URL вручную. Для bare `standalone` не перемещай managed original: приложение может явно копировать его в deploy output и само отвечает за публичный URL и очистку копии. При смене mode перегенерируй спрайт с новым полным key.

## Использование, доступность и цвета

Имя компонента зависит от `name` конкретного спрайта. В `standalone@vite` и `standalone@webpack` значение `name: 'file-manager'` создаёт tag `<file-manager-icon>` и функцию `defineFileManagerIconElement()`:

```ts
import { defineFileManagerIconElement } from './svg-sprite'

defineFileManagerIconElement()
```

```html
<file-manager-icon icon="folder" aria-hidden="true"></file-manager-icon>
```

Нативный элемент не имеет runtime-зависимостей, сам выбирает generated ID и `viewBox`, получает URL через bundler и рендерит `<svg><use>` в Shadow DOM. Его property `icon` типизирован точным union имён, но строковые HTML attributes проверяются только в runtime. Размер по умолчанию равен `1em × 1em`; меняй его через CSS на host. Bare `standalone` Web Component не генерирует.

В component modes тот же `name: 'file-manager'` создаёт нативный компонент `FileManagerIcon`; его синтаксис и props определяет exact-mode guide. В React/Next.js значение `name: 'navigation'` создаёт `NavigationIcon`.

Импортируй компонент из корня соответствующего каталога спрайта. `width` и `height` не обязательны: размером можно управлять обычным CSS-классом.

```tsx
import { FileManagerIcon } from './svg-sprite'

export const OpenButton = () => (
  <button type="button">
    <FileManagerIcon icon="folder" className="icon" aria-hidden="true" />
    <span>Открыть</span>
  </button>
)
```

```css
.icon {
  width: 24px;
  height: 24px;
  color: #4b5563;
}
```

`icon` принимает точные имена исходных файлов без `.svg`; неизвестное имя является ошибкой TypeScript. Для небезопасных SVG ID имён генератор хранит публичное имя, но создаёт внутренний стабильный hash ID, поэтому не собирай fragment URL из имени вручную.

По умолчанию компонент рендерит `<svg>` и принимает стандартные SVG attributes: необязательные `width`/`height`, `className`, `style`, `role`, `aria-*` и обработчики. С `wrapped={true}` корнем становится `<span>`, props относятся к span, а внутренний SVG занимает размер wrapper.

Generated-компонент не выбирает семантику за приложение и не добавляет `title`. Для декоративной иконки передай `aria-hidden="true"`; для самостоятельной смысловой иконки передай `role="img"` и доступное имя через `aria-label`. Не дублируй имя, если соседний текст уже озвучивает действие. Интерактивность размещай на `button` или `a`, а не на самой иконке.

Трансформации `removeSize`, `replaceColors` и `addTransition` включены по умолчанию. Для монохромной иконки единственный цвет получает fallback `currentColor`, поэтому управляй CSS-свойством `color`. Для многоцветной передавай типизированные custom properties:

```tsx
<FileManagerIcon
  icon="folder"
  style={{
    '--icon-color-1': '#4b5563',
    '--icon-color-2': '#14b8a6',
  }}
/>
```

Автозамена рассчитана на `fill`/`stroke` attributes и inline `style`. Значения `none`, `transparent`, `inherit`, `unset`, `initial` не заменяются. CSS-классы и внешние stylesheets, gradients, patterns, filters и `url(#...)` проверяй на реальном результате. Переменные страницы работают через `<svg><use>`, но не проникают во внешний документ при `<img>` или `background-image`; CSS mask оставляет только одноцветный силуэт.

`SpriteViewer` необязателен. Установи `@gromlab/svg-sprites` как development dependency, только если проекту нужен Viewer. Он принимает manifests или статически обнаружимые loaders, показывает поиск, темы, цвета и примеры, но production-компоненты от него не зависят.

Перед подключением Viewer открой exact guide. Frameworks, bundlers и routers требуют разных debug entries или client boundaries. Не переноси способ подключения между modes.

## Проверка результата

После изменения конфига или SVG выполни обязательные проверки:

1. Запусти точную sprite-команду. Процесс должен завершиться с кодом `0` и сообщить имя, число иконок, mode и каталог `.svg-sprite`.
2. Проверь output выбранного exact mode:
    - bare `standalone` создаёт `sprite.svg` и `svg-sprite.manifest.json`;
    - `standalone@server` создаёт два content-addressed SVG profiles и server manifest, hashes и relative paths которого соответствуют этим файлам;
    - `standalone@vite` и `standalone@webpack` дополнительно создают `index.*`, `icon-data.*` и JS manifest, но не каталог `react/`;
   - framework modes также создают adapter-owned runtime нативного компонента, declaration и styles.
3. Для modes с public facade проверь `.svg-sprite/index.js`, соседний `index.d.ts`, список имён и фактический импорт через пользовательский barrel.
4. Проверь manifest: mode и target должны соответствовать выбранному adapter, а список иконок — исходным SVG. В bundler modes URL должен формироваться mode-specific способом; bare JSON manifest намеренно не содержит публичного `spriteUrl`.
5. Запусти существующий typecheck проекта, если mode создаёт типы или изменился пользовательский TypeScript-код.
6. Запусти минимальную команду приложения, затронутую изменением: `dev`, build или специализированную проверку проекта.

Не запускай полную production-сборку только ради проверки нового имени иконки. Она нужна, если менялся bundler target, router, Webpack loader, asset URL, deployment path или диагностируется production-only ошибка.

Визуальную проверку, Network и accessibility tree выполняй только при наличии запущенного приложения и браузерных инструментов. Если таких инструментов нет, не утверждай, что цвета, темы, доступность или HTTP-ответ asset проверены; явно укажи непроверенную часть.

Viewer используй для сложных цветов, transforms и массовой визуальной проверки. Не добавляй debug route ради обычной генерации одного спрайта.

## Диагностика

Сопоставь симптом с проверкой и исправляй первопричину:

| Симптом | Вероятная причина | Действие |
|---|---|---|
| `Missing sprite config file or module directory` | Не передан позиционный путь | Передай один config-файл либо каталог для config-less запуска. |
| `Expected one config file or module directory` | Передано несколько путей | Создай отдельную команду на каждый спрайт и объедини scripts. |
| `Sprite mode is required` | Mode отсутствует и в config, и в CLI | Добавь `mode` в объект или передай полный `--mode`. |
| `Unsupported sprite config extension` | Передан файл не `.ts`, `.js` или `.json` | Используй поддерживаемый формат config-файла. |
| Positive input-источник не нашёл SVG | Папка отсутствует или пуста, glob не совпал либо точный путь отсутствует или ведёт не к SVG | Разреши источник от каталога конфига и исправь `input`; каждый positive-элемент должен дать хотя бы один SVG. |
| Иконки из подпапки не появились | От папки ожидалось рекурсивное сканирование | Используй явный glob, например `./icons/**/*.svg`; папки сканируются плоско. |
| Исключённая иконка всё ещё присутствует | У исключения нет префикса `!`, оно находится не в массиве `input` или считается не от того каталога | Добавь совпадающий `!`-элемент и считай его от каталога конфига. |
| CLI выбрал не все источники | Несколько источников поместили в одно значение `--input` или пропустили option | Повтори `--input <path-or-glob>` отдельно для каждого источника или исключения. |
| Конфликт имени иконки или SVG ID | Два разных файла имеют одинаковый basename либо hash-ID столкнулся с именем | Переименуй один исходный SVG; не выбирай файл неявно. |
| `Refusing to overwrite a user file` | В корне sprite-модуля уже есть пользовательский `.gitignore`, который mode должен создать | Не перезаписывай файл: выбери другой sprite-каталог или согласуй перенос существующего `.gitignore`. |
| Нет `.svg-sprite/index.js` или имя отсутствует в autocomplete | Для bare `standalone` это ожидаемо; в остальных modes генерация не запускалась, barrel неверен либо type server держит старый модуль | Сверь exact mode, запусти sprite-команду, проверь `export * from './.svg-sprite/index.js'`, затем typecheck; при необходимости перезапусти TypeScript server. |
| SVG не загружается или URL неверен | Mode не совпадает со сборщиком, неверен Webpack `publicPath` либо кастомный loader перехватил asset | Сверь mode и build-команду, проверь Asset Modules/`publicPath`, исключи generated SVG из несовместимого loader. |
| Next build расходится между SSR и браузером | Модуль сгенерирован для другого bundler/router или URL переписан вручную | Верни generated `new URL(...)`, выбери точный Next mode и перегенерируй. |
| `color` не меняет многоцветную иконку | У иконки несколько переменных или она показана через `<img>`/CSS background | Используй `<FileManagerIcon>`/`<svg><use>` и нужные `--icon-color-N`. |
| Gradient/filter выглядит неверно | Автозамена цветов не гарантирует сложные paint servers | Изучи generated SVG; при необходимости отключи `replaceColors` для спрайта или упрости источник. |
| Viewer пуст | Manifest не создан, loader не обнаружен сборщиком или неверна Client Component boundary | Сначала сгенерируй спрайт, затем сверь manifest import и способ подключения с exact guide; в App Router оставь `'use client'` только в компоненте Viewer. |
| Remote manifest отклонён | Это не schema `standalone@server`, profile path небезопасен или metadata противоречивы | Опубликуй неизменённый полный server release и направь `input` на его JSON manifest. |
| Не прошла integrity-проверка remote sprite | SVG устарел, обрезан или изменён отдельно от manifest | Атомарно переопубликуй manifest и оба content-addressed profiles; никогда не перезаписывай hashed SVG другими байтами. |

При неизвестной ошибке зафиксируй полную CLI-команду, mode, путь к config-файлу или каталогу и первый stack/error message. Затем минимально воспроизведи проблему на одном спрайте, не удаляя пользовательские файлы и управляемый `.gitignore`.

## Карта reference-документации

References являются частью собранного skill. Открывай только документы, относящиеся к текущей задаче, но перед изменением интеграции exact-mode guide обязателен.

### Обзор

- [README пакета](./references/README_RU.md) — возможности, основной React/Next.js пример, все поддерживаемые families и ссылки на документацию.

### Конфигурация

- [Конфигурация](./references/docs/ru/configuration.md) — JSON, JavaScript, TypeScript, поля config, `input` и запуск CLI.

### Exact-mode guides

- [`standalone`](./references/docs/ru/guides/standalone.md) — static HTML и собственная публикация SVG.
- [`standalone@vite`](./references/docs/ru/guides/standalone-vite.md) — vanilla-приложение с Vite и Web Component.
- [`standalone@webpack`](./references/docs/ru/guides/standalone-webpack.md) — vanilla-приложение с Webpack 5 и Web Component.
- [`standalone@server`](./references/docs/ru/guides/standalone-server.md) — централизованный content-addressed release и remote consumers.
- [`react@vite`](./references/docs/ru/guides/react-vite.md) — React с Vite.
- [`react@webpack`](./references/docs/ru/guides/react-webpack.md) — React с Webpack 5.
- [`vue@vite`](./references/docs/ru/guides/vue-vite.md) — Vue с Vite.
- [`vue@webpack`](./references/docs/ru/guides/vue-webpack.md) — Vue с Webpack.
- [`nuxt@vite`](./references/docs/ru/guides/nuxt-vite.md) — Nuxt с Vite.
- [`nuxt@webpack`](./references/docs/ru/guides/nuxt-webpack.md) — Nuxt с Webpack.
- [`svelte@vite`](./references/docs/ru/guides/svelte-vite.md) — Svelte с Vite.
- [`svelte@webpack`](./references/docs/ru/guides/svelte-webpack.md) — Svelte с Webpack.
- [`sveltekit@vite`](./references/docs/ru/guides/sveltekit-vite.md) — SvelteKit с Vite.
- [`angular@application`](./references/docs/ru/guides/angular-application.md) — Angular application builder.
- [`angular@webpack`](./references/docs/ru/guides/angular-webpack.md) — Angular с Webpack.
- [`astro@vite`](./references/docs/ru/guides/astro-vite.md) — Astro с Vite.
- [`solid@vite`](./references/docs/ru/guides/solid-vite.md) — Solid с Vite.
- [`solid@webpack`](./references/docs/ru/guides/solid-webpack.md) — Solid с Webpack.
- [`solid-start@vite`](./references/docs/ru/guides/solid-start-vite.md) — SolidStart с Vite.
- [`preact@vite`](./references/docs/ru/guides/preact-vite.md) — Preact с Vite.
- [`preact@webpack`](./references/docs/ru/guides/preact-webpack.md) — Preact с Webpack.
- [`qwik@vite`](./references/docs/ru/guides/qwik-vite.md) — Qwik с Vite.
- [`lit@vite`](./references/docs/ru/guides/lit-vite.md) — Lit с Vite.
- [`lit@webpack`](./references/docs/ru/guides/lit-webpack.md) — Lit с Webpack.
- [`alpine@vite`](./references/docs/ru/guides/alpine-vite.md) — Alpine.js с Vite.
- [`alpine@webpack`](./references/docs/ru/guides/alpine-webpack.md) — Alpine.js с Webpack.
- [`next@app/turbopack`](./references/docs/ru/guides/next-app-turbopack.md) — Next.js App Router с Turbopack.
- [`next@app/webpack`](./references/docs/ru/guides/next-app-webpack.md) — Next.js App Router с Webpack.
- [`next@pages/turbopack`](./references/docs/ru/guides/next-pages-turbopack.md) — Next.js Pages Router с Turbopack.
- [`next@pages/webpack`](./references/docs/ru/guides/next-pages-webpack.md) — Next.js Pages Router с Webpack.

### Технические справочники

- [Технический справочник](./references/docs/ru/reference/technical.md) — requirements, CLI, naming, generated API, assets, transforms, цвета, Viewer, Git, CI и диагностика.
- [Программный API](./references/docs/ru/reference/programmatic-api.md) — `generateSprite`, overrides, config API, compiler и Viewer runtime.

### Agent-specific reference

- [Сложные SVG](./references/complex-svg.md) — gradients, patterns, filters, masks, `url(#...)`, `viewBox`, fragment IDs и визуальная диагностика.
