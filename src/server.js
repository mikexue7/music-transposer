'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');

app.use(cors());
// app.configure(function(){
//     app.use(express.bodyParser());
//     app.use(app.router);
// });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../public')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

app.post('/upload', function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        // process req.file
        return res.status(200).send(req.file);
    });
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});