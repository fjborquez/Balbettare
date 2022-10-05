"use strict";
const express = require("express");
const upload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
const cors = require('cors');
require("dotenv").config();
const app = express();
app.use(cors())
app.use(upload({
  limits: { fileSize: 1024 * 1024 * 1024 * 2 },
}));

app.post("/upload-video", uploadVideo);
function uploadVideo(req, res){
    const file = req.files.file;
    const new_file_name = uuidv4();
    const file_path = `./media/video/${new_file_name}.mp4`;
    file.mv(file_path, async function(err){
        if (err) { 
            console.log("error-has-accured");
            res.json("error-has-accured")
        } else { 
            console.log("no error-has-accured"); 
            res.json("no error-has-accured")
        }
    });
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.BACKEND_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});