const http = require('http'); //'http', 'url','fs' is a package name hence it cannot be changed
const url = require('url'); 
const fs =  require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 5000;

const mimeTypes = {//types of file supported by your website
    'html':'text/html',
    'css':'text/css',
    'js':'text/javascript',
    'png':'image/png',
    'jpeg':'image/jpeg',
    'jpg':'image/jpg',
};

http.createServer( (req, res) => {

    //EXTRACTING THE FILE NAME FROM URL
    var myuri = url.parse(req.url).pathname;//grabbing the url and also the designated path
    var filename = path.join(process.cwd(), decodeURI(myuri) );//unescape() can be used instead of decodeuri but not suggested
    //'path.join' joins the given path segment
    //'process.cwd() method returns the current working directory of the Node.js process.'
    console.log('File you are looking for is: ' +filename);
    var loadFile;

    try{
        loadFile = fs.lstatSync(filename); //the file is abt to be loaded
    } catch (error){
        res.writeHead(404, {'Content-Type':'text/plain'});//header part of the response
        res.write('404 page not found'); 
        res.end();
        return;
    }

    if(loadFile.isFile()){
       var mimeType = mimeTypes[
           path
           .extname(filename) //checking if the file has extension which is supported by us
           .split('.')
           .reverse()[0]];
       res.writeHead(200, {'Content-Type': mimeType} );
       var filestream =  fs.createReadStream(filename);
       filestream.pipe(res);
    } 
    else if(loadFile.isDirectory()){
        res.writeHead(302, { 'Location': 'index.html'}); //going into the location and looking for index.html
        res.end();
    } else {
        res.writeHead(500, {'Content-Type':'text/plain'});
        res.write('500 Internal error'); //header part of the response
        res.end();
    }
}).listen(port, hostname, () =>{
    console.log(`Server is running at ${port}`);
} )
