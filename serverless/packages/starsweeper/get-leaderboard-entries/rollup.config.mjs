import alias from '@rollup/plugin-alias'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/get-leaderboard-entries.mts',
  output: {
    file: 'lib/get-leaderboard-entries.mjs',
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
