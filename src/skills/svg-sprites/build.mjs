import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import configs from './skill.config.mjs'

const skillDir = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(skillDir, '../../..')
const outputRoot = path.join(repositoryRoot, 'skills')
const temporaryParent = path.join(repositoryRoot, '.tmp')
const includePattern = /<!--\s*include:\s*(.*?)\s*-->/g
const isCheck = process.argv.slice(2).includes('--check')

function assertSafeRelativePath(relativePath) {
  if (
    typeof relativePath !== 'string'
    || relativePath.length === 0
    || path.isAbsolute(relativePath)
    || relativePath.split(/[\\/]/).includes('..')
  ) {
    throw new Error(`Unsafe skill path: ${relativePath}`)
  }
}

function assertInside(parentDir, childPath, { allowSame = false } = {}) {
  const relativePath = path.relative(parentDir, childPath)
  if ((allowSame && relativePath === '') || (relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath))) {
    return
  }
  throw new Error(`Path is outside ${parentDir}: ${childPath}`)
}

function readRegularFile(filePath) {
  if (!existsSync(filePath)) throw new Error(`Source file not found: ${filePath}`)
  const stats = lstatSync(filePath)
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new Error(`Source must be a regular file: ${filePath}`)
  }
  return readFileSync(filePath, 'utf8')
}

function listFiles(directory, prefix = '') {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = path.posix.join(prefix, entry.name)
    const filePath = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Skill artifact must not contain symlinks: ${filePath}`)
    if (entry.isDirectory()) files.push(...listFiles(filePath, relativePath))
    else if (entry.isFile()) files.push(relativePath)
    else throw new Error(`Unsupported skill artifact entry: ${filePath}`)
  }
  return files
}

function listDirectoryFiles(directory, extensions, prefix = '') {
  if (!existsSync(directory)) throw new Error(`Source directory not found: ${directory}`)
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = path.posix.join(prefix, entry.name)
    const filePath = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Source directory must not contain symlinks: ${filePath}`)
    if (entry.isDirectory()) files.push(...listDirectoryFiles(filePath, extensions, relativePath))
    else if (entry.isFile() && (extensions.length === 0 || extensions.includes(path.extname(entry.name)))) files.push(relativePath)
    else if (!entry.isFile()) throw new Error(`Unsupported source entry: ${filePath}`)
  }
  return files
}

function resolveIncludes(filePath, stack = []) {
  assertInside(skillDir, filePath)
  if (stack.includes(filePath)) {
    const cycle = [...stack, filePath].map((entry) => path.relative(skillDir, entry)).join(' -> ')
    throw new Error(`Circular Markdown include: ${cycle}`)
  }

  const content = readRegularFile(filePath)
  if (content.startsWith('---')) {
    throw new Error(`Source Markdown must not contain frontmatter: ${path.relative(skillDir, filePath)}`)
  }

  return content.replace(includePattern, (match, includePath) => {
    const trimmedPath = includePath.trim()
    assertSafeRelativePath(trimmedPath)
    if (path.extname(trimmedPath) !== '.md') {
      throw new Error(`Included source must be Markdown: ${trimmedPath}`)
    }
    const includedFile = path.resolve(path.dirname(filePath), trimmedPath)
    assertInside(skillDir, includedFile)
    return `${resolveIncludes(includedFile, [...stack, filePath]).trim()}\n`
  })
}

function renderSkill(config, document) {
  const entryPath = path.resolve(skillDir, document.entry)
  const body = resolveIncludes(entryPath).trim()
  if (includePattern.test(body)) throw new Error(`Unresolved Markdown include: ${document.entry}`)
  includePattern.lastIndex = 0

  const frontmatter = [
    '---',
    `name: ${config.name}`,
    `description: ${JSON.stringify(config.description)}`,
  ]
  frontmatter.push('---')

  return [
    ...frontmatter,
    '',
    `<!-- Generated from src/skills/svg-sprites/${document.entry}. Do not edit manually. -->`,
    '',
    body,
    '',
  ].join('\n')
}

function expandCopies(config) {
  const copies = []
  for (const entry of config.copy ?? []) {
    if (entry.from && entry.to) {
      assertSafeRelativePath(entry.to)
      copies.push({
        from: path.resolve(skillDir, entry.from),
        to: entry.to,
      })
      continue
    }

    if (entry.fromDirectory && entry.toDirectory) {
      assertSafeRelativePath(entry.toDirectory)
      const sourceDirectory = path.resolve(skillDir, entry.fromDirectory)
      const extensions = entry.extensions ?? []
      const sourceFiles = listDirectoryFiles(sourceDirectory, extensions)
      const excluded = new Set((entry.exclude ?? []).map((relativePath) => {
        assertSafeRelativePath(relativePath)
        return relativePath.replaceAll('\\', '/')
      }))
      for (const relativePath of sourceFiles) {
        if (excluded.has(relativePath)) continue
        copies.push({
          from: path.join(sourceDirectory, relativePath),
          to: path.posix.join(entry.toDirectory, relativePath),
        })
      }
      continue
    }

    throw new Error(`Invalid copy entry in ${config.name}`)
  }
  return copies
}

