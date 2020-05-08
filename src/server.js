'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const decode = require('audio-decode');
const PitchShifter = require('pitch-shift');
const fs = require('fs');
const toWav = require('audiobuffer-to-wav');
const AudioBuffer = require('audio-buffer');
const WavDecoder = require('wav-decoder');

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
        convertFileToData(req.file, function (originalData) {
            // console.log("******* ORIGINAL DATA ********");
            // fs.appendFile('originalData.txt', originalData, (err) => {
            //     if (err) throw err;
            //     console.log("Wrote original data");
            // });
            // transpose data
            let transposedData = transposeData(originalData, 12, "down");
            //console.log("******* TRANSPOSED DATA *******");
            // fs.appendFile('transposedData.txt', originalData, (err) => {
            //     if (err) throw err;
            //     console.log("Wrote transposed data");
            // });
            // move data to buffer
            let transposedBuffer = moveTransposedDataToBuffer(transposedData);
            // produce file from buffer
            let wav = toWav(transposedBuffer);
            const chunk = new Uint8Array(wav);
            console.log("chunk is ", chunk);
            fs.appendFile('output.wav', Buffer.from(chunk), function (err) {
                if (err) return res.status(500).json(err);
            });
            // need to send new file, also new (and old?) audioBuffer
            return res.status(200).send(req.file);
        });
    });
});

function convertFileToData(file, fn) {
    // WavDecoder.decode(file.buffer).then(function(audioData) {
    //     console.log("WAVE DECODER STUFF");
    //     console.log(audioData.sampleRate);
    //     console.log(audioData.channelData[0]); // Float32Array
    //     console.log(audioData.channelData[1]); // Float32Array
    // });
    decode(file, (err, originalBuffer) => {
        if (err) {
            console.log("Incorrect file format.");
            return;
        }
        let wav = toWav(originalBuffer);
        const chunk = new Uint8Array(wav);
        console.log("original chunk is ", chunk);
        fs.appendFile('input.wav', Buffer.from(chunk), function (err) {
            if (err) console.log("ERROR");
        });
        let originalData = new Array(originalBuffer.numberOfChannels);
        for (let i = 0; i < originalData.length; i++) {
            const channelData = new Float32Array(originalBuffer.length);
            originalData[i] = channelData;
            originalBuffer.copyFromChannel(channelData, i);
        }
        fn(originalData);
    })
}

function transposeData(data, steps, direction) {
    let transposedData = new Array(data.length);
    const numSteps = direction === "up" ? steps : -steps;
    console.log("numSteps: ", numSteps);
    const frame_size = 2048;
    for (let i = 0; i < data.length; i++) {
        const channelData = data[i];
        const transposedChannel = new Float32Array(channelData.length);
        let pointer = 0;
        const shifter = new PitchShifter(
            function onData(frame) {
                transposedChannel.set(frame, pointer);
                pointer += frame.length;
            },
            function onTune(t, pitch) {
                return Math.pow(2, numSteps / 12);
            }, {
                sampleRate: 48000
            });
        for (let j = 0; j + frame_size < channelData.length; j += frame_size) {
            shifter(channelData.subarray(j, j + frame_size));
        }
        transposedData[i] = transposedChannel;
    }
    return transposedData;
}

function moveTransposedDataToBuffer(transposedData) {
    let transposedBuffer = new AudioBuffer({
        length: transposedData[0].length,
        numberOfChannels: transposedData.length
    });
    for (let i = 0; i < transposedData.length; i++) {
        const channelData = transposedData[i];
        transposedBuffer.copyToChannel(channelData, i);
    }
    return transposedBuffer;
}

app.listen(8000, function() {
    console.log('App running on port 8000');
});