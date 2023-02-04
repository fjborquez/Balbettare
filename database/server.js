"use strict";
const FileSystem = require("fs");
const express = require("express"); 
const { client } = require("./postgresql/dbConfig");
require("dotenv").config();
const app = express(); 
 
const data = {
    phrases: undefined
}

async function getPhrases() { 
    client.connect();
    const phrases = await client.query("SELECT * FROM phrases")
    client.end();
    return data.phrases = phrases.rows; 
}

app.get("/say-phrase", sayPhrase);
async function sayPhrase(req, res) {
    if (data.phrases === undefined) {await getPhrases()}; 
    const random = Math.floor(Math.random() * data.phrases.length);  
    const phrase = data.phrases[random];
    res.json({
        phrase: phrase.italian,
        translatedPhrase: phrase.english
    });  
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.DATABASE_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});