function prepareConfig(config) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.name)) {
    throw new Error(`Invalid skill name: ${config.name}`)
  }
  if (typeof config.description !== 'string' || config.description.trim() === '') {
    throw new Error('Skill description must be a non-empty string')
  }
  if (!Array.isArray(config.documents) || config.documents.length === 0) {
    throw new Error(`Skill documents must be a non-empty array: ${config.name}`)
  }

  assertSafeRelativePath(config.output)
  const outputDir = path.resolve(outputRoot, config.output)
  assertInside(outputRoot, outputDir)

  const documents = config.documents.map((document) => {
    assertSafeRelativePath(document.entry)
    assertSafeRelativePath(document.to)
    const entryPath = path.resolve(skillDir, document.entry)
    assertInside(skillDir, entryPath)
    return { ...document, entryPath }
  })
  const skillDocuments = documents.filter((document) => document.skill === true)
  if (skillDocuments.length !== 1 || skillDocuments[0].to !== 'SKILL.md') {
    throw new Error(`Exactly one skill document targeting SKILL.md is required: ${config.name}`)
  }

  const copies = expandCopies(config)
  const targets = new Set()
  for (const entry of [...documents, ...copies]) {
    if (targets.has(entry.to)) throw new Error(`Duplicate artifact target in ${config.name}: ${entry.to}`)
    targets.add(entry.to)
  }

  return {
    config,
    outputDir,
    outputPath: path.relative(outputRoot, outputDir),
    documents,
    copies,
    expectedFiles: [...targets].sort(),
  }
}

function writeArtifactFile(targetDir, relativePath, content) {
  const targetPath = path.resolve(targetDir, relativePath)
  assertInside(targetDir, targetPath)
  mkdirSync(path.dirname(targetPath), { recursive: true })
  writeFileSync(targetPath, content)
}

function buildSkill(prepared, targetDir) {
  mkdirSync(targetDir, { recursive: true })
  for (const document of prepared.documents) {
    const content = document.skill
      ? renderSkill(prepared.config, document)
      : `${resolveIncludes(document.entryPath).trim()}\n`
    writeArtifactFile(targetDir, document.to, content)
  }

  for (const copy of prepared.copies) {
    writeArtifactFile(targetDir, copy.to, readRegularFile(copy.from))
  }
}

