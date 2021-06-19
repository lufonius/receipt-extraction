var express = require('express')
var proxy = require('http-proxy-middleware')

var app = express()

app.use(proxy.createProxyMiddleware('/images', {
  target: 'https://drezip.blob.core.windows.net',
  changeOrigin: true,
  secure: true,
  logLevel: "debug",
  pathRewrite: {'^/images' : ''}
}))
app.use(proxy.createProxyMiddleware('/api', { target: 'http://localhost:8080', changeOrigin: true }))
app.use(proxy.createProxyMiddleware('/', { target: 'https://localhost:3333', changeOrigin: true, secure: false }))
app.listen(3336)
