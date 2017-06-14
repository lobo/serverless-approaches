const sharp = require('sharp');
const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const mv = require('mv');
const app = express();

function sendFile(path, res) {
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile(path, options, function (error) {
    if (error) {
      console.log(error);
    } else {
      // console.log('Sent:', path);
    }
  });
}

app.get('/images/:key/:name', function(req, res) {
  var name = req.params.name;
  var key = req.params.key;

  const match = key.match(/(\d+)x(\d+)/);
  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);

  var imagePath = './images/originals/' + name;
  var resizedImageDir = './images/' + key
  var resizedImagePath = resizedImageDir + '/' + name;
  resizedImagePath = resizedImagePath.substr(0, imagePath.lastIndexOf('.')) + '.png';
  if (fs.existsSync(resizedImagePath)) {
    sendFile(resizedImagePath, res);
  } else {
    var millisStart = Date.now();
    if (!fs.existsSync(resizedImageDir)) {
      fs.mkdirSync(resizedImageDir);
    }
    sharp(imagePath).resize(width, height).toFile(resizedImagePath, function(err) {
      if(!err) {
        var millisEnd = Date.now();
        var millisDiff = millisEnd - millisStart;
        // console.log('Image ' + name + ' resized to ' + key + ' pixels in ' + millisDiff + ' milliseconds.');
        console.log(millisDiff);
        sendFile(resizedImagePath, res);
      } else {
        console.log(err);
      }
    });
  }
});

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  //console.log(req.files);
  if (!req.files) return res.status(400).send('No files were uploaded.');

  var sampleFile = req.files.file;
  console.log('Uploading: ' + req.files.file.name);
  var pathName = './images/originals/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(pathName, function(err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });

});

app.listen(8080, function () {
  console.log('Image resizer listening on port 8080!')
})