function withoutCodeFences(content, relativePath) {
  const visibleLines = []
  let fence = null
  for (const line of content.split('\n')) {
    const match = line.match(/^\s*(`{3,}|~{3,})/)
    if (match) {
      if (!fence) fence = match[1]
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = null
      continue
    }
    if (!fence) visibleLines.push(line)
  }
  if (fence) throw new Error(`Unbalanced code fence: ${relativePath}`)
  return visibleLines.join('\n')
}

function markdownAnchors(content) {
  const anchors = new Set()
  const occurrences = new Map()
  for (const match of withoutCodeFences(content, 'Markdown').matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const base = match[1]
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N} _-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
    const occurrence = occurrences.get(base) ?? 0
    occurrences.set(base, occurrence + 1)
    anchors.add(occurrence === 0 ? base : `${base}-${occurrence}`)
  }
  return anchors
}

function validateMarkdown(skillRoot, relativePath) {
  const filePath = path.join(skillRoot, relativePath)
  const content = readFileSync(filePath, 'utf8')
  const visibleContent = withoutCodeFences(content, relativePath)
  if (includePattern.test(visibleContent)) throw new Error(`Unresolved Markdown include: ${relativePath}`)
  includePattern.lastIndex = 0

  for (const match of visibleContent.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].trim().split(/\s+['"]/)[0]
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue

    const [rawTargetPath, rawAnchor] = target.split('#', 2)
    let targetPath
    let anchor
    try {
      targetPath = decodeURIComponent(rawTargetPath.split('?')[0])
      anchor = rawAnchor ? decodeURIComponent(rawAnchor).toLowerCase() : ''
    } catch {
      throw new Error(`Invalid encoded link in ${relativePath}: ${target}`)
    }

    const resolvedPath = targetPath
      ? path.resolve(path.dirname(filePath), targetPath)
      : filePath
    assertInside(skillRoot, resolvedPath)
    if (!existsSync(resolvedPath) || !lstatSync(resolvedPath).isFile()) {
      throw new Error(`Broken local link in ${relativePath}: ${target}`)
    }
    if (anchor) {
      const anchors = markdownAnchors(readFileSync(resolvedPath, 'utf8'))
      if (!anchors.has(anchor)) throw new Error(`Broken local anchor in ${relativePath}: ${target}`)
    }
  }
}

function validateArtifact(prepared, skillRoot) {
  const actualFiles = listFiles(skillRoot).sort()
  if (JSON.stringify(actualFiles) !== JSON.stringify(prepared.expectedFiles)) {
    throw new Error(`Unexpected skill files in ${prepared.config.name}:\n${actualFiles.join('\n')}`)
  }

  const skill = readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8')
  if (!skill.startsWith(`---\nname: ${prepared.config.name}\ndescription: `)) {
    throw new Error(`Generated SKILL.md has invalid frontmatter: ${prepared.config.name}`)
  }
  if (/\bTODO\b/.test(skill)) throw new Error(`Generated SKILL.md contains TODO: ${prepared.config.name}`)
  const visibleSkill = withoutCodeFences(skill, 'SKILL.md')
  const h1Count = visibleSkill.match(/^#\s+/gm)?.length ?? 0
  if (h1Count !== 1) throw new Error(`Generated SKILL.md must contain exactly one H1: ${prepared.config.name}`)
  if (prepared.config.maxSkillBytes && Buffer.byteLength(skill) > prepared.config.maxSkillBytes) {
    throw new Error(`Generated SKILL.md exceeds ${prepared.config.maxSkillBytes} bytes: ${prepared.config.name}`)
  }

  for (const relativePath of actualFiles.filter((filePath) => filePath.endsWith('.md'))) {
    validateMarkdown(skillRoot, relativePath)
  }
}

function assertArtifactDirectory(directory) {
  if (!existsSync(directory)) {
    throw new Error('Generated skills are missing. Run npm run build:skill.')
  }
  const stats = lstatSync(directory)
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw new Error(`Skill output must be a directory without symlinks: ${directory}`)
  }
}

function assertArtifactsCurrent(stagedRoot) {
  assertArtifactDirectory(outputRoot)
  const expectedFiles = listFiles(stagedRoot).sort()
  const actualFiles = listFiles(outputRoot).sort()
  const expectedSet = new Set(expectedFiles)
  const actualSet = new Set(actualFiles)
  const missingFiles = expectedFiles.filter((file) => !actualSet.has(file))
  const unexpectedFiles = actualFiles.filter((file) => !expectedSet.has(file))
  const changedFiles = expectedFiles.filter((file) => (
    actualSet.has(file)
    && !readFileSync(path.join(stagedRoot, file)).equals(readFileSync(path.join(outputRoot, file)))
  ))

  if (missingFiles.length || unexpectedFiles.length || changedFiles.length) {
    const details = [
      ...missingFiles.map((file) => `Missing: ${file}`),
      ...unexpectedFiles.map((file) => `Unexpected: ${file}`),
      ...changedFiles.map((file) => `Changed: ${file}`),
    ]
    throw new Error(`Generated skills are out of date. Run npm run build:skill.\n${details.join('\n')}`)
  }
}

function replaceDirectory(stagedDir, outputDir) {
  const backupDir = path.join(path.dirname(stagedDir), `.skills-backup-${process.pid}`)
  rmSync(backupDir, { recursive: true, force: true })
  if (existsSync(outputDir)) {
    assertArtifactDirectory(outputDir)
    renameSync(outputDir, backupDir)
  }
  try {
    renameSync(stagedDir, outputDir)
    rmSync(backupDir, { recursive: true, force: true })
  } catch (error) {
    rmSync(outputDir, { recursive: true, force: true })
    if (existsSync(backupDir)) renameSync(backupDir, outputDir)
    throw error
  }
}

if (!Array.isArray(configs) || configs.length === 0) {
  throw new Error('Skill configs must be a non-empty array')
}

const preparedConfigs = configs.map(prepareConfig)
const names = new Set()
for (const prepared of preparedConfigs) {
  if (names.has(prepared.config.name)) throw new Error(`Duplicate skill name: ${prepared.config.name}`)
  names.add(prepared.config.name)
}
for (const [index, prepared] of preparedConfigs.entries()) {
  for (const other of preparedConfigs.slice(index + 1)) {
    const overlap = path.relative(prepared.outputDir, other.outputDir)
    const reverseOverlap = path.relative(other.outputDir, prepared.outputDir)
    if (overlap === '' || (!overlap.startsWith('..') && !path.isAbsolute(overlap)) || (!reverseOverlap.startsWith('..') && !path.isAbsolute(reverseOverlap))) {
      throw new Error(`Overlapping skill outputs: ${prepared.config.output} and ${other.config.output}`)
    }
  }
}

mkdirSync(temporaryParent, { recursive: true })
const temporaryRoot = mkdtempSync(path.join(temporaryParent, 'skills-build-'))
try {
  for (const prepared of preparedConfigs) {
    const stagedDir = path.join(temporaryRoot, prepared.outputPath)
    buildSkill(prepared, stagedDir)
    validateArtifact(prepared, stagedDir)
  }

  if (isCheck) {
    assertArtifactsCurrent(temporaryRoot)
    for (const prepared of preparedConfigs) {
      console.log(`Skill artifact is up to date: ${prepared.config.name}`)
    }
  } else {
    replaceDirectory(temporaryRoot, outputRoot)
    for (const prepared of preparedConfigs) {
      console.log(`Built skill: ${path.relative(process.cwd(), prepared.outputDir)}`)
    }
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
