# AI skills

Исходники обязательного контекста английского и русского skills находятся в `src/skills/svg-sprites/src/{en,ru}/`. Готовые переносимые артефакты генерируются в корневой каталог `skills/`, версионируются для установки через `npx skills add` и упаковываются в ZIP во время release workflow.

Обе языковые версии имеют симметричную single-file структуру:

```text
src/{en,ru}/
├── SKILL.md
└── references/
    └── complex-svg.md
```

Каждый `SKILL.md` содержит обязательные знания о пакете, рабочий процесс агента и operational map canonical-документации. Exact-mode настройка берётся из canonical guides, а не дублируется отдельными source-фрагментами. Agent-specific `complex-svg.md` остаётся отдельным reference.

Английский artifact дополнительно получает без изменений `README.md` и содержательную пользовательскую документацию из `docs/en/`; русский — `README_RU.md` и `docs/ru/`. Локальный редакторский `guides/AGENTS.md`, а также навигационные `guides/README.md` и `reference/README.md` не копируются. Canonical-файлы находятся в `references/README.md` и `references/docs/en/` либо в `references/README_RU.md` и `references/docs/ru/`.

## Композиция Markdown

Сборщик сохраняет поддержку Markdown includes для будущих документов:

```md
<!-- include: ./fragments/mode-selection.md -->
```

Include раскрываются рекурсивно, путь считается относительно включающего файла. Циклы, отсутствующие файлы, выход за `src/skills/svg-sprites/`, frontmatter во фрагментах и нераскрытые include завершают сборку ошибкой. Заголовки не сдвигаются автоматически: entry содержит единственный `# H1`, inline-фрагменты начинаются с `##`.

## Локальная сборка

```bash
npm run build:skill
```

Команда собирает и валидирует обе языковые версии, затем атомарно заменяет корневой каталог `skills/`. Сборщик проверяет точный список файлов, безопасные пути, symlink, Markdown fences, локальные ссылки и anchors, единственный H1, frontmatter, размер основного документа и отсутствие `TODO`. `npm run check:skill` дополнительно проверяет, что версионируемые артефакты совпадают с результатом сборки.
