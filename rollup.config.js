import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import pkg from './package.json';
import json from 'rollup-plugin-json';
import { uglify } from "rollup-plugin-uglify";
const production = process.env.PRODUCTION;
console.log('production:' + production);
export default [
  // browser-friendly UMD build
  {
    input: "src/main.js",
    external: ["svg.js"],
    output: {
      name: "svgm",
      file: pkg.browser,
      format: "umd",
      globals: {
        'svg.js': 'SVG'
      }
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      buble({
        // transpile ES2015+ to ES5
        exclude: ["node_modules/**"]
      }),
      //json(),
      production && uglify() // minify, but only in production
    ]
  },
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
  // compile files for debuggin in node with visual studio code
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
