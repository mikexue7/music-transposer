'use strict';

const express = require('express');
var app = express();
const multer = require('multer');
const cors = require('cors');

app.use(cors());
// app.configure(function(){
//     app.use(express.bodyParser());
//     app.use(app.router);
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('file');

app.post('/upload', function(req, res) {
    console.log("sup cuz");
    console.log(upload);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("multer error");
            return res.status(500).json(err);
        } else if (err) {
            console.log("some other shit");
            return res.status(500).json(err);
        }
        return res.status(200).send(req.file);
    });
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});