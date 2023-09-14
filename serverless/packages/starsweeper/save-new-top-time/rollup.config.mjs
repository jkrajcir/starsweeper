import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'ts-out/save-new-top-time.mjs',
  output: {
    file: 'lib/save-new-top-time.mjs',
    format: 'es'
  },
  plugins: [
    alias({
      entries: {
        '@common': '../../../../../common'
      }
    }),
    nodeResolve({ exportConditions: ['node'] }),
    json(),
    commonjs(),
    terser()
  ]
}
