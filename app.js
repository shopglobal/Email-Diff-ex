
const express = require('express');
const app     = express();
const Busboy  = require('busboy');
const bodyParser = require('body-parser');
const Promise    = require('bluebird');
const fs      = require('fs');
const path    = require('path');
const Alg   = require('./doAlg.js');

let jsonParser = bodyParser.json()
  , fileName;

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
      fileName = saveTo;
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      //res.writeHead(200, { 'Connection': 'close' });
      res.end("got it!");
    });
    return req.pipe(busboy);
});

app.put('/', jsonParser, function( req, res ){
    //console.log(req.body.name);
    
    Alg.doAlg( fileName ).then((hash) => {
      Alg.writeOutFile( hash, fileName )
    }).then(() => {
      console.log('in then');
      let readStream = fs.createReadStream( fileName );
      res.set('Content-Type', 'text/plain');
      readStream.on("error", function(err) {
        console.log("Got error while processing stream " + err.message);
        res.end();
      });
      readStream.pipe(res);
    });
});

let server = app.listen( process.env.PORT || 3000, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('ChefSteps listening on http://%s:%s', host, port);
});
