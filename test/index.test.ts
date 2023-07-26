import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import sharp from 'sharp'
import { scan } from '../src'

const __filename = fileURLToPath(import.meta.url)

it('should scan', async () => {
  const image = sharp(resolve(__filename, '../fixtures/1.png'))
    .ensureAlpha()
    .raw()

  const metadata = await image.metadata()
  const result = await scan({
    data: Uint8ClampedArray.from(await image.toBuffer()),
    width: metadata.width!,
    height: metadata.height!,
  })

  expect(result.text).toBe('qrcode.antfu.me')
}, { timeout: 30_000 })
