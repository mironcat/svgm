/* import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'; */
import buble from 'rollup-plugin-buble';
import pkg from './package.json';
import json from 'rollup-plugin-json';
export default [
  // browser-friendly UMD build
/*   {
    input: "src/main.js",
    output: {
      name: "svgd",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      buble({
        // transpile ES2015+ to ES5
        exclude: ["node_modules/**"]
      }),
      json()
    ]
  }, */

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/main.js",
    external: ["svgdom","svg.js"],
    output: [
      { file: pkg.main, format: "cjs", sourcemap:true }
      // { file: pkg.module, format: 'es' }
    ],
    plugins: [
      buble({
        exclude: ["node_modules/**"]
      }),
      json()
    ]
  },
  {
    input: "test/debugnode.js",
    external: ["svgdom", "svg.js"],
    output: [
      { file: pkg.devs, format: "cjs", sourcemap: true }
      // { file: pkg.module, format: 'es' }
    ],
    plugins: [
      buble({
        exclude: ["node_modules/**"]
      }),
      json()
    ]
  }  
];
