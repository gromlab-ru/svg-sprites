import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

export function checkSkills(root) {
  // Проверяем Git-поставку и новые неигнорируемые файлы, включая скрытые каталоги.
  const files = [...new Set(execFileSync('git', [
    '-C', root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z',
  ], { encoding: 'utf8' }).split('\0').filter(Boolean))]
    .filter((file) => existsSync(path.join(root, file)))
  const entries = files.filter((file) => path.posix.basename(file).toLowerCase() === 'skill.md')
  const errors = []
  const names = new Map()
  const publicEntry = /^skills\/([^/]+)\/SKILL\.md$/

  if (!entries.some((file) => publicEntry.test(file))) errors.push('Не найдены опубликованные skills.')
  const directories = new Set(files.filter((file) => file.startsWith('skills/') && file.split('/').length > 2)
    .map((file) => file.split('/')[1]))
  for (const directory of directories) {
    const entry = `skills/${directory}/SKILL.md`
    if (!entries.includes(entry)) errors.push(`Отсутствует точка входа: ${entry}`)
  }

  for (const file of entries.sort()) {
    const location = file.match(publicEntry)
    if (!location) errors.push(`SKILL.md вне skills/<имя>/: ${file}. Назовите исходник SKILL.source.md.`)
    const absolute = path.join(root, file)
    if (!lstatSync(absolute).isFile()) {
      errors.push(`SKILL.md должен быть обычным файлом: ${file}`)
      continue
    }
    const frontmatter = readFileSync(absolute, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!frontmatter) {
      errors.push(`Нет YAML-frontmatter: ${file}`)
      continue
    }
    let metadata
    try {
      metadata = parse(frontmatter[1])
    } catch (error) {
      errors.push(`Некорректный YAML в ${file}: ${error.message}`)
      continue
    }
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      errors.push(`Frontmatter должен быть объектом: ${file}`)
      continue
    }
    const { name, description } = metadata
    if (typeof name !== 'string' || name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push(`Некорректное name: ${file}`)
    }
    if (typeof description !== 'string' || !description.trim()) {
      errors.push(`description должен быть непустой строкой: ${file}`)
    }
    if (typeof name === 'string') {
      const key = name.toLowerCase().replace(/[\s_]+/g, '-')
      if (names.has(key)) errors.push(`Повторное имя ${name}: ${names.get(key)} и ${file}`)
      else names.set(key, file)
      if (location && name !== location[1]) errors.push(`name не совпадает с каталогом: ${file}`)
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))
  return [...names.keys()].sort()
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  try {
    console.log(`Проверены skills: ${checkSkills(root).join(', ')}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
