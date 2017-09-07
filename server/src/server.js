const express = require('express')
const app = express()
var http = require('http')

// Constants
const PORT = 9912

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')

  next()
}

app.use(allowCrossDomain)

// App
app.all('/wfapi', function (req, res) {
  let request = http.request({
    port: 80,
    hostname: 'content.warframe.com',
    method: 'GET',
    path: '/dynamic/worldState.php'
  }, (response) => {
    let chunks = ''
    response.setEncoding('utf8')
    // On request response
    response.on('data', (payload) => {
      chunks += payload
    })
    response.on('end', (payload) => {
      res.header("Content-Type", "application/json").send(chunks)
    })
  })

  request.on('error', () => {
    res.status(404).send(JSON.stringify({ error: 'empty' }))
  })

  request.end()
})

app.listen(PORT)
console.log('Running on http://localhost:' + PORT)