import { defineBuildConfig } from 'unbuild'

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
})
