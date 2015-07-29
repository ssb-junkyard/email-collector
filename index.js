var http = require('http')
var level = require('level')

var db = level('./db')

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  var ip = req.connection.remoteAddress

  console.log(ip, req.method)

  if (req.method == 'OPTIONS') {
    res.writeHead(200)
    return res.end()
  }

  // via GET?
  var qs = require('querystring').parse(require('url').parse(req.url).query)
  if (qs.email) {
    db.put(ip, (qs.name||'_') + ' ' + qs.email)

    res.setHeader('Refresh', '7; url=http://ssbc.github.io')
    res.writeHead(200)
    return res.end('<p>Got it! You\'ll be emailed about any updates on Patchwork\'s release.</p><p>Redirecting you in 5 seconds...</p>')
  }

  // via POST?
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