# qr-scanner-wechat

[![NPM version](https://img.shields.io/npm/v/qr-scanner-wechat?color=a1b858&label=)](https://www.npmjs.com/package/qr-scanner-wechat)

QR Code scanner for JavaScript, based on a WebAssembly build of [OpenCV](https://opencv.org/) and [WeChat QR Code Scanner](https://docs.opencv.org/4.5.4/d5/d04/classcv_1_1wechat__qrcode_1_1WeChatQRCode.html). Provides a much better detection rate and error tolerance.

Ported and rewritten from [leidenglai/opencv-js-qrcode](https://github.com/leidenglai/opencv-js-qrcode) for modern browser build and easier usage. Huge thanks to [@leidenglai](https://github.com/leidenglai) for the previous work and research.

- [🕹️ Basic playground demo](https://qrcode-wechat.netlify.app/)
- [🛠️ Anthony's QR Toolkit](https://qrcode.antfu.me/#scan)

## Usage

```bash
npm i qr-scanner-wechat
```

```ts 
import { scan } from 'qr-scanner-wechat'

const result = await scan(canvas) // Or ImageElement
```

Upon the first call of `scan`, around **2.5MB gzipped** of WebAssembly and models will be loaded asynchronously.

You can also preload them with:

```ts 
import { ready, scan } from 'qr-scanner-wechat'

await ready()
const result = await scan(canvas)
```

### Stream

In case you want to scan with streams like camera inputs, here is some code snippet for reference

```html
<video id="video">
``` 

```ts
import { scan } from 'qr-scanner-wechat'

const stream = await navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    width: 512,
    height: 512,
  },
})

const video = document.getElementById('video')
video.srcObject = stream
video.play()

async function scanFrame() {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const result = await scan(canvas)

  if (result?.text)
    alert(result?.text)
}

setInterval(scanFrame, 100) // scan one frame every 100ms
```

### Node.js

It's also possible to do scanning on Node.js. To do so, you'll need some additional transformations to an [`ImageData`](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)-compatible format. We recommend using [`sharp`](https://github.com/lovell/sharp) and here is an example:

```ts
import { scan } from 'qrcode-openev-wechat'
import sharp from 'sharp'

const image = sharp('/path/to/image.png') // or Buffer, anything sharp supports

const { data, info } = await image
// .resize(1000) // you can resize first to improve the performance
  .ensureAlpha()
  .raw()
  .toBuffer({
    resolveWithObject: true,
  })

const result = await scan({
  data: Uint8ClampedArray.from(data),
  width: info.width,
  height: info.height,
})

console.log(result?.text)
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023 [Anthony Fu](https://github.com/antfu)
