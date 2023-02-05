"use strict";
const FileSystem = require("fs");
const express = require("express"); 
const { client } = require("./postgresql/dbConfig");

const cors = require('cors');
require("dotenv").config();

const app = express(); 
app.use(cors())

let Italian_Phrases = undefined;

app.get("/italianPhrase", italianPhrase);
async function italianPhrase(req, res) {  
    if (Italian_Phrases == undefined) {
        client.connect();
        const data = await client.query("SELECT * FROM Italian_Phrases")
        client.end();
        Italian_Phrases = data.rows;
    }  

    const random = Math.floor(Math.random() * Italian_Phrases.length);  
    const phrase = Italian_Phrases[random];

    res.json({
        phrase: phrase.italian_phrase,
        translatedPhrase: phrase.english_translation
    });  
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.DATABASE_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});