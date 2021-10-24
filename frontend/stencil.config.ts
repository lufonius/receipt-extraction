import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { readFileSync } from 'fs';

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: {},
      baseUrl: '/',
      copy: [
        {
          src: '../node_modules/reflect-metadata/Reflect.js',
          dest: 'lib/reflect.js'
        },
        {
          src: '../node_modules/qrcode/build/qrcode.min.js',
          dest: 'lib/qrcode.min.js'
        },
        {
          src: '../node_modules/feather-icons/dist/feather-sprite.svg',
          dest: 'lib/feather-sprite.svg'
        },
        {
          src: '../node_modules/qr-scanner/qr-scanner.umd.min.js',
          dest: 'lib/qr-scanner.umd.min.js'
        },
        {
          src: '../node_modules/qr-scanner/qr-scanner-worker.min.js',
          dest: 'lib/qr-scanner-worker.min.js'
        },
        {
          src: '../src/global/opencv/opencv.js',
          dest: 'lib/opencv.js'
        },
        {
          src: '../src/global/service-worker.js',
          dest: 'service-worker.js'
        }
      ]
    },
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    https: {
      cert: readFileSync('cert.pem', 'utf8'),
      key: readFileSync('key.pem', 'utf8')
    },
    gzip: true,
    port: 3333
  },
  plugins: [
    sass()
  ]
};
