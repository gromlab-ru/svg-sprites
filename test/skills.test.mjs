import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { checkSkills } from '../scripts/check-skills.mjs'

const valid = '---\nname: example\ndescription: >-\n  Проверенный skill\n---\n# Example\n'

function repository(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-check-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' })
  git('init', '--quiet')
  const write = (file, content) => {
    const target = path.join(root, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, content)
  }
  write('skills/example/SKILL.md', valid)
  return { root, write, git }
}

test('проверяет новый skill с YAML block scalar и отдельным исходником', (t) => {
  const { root, write } = repository(t)
  write('src/example/SKILL.source.md', valid)
  assert.deepEqual(checkSkills(root), ['example'])
})

test('отклоняет одинаковые SKILL.md в исходниках и готовом каталоге', (t) => {
  const { root, write } = repository(t)
  write('src/skills/example/SKILL.md', valid)
  assert.throws(() => checkSkills(root), /Повторное имя example/)
})

test('находит заготовку без frontmatter в скрытом вложенном каталоге', (t) => {
  const { root, write } = repository(t)
  write('.hidden/src/en/SKILL.md', '# Заготовка\n')
  assert.throws(() => checkSkills(root), /Нет YAML-frontmatter: .hidden\/src\/en\/SKILL.md/)
})

for (const [title, metadata, error] of [
  ['нет name', 'description: example', /Некорректное name/],
  ['нет description', 'name: example', /description должен/],
  ['description не строка', 'name: example\ndescription: true', /description должен/],
  ['пустое description', 'name: example\ndescription: "  "', /description должен/],
  ['ошибка YAML', 'name: [example\ndescription: example', /Некорректный YAML/],
  ['повтор поля YAML', 'name: example\nname: example\ndescription: example', /Некорректный YAML/],
  ['имя другого каталога', 'name: another\ndescription: example', /name не совпадает/],
]) {
  test(`отклоняет frontmatter: ${title}`, (t) => {
    const { root, write } = repository(t)
    write('skills/example/SKILL.md', `---\n${metadata}\n---\n# Example\n`)
    assert.throws(() => checkSkills(root), error)
  })
}

test('игнорирует локальные зависимости, но обнаруживает их в Git-поставке', (t) => {
  const { root, write, git } = repository(t)
  write('.gitignore', '/.agents/skills/\n')
  write('.agents/skills/example/SKILL.md', valid)
  assert.deepEqual(checkSkills(root), ['example'])
  git('add', '--force', '.agents/skills/example/SKILL.md')
  assert.throws(() => checkSkills(root), /SKILL.md вне skills/)
})

test('отклоняет каталог skill без точки входа', (t) => {
  const { root, write } = repository(t)
  write('skills/incomplete/reference.md', '# Reference\n')
  assert.throws(() => checkSkills(root), /Отсутствует точка входа: skills\/incomplete\/SKILL.md/)
})
