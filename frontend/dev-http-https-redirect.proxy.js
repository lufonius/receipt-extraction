require('http-proxy').createProxyServer({
  secure: false,
  target: 'https://localhost:3336',
  host: 'localhost'
}).listen(3336);
