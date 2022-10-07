"use strict";
const FileSystem = require("fs");
const express = require("express");
const upload = require("express-fileupload");
const spawn = require("child_process").spawn;
const { v4: uuidv4 } = require("uuid");
const cors = require('cors');
require("dotenv").config();
const app = express();
app.use(cors())
app.use(upload({
  limits: { fileSize: 1024 * 1024 * 1024 * 1 },
}));

app.post("/upload-video", uploadVideo);
function uploadVideo(req, res){
    const file = req.files.file;
    const filepath = "./media/video/";
    const new_file_name = uuidv4();
    const file_type = ".mp4";
    const new_file_path = `${filepath}${new_file_name}/${new_file_name}${file_type}`;
    if (!FileSystem.existsSync(`${filepath}${new_file_name}/`)){
        FileSystem.mkdirSync(`${filepath}${new_file_name}/`);
    } 
    file.mv(new_file_path, async function(err){
        if (err) { 
            console.log("error-has-accured");
            res.json("error-has-accured");
        } else { 
            console.log("no-error-has-accured"); 
            res.json("no-error-has-accured");
            createSubtitles(new_file_path)
        }
    });
}

function createSubtitles(file_path) {
    console.time();
    const whisper = spawn('ipython',["whisper.ipynb", file_path]);
    whisper.stdout.on('data', (data) => {
        console.log(data.toString());
        console.timeEnd();
    });    
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.BACKEND_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});