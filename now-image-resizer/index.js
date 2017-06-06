// Import both http & https for handling different uris
//var http = require('http');  
//var https = require('https');  
// in order to write to the filesystem we need the `fs` lib
//var fs = require('fs');  
// import the lib

const sharp = require('sharp');
const express = require('express');
const fileUpload = require('express-fileupload');
const mv = require('mv');
const app = express();


/*
var imageUri = 'https://images.unsplash.com/photo-1427805371062-cacdd21273f1?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=7bd7472930019681f251b16e76e05595';

resizeImage(imageUri, [  
  [300, 300,],
  [600, 450,],
])
.then((thumbnailPaths) => console.log('DONE', thumbnailPaths))
.catch((err) => console.log(err));

function resizeImage(imageUri, sizes) {  
  return new Promise((resolve, reject) => {
    // determine wether we need to use `http` or `https` libs
    var httpLib = http;
    if ( /^https/.test(imageUri) ) {
      httpLib = https;
    }
    // begin reading the image
    httpLib.get(imageUri, function(downloadStream) {
      downloadStream.on('error', reject);
      Promise.all(
        sizes.map((size) => resizeAndSave(downloadStream, size))
      )
      .then(resolve)
      .catch(reject);
    });
  });

  function resizeAndSave(downloadStream, size) {
    // create the resize transform
    var resizeTransform = sharp().resize(size[0], size[1]).max();
    return new Promise((resolve, reject) => {
      var outPath = `./output-${ size[0] }x${ size[1] }.jpg`;
      console.log('WRITING', outPath);
      var writeStream = fs.createWriteStream(outPath);
      downloadStream.pipe(resizeTransform).pipe(writeStream);
      downloadStream.on('end', () => resolve(outPath));
      writeStream.on('error', reject);
      resizeTransform.on('error', reject);
    });
  }
}
*/

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  console.log(req.files);
  if (!req.files) return res.status(400).send('No files were uploaded.');
  
  var sampleFile = req.files.file;
  console.log(req.files.file);
  var pathName = './media/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(pathName, function(err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });

  console.log("ASDASDASDASSSSSS");
  var resizedSampleFile = sharp(sampleFile).resize(400, 400);
  var resizedPathName = './media/resized-' + sampleFile.name;

  /*
  resizedSampleFile.mv(resizedPathName, function(err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });*/

  console.log(resizedPathName);

  /*
  resizedSampleFile.toFile(resizedPathName, function(err) {
    console.log("FORRO");
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });*/

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})