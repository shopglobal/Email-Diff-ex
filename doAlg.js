const Promise = require('bluebird');
const fs      = require('fs');
module.exports = {

  doAlg: ( fileN ) => {
        let hash = {}
          , readByLine = require('readline').createInterface({
              input: fs.createReadStream( fileN )
            });
        return new Promise(function(resolve) {   
          console.time('foo');
          readByLine.on('line', function(line){
            if( typeof hash[line] == "undefined" ) {
              hash[line] = 1;
            } else {
              hash[line]++;
            }
          });

          readByLine.on('close', function(){ 
            resolve( hash );
          });
        });
      },
      
  writeOutFile: ( hash, fileN ) => {
          return new Promise(function(resolve) {
            let wstream = fs.createWriteStream( fileN );
            for( let line in hash ) {
              if ( hash[line] >= 1 ) {
                wstream.write( line + '<br />' );
                continue; //next line
              }
            }
            wstream.end();
            resolve();
            console.timeEnd('foo');
          });
        }
}