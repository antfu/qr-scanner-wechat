<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ScanResult } from '../../src/index'
import { scan } from '../../src/index'

const canvasRect = ref<HTMLCanvasElement>()
const canvasPreview = ref<HTMLCanvasElement>()
const result = ref<ScanResult>()
const selected = ref(false)
const error = ref<any>()

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  error.value = null
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
  })
  reader.readAsDataURL(file)
  const dataurl = await promise
  selected.value = true

  const img = new Image()
  img.src = dataurl as string
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })

  canvasPreview.value!.width = img.width
  canvasPreview.value!.height = img.height
  canvasPreview.value!.getContext('2d')!.drawImage(img, 0, 0)

  const MAX_WIDTH = 400
  const { width, height } = img
  const canvas = document.createElement('canvas')
  canvas.width = MAX_WIDTH
  canvas.height = (MAX_WIDTH * height) / width
  const ctx = canvas.getContext('2d')!
  ctx.filter = 'grayscale(100%) contrast(200%) brightness(100%)'
  ctx.drawImage(img, 0, 0, width, height, 0, 0, MAX_WIDTH, canvas.height)

  try {
    result.value = await scan(canvas, { includeRectCanvas: true })

    if (result.value.rectCanvas) {
      canvasRect.value!.width = result.value.rectCanvas.width
      canvasRect.value!.height = result.value.rectCanvas.height
      canvasRect.value!.getContext('2d')!.drawImage(result.value.rectCanvas, 0, 0)
    }

    console.log('result', result.value)
  }
  catch (e) {
    error.value = e
    console.error(e)
  }
}
</script>

<template>
  <main font-sans p="x-10 y-10" flex="~ col gap-4" max-w-150>
    <div mb-5>
      <span font-light text-2xl>QR Code Scanner Playground</span> <span op50>for</span><br>
      <a href="https://github.com/antfu/qrcode-opencv-wechat" target="_blank" font-mono hover-underline op75>qrcode-opencv-wechat</a>
      <span op35 mx1>by</span>
      <a href="https://antfu.me" target="_blank" hover-underline op50>Anthony Fu</a>
    </div>

    <input type="file" accept="image/*" @change="onFileChange">
    <template v-if="selected">
      <div :class="result?.text ? 'bg-green:10 text-green' : 'text-orange bg-orange:10 '" p5 font-bold>
        {{ result?.text || '(No result)' }}
      </div>
      <canvas ref="canvasPreview" border="~ gray/50 rounded-lg" />
      <canvas v-show="result?.text" ref="canvasRect" border="~ gray/50 rounded-lg" w-50 />
    </template>
    <template v-else>
      Select a QR code image to scan
    </template>
  </main>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #121212;
}
</style>
