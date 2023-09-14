import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'ts-out/get-leaderboard-entries.mjs',
  output: {
    file: 'lib/get-leaderboard-entries.mjs',
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
