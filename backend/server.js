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

app.post("/upload-audio", uploadAudio);
function uploadAudio(req, res){
    const file = req.files.file;
    const filepath = "./media/";
    const new_file_name = uuidv4();
    const file_type = ".webm";
    const new_file_path = `${filepath}${new_file_name}/${new_file_name}${file_type}`;
    if (!FileSystem.existsSync(`${filepath}${new_file_name}/`)){
        FileSystem.mkdirSync(`${filepath}${new_file_name}/`);
    } 
    file.mv(new_file_path, async function(err){
        if (err) { 
            console.log("error-has-accured");
            res.json({
                status : "error-has-accured"
            }); 
        } else { 
            console.log("no-error-has-accured"); 
            const transcription = await transcribeAudio();
            res.json({
                status : "no-error-has-accured",
                transcription: transcription
            }); 
        }
    });
}

async function transcribeAudio() { 
    return await new Promise((res, rej) => { 
        const child = spawn('python',["speech-to-text.py"]);
        let transcription;
        child.stdout.on('data', (data) => { 
            transcription = data.toString()
        });    
        child.stdout.on('end', function() { 
            console.log('end');  
            res(transcription);
        });   
    }); 
}

app.get("/say-phrase", sayPhrase);
async function sayPhrase(req, res) {
    const phrases = [
        {
            phrase: "Buonasera, signora Marchi!",
            translatedPhrase: "Good evening, Mrs. Marchi!"
        },{
            phrase: "Piacere!",
            translatedPhrase: "Pleased to meet you!"
        }
    ]
    const random = Math.floor(Math.random() * phrases.length);  
    res.json(phrases[random]);
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.BACKEND_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});