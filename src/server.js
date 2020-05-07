'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const decode = require('audio-decode');

let audioData;

app.use(cors());

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
        fileToData(req.file);
        // need to send new file, also new audioBuffer
        return res.status(200).send(req.file);
    });
});

function fileToData(file) {
    decode(file, (err, audioBuffer) => {
        if (err) {
            console.log("Incorrect file format.");
            return;
        }
        audioData = new Float32Array(audioBuffer.length);
        console.log(audioBuffer.length);
        console.log(audioBuffer.numberOfChannels)
        audioBuffer.copyFromChannel(audioData, 1);
        console.log(audioData);
    })
}

function transpose(data, numSteps, direction) {

}

app.listen(8000, function() {
    console.log('App running on port 8000');
});