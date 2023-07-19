import fs from 'node:fs/promises'
import { basename } from 'node:path'
import fg from 'fast-glob'

const files = await fg('src/models/*.*')

const result = await Promise.all(files.map(async (path) => {
  const f = await fs.readFile(path)
  const base64 = f.toString('base64')
  return [basename(path), base64]
}))

const content = [
  ...result.map(([name, base64]) => `export const ${name.replace(/\./g, '_')} = Uint8Array.from(atob(${JSON.stringify(base64)}), c => c.charCodeAt(0))`),
]

fs.writeFile('src/assets/models.ts', content.join('\n'), 'utf-8')
