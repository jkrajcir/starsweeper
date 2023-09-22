import alias from '@rollup/plugin-alias'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/save-new-top-time.mts',
  output: {
    file: 'lib/save-new-top-time.mjs',
    format: 'es'
  },
  plugins: [
    alias({
      entries: {
        '@common': '../../../../lib/common'
      }
    }),
    typescript(),
    nodeResolve({ exportConditions: ['node'] }),
    json(),
    commonjs(),
    terser()
  ]
}
