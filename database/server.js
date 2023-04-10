"use strict";
const FileSystem = require("fs");
const express = require("express"); 
const { client } = require("./postgresql/dbConfig");

const cors = require('cors');
require("dotenv").config();

const app = express(); 
app.use(cors())

// Cache for Italian_Phrases
let Italian_Phrases = undefined;

// Counter for cycling through Italian_Phrases
let Italian_Phrase_Counter = 0;

app.get("/italianPhrase", italianPhrase);
async function italianPhrase(req, res) {  
    try {
        // Check if Italian_Phrases is cached
        if (Italian_Phrases == undefined) {
            // Connect to the database
            client.connect();
            // Query the database for all Italian phrases
            const data = await client.query("SELECT * FROM Italian_Phrases");
            // Cache the results in the Italian_Phrases variable
            Italian_Phrases = data.rows;
            // Disconnect from the database
            await client.end();
        }  
    
        // Get a random phrase from Italian_Phrases 
        const phrase = Italian_Phrases[Italian_Phrase_Counter];
        
        // Increment the counter and reset it if it exceeds the length of Italian_Phrases
        Italian_Phrase_Counter = (Italian_Phrase_Counter + 1) % Italian_Phrases.length;

        // Return the selected phrase and its translation
        res.json({
            phrase: phrase.italian_phrase,
            translatedPhrase: phrase.english_translation
        });   
    } catch (error) {
        console.error("Error fetching Italian phrase:", error);

        // Return an error response with a status code
        res.status(500).json({
            error: "An error occurred while fetching an Italian phrase. Please try again later."
        });
    }
}

app.get("*", function(req, res){
    res.status(404).redirect("/");
});  

app.set("port", (process.env.DATABASE_PORT || 4000));
app.listen(app.get("port"), function() { 
  console.log("Server running at:" + app.get("port")); 
});