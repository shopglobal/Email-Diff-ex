
const express = require('express');
const app     = express();
const Busboy  = require('busboy');
const fs      = require('fs');
const path    = require('path');

app.use( express.static('public') );

app.get('/', function( req, res ) {
  res.sendFile( __dirname + '/public/html/index.html');
});

app.post('/', function( req, res ) {
    const busboy = new Busboy({ 
      headers: req.headers, 
      highWaterMark: 2 * 1024 * 1024,
      limits: {
        fileSize: 10 * 1024 * 1024
      } 
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join('./uploads/', filename);
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(busboy);
});

let server = app.listen( process.env.PORT || 3000, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('ChefSteps listening on http://%s:%s', host, port);
});

/*
  let busboy = new Busboy({
    immediate: true,
    headers: req.headers,
    highWaterMark: 2 * 1024 * 1024,
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  });
  */