import { defineBuildConfig } from 'unbuild'
import type { Plugin } from 'vite'
import { transform } from 'esbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/wasm',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
    cjsBridge: false,
  },
  hooks: {
    'rollup:options': function (ctx, options) {
      options.plugins ||= []
      // @ts-expect-error force
      options.plugins.push(<Plugin>{
        name: 'wasm-minify',
        async renderChunk(code, chunk) {
          if (chunk.name === 'wasm' && !chunk.fileName.endsWith('.d.ts')) {
            const result = await transform(code, {
              minify: true,
              target: 'es6',
              minifyIdentifiers: true,
            })
            return {
              code: result.code,
              map: result.map,
            }
          }
        },
      })
    },
  },
})
