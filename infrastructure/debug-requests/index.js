const express = require('express')
const app = express()
const port = 8090

app.get('/', (req, res) => {
    const reqData = JSON.stringify({
        headers: req.headers,
        method: req.method,
        url: req.url,
        httpVersion: req.httpVersion,
        body: req.body,
        cookies: req.cookies,
        path: req.path,
        protocol: req.protocol,
        query: req.query,
        hostname: req.hostname,
        ip: req.ip,
        originalUrl: req.originalUrl,
        params: req.params,
    });
    res.send(reqData);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})