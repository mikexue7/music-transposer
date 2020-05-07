'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const decode = require('audio-decode');

let originalData;
let transposedData;
let transposedBuffer;

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
        convertFileToData(req.file);
        // transpose data
        transposeData(originalData, 3);
        // need to send new file, also new audioBuffer
        return res.status(200).send(req.file);
    });
});

function convertFileToData(file) {
    decode(file, (err, originalBuffer) => {
        if (err) {
            console.log("Incorrect file format.");
            return;
        }
        originalData = new Array(originalBuffer.numberOfChannels);
        for (let i = 0; i < originalData.length; i++) {
            const channelData = new Float32Array(originalBuffer.length);
            originalData[i] = channelData;
            originalBuffer.copyFromChannel(channelData, i + 1);
        }
    })
}

function transposeData(data, numSteps, direction) {

}

function moveTransposedDataToBuffer() {
    transposedBuffer = new AudioBuffer({length: transposedData[0].length, numberOfChannels: transposedData.length});
    for (let i = 0; i < transposedData.length; i++) {
        const channelData = transposedData[i];
        transposedBuffer.copyToChannel(channelData, i + 1);
    }
}

app.listen(8000, function() {
    console.log('App running on port 8000');
});