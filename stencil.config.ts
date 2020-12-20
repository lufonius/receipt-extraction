import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { readFileSync } from 'fs';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: 'https://myapp.local/',
      copy: [
        {
          src: '../node_modules/reflect-metadata/Reflect.js',
          dest: 'lib/reflect.js'
        },
        {
          src: '../src/global/opencv/opencv.worker.js',
          dest: 'lib/opencv.worker.js'
        },
        {
          src: '../src/global/opencv/opencv.js',
          dest: 'lib/opencv.js'
        }
      ]
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    https: {
      cert: readFileSync('cert.pem', 'utf8'),
      key: readFileSync('key.pem', 'utf8')
    }
  },
  plugins: [
    sass()
  ]
};
