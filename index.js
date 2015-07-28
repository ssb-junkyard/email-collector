var http = require('http')
var level = require('level')

var db = level('./db')

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  var ip = req.connection.remoteAddress

  console.log(ip, req.method)

  if (req.method != 'POST') {
    res.writeHead(405)
    return res.end('Only POST is supported')
  }

  var body = ''
  req.on('data', function(chunk) { body += chunk })
  req.on('end', function() {
    if (body.length > 1024) {
      res.writeHead(413)
      return res.end('too large')
    }

    if (body)
      db.put(ip, body)
    res.writeHead(200)
    res.end()
  })
}).listen(1986)
console.log('listening on 1986')