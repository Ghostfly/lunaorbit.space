import filesize from 'rollup-plugin-filesize';
import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import process from 'process';

// import {localeTransformers} from '@lit/localize-tools/lib/rollup.js';

import copy from 'rollup-plugin-copy';

const targets = [
  { src: 'node_modules/@webcomponents', dest: 'dist/node_modules/' },
  { src: 'node_modules/@lit/reactive-element/polyfill-support.js', dest: 'dist/node_modules/@lit/reactive-element/' },
  { src: 'dev/assets', dest: 'dist' },
  { src: 'dev/index.html', dest: 'dist' },
  { src: 'dev/*.png', dest: 'dist/assets' },
  { src: 'dev/*.ico', dest: 'dist/assets' },
  { src: 'dev/*.svg', dest: 'dist/assets' },
  { src: 'dev/*.jpeg', dest: 'dist/assets' },
  { src: 'dev/site.webmanifest', dest: 'dist/assets' },
  { src: 'dev/index.css', dest: 'dist/assets' },
  { src: 'dev/tailwind.css', dest: 'dist/assets' },
  { src: 'dev/robots.txt', dest: 'dist' },
];

const isDev = process.env.BUILD === 'development';

if(isDev){
  // TODO XXX;
}

const copyConfig = {
  targets,
  verbose: true,
};

// const locales = localeTransformers();

export default {
  input: 'luna-orbit.js',
  output: {
    dir: 'dist/',
    format: 'esm',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    typescript({
      outDir: 'dist/',
      transformers: {
        before: [/*locales*/],
      },
    }),
    replace({'Reflect.decorate': 'undefined'}),
    resolve(),
    terser({
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    filesize({
      showBrotliSize: true,
    }),
    copy(copyConfig),
  ],
};